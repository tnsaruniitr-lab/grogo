/**
 * Internal UAT test runner — calls runBotPipeline directly (no HTTP, no webhook).
 * Run with:
 *   TWILIO_SANDBOX=true pnpm --filter @workspace/api-server run uat
 *
 * Each test creates a fresh lead, runs the pipeline, then queries the DB for
 * actual outcomes and compares them against expected values.
 */

import { db } from "@workspace/db";
import {
  clientsTable,
  leadsTable,
  appointmentsTable,
  conversationsTable,
} from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { runBotPipeline } from "./lib/bot-pipeline";

const DOSTELI_TWILIO_SENDER = "whatsapp:+14155238886";

interface TestCase {
  id: string;
  name: string;
  phone: string;
  /** Single turn OR array of messages for multi-turn scenarios. */
  messages: string | string[];
  expectedAction: string;
  expectedStatus: string;
  expectedLang?: string;
  notes?: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: "T01",
    name: "German greeting — qualify path",
    phone: "+4991001",
    messages: "Hallo, ich benötige Informationen zur Pflege meiner Mutter.",
    expectedAction: "qualify",
    expectedStatus: "qualified",
    expectedLang: "de",
  },
  {
    id: "T02",
    name: "Direct service booking — all fields in one turn",
    phone: "+4991002",
    messages:
      "Ich buche hiermit definitiv einen Physiotherapie-Termin. Mein Wunschtermin ist Montag der 23. Juni um 14 Uhr. Bitte buchen Sie das jetzt.",
    expectedAction: "book_service",
    expectedStatus: "appointment_booked",
    expectedLang: "de",
  },
  {
    id: "T03",
    name: "Online consultation booking",
    phone: "+4991003",
    messages:
      "Ja bitte, ich möchte eine Online-Videoberatung buchen und bestätige das. Morgen Vormittag um 10 Uhr passt mir gut.",
    expectedAction: "book_online_consultation",
    expectedStatus: "consultation_booked",
    expectedLang: "de",
  },
  {
    id: "T04",
    name: "Walk-in consultation booking",
    phone: "+4991004",
    messages:
      "Ich bestätige und buche hiermit einen persönlichen Vor-Ort-Beratungstermin. Dienstag Nachmittag um 15 Uhr.",
    expectedAction: "book_walkin_consultation",
    expectedStatus: "consultation_booked",
    expectedLang: "de",
  },
  {
    id: "T05",
    name: "Urgent escalation — distress signal",
    phone: "+4991005",
    messages:
      "DRINGEND! Meine Mutter hat eine medizinische Notfallsituation! Ich brauche sofort einen Rückruf jetzt sofort!",
    expectedAction: "escalate_human",
    expectedStatus: "needs_human",
    expectedLang: "de",
  },
  {
    id: "T06",
    name: "Human escalation — explicit request",
    phone: "+4991006",
    messages:
      "Ich möchte NICHT mit einem Bot sprechen. Bitte verbinden Sie mich sofort mit einem echten menschlichen Berater.",
    expectedAction: "escalate_human",
    expectedStatus: "needs_human",
    expectedLang: "de",
  },
  {
    id: "T07",
    name: "Turkish language detection",
    phone: "+4991007",
    messages: "Merhaba! Fizyoterapi hizmetleri hakkında bilgi almak istiyorum.",
    expectedAction: "qualify",
    expectedStatus: "qualified",
    expectedLang: "tr",
  },
  {
    id: "T08",
    name: "Asset request — price list (requestedAssetType signal)",
    phone: "+4991008",
    messages: "Können Sie mir bitte Ihre aktuelle Preisliste zusenden?",
    expectedAction: "qualify",
    expectedStatus: "qualified",
    expectedLang: "de",
  },
  {
    id: "T09",
    name: "Callback fallback — 4 turns with no service identified",
    phone: "+4991009",
    messages: [
      "Hallo, ich weiß nicht genau was ich brauche.",
      "Ich bin mir noch nicht sicher.",
      "Vielleicht etwas für meine Großmutter, aber ich weiß nicht.",
      "Ich habe immer noch keine Ahnung was ich möchte.",
    ],
    expectedAction: "book_callback",
    expectedStatus: "callback_booked",
    expectedLang: "de",
    notes: "Requires ≥4 turns with no serviceRequested → turnCount gate fires",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

interface RunResult {
  action: string;
  status: string;
  lang: string;
  apptType: string | null;
  apptService: string | null;
  apptCount: number;
  botReply: string;
  hasConfirmTail: boolean;
  hasEscalationMarker: boolean;
  systemNotifs: number;
}

async function getLeadResult(leadId: number, clientId: number): Promise<RunResult> {
  const [leadRows, appts, outbound, systemNotifs] = await Promise.all([
    db.select().from(leadsTable).where(eq(leadsTable.id, leadId)).limit(1),
    db
      .select()
      .from(appointmentsTable)
      .where(and(eq(appointmentsTable.leadId, leadId), eq(appointmentsTable.clientId, clientId))),
    db
      .select()
      .from(conversationsTable)
      .where(and(eq(conversationsTable.leadId, leadId), eq(conversationsTable.direction, "outbound")))
      .orderBy(desc(conversationsTable.id))
      .limit(1),
    db
      .select()
      .from(conversationsTable)
      .where(and(eq(conversationsTable.leadId, leadId), eq(conversationsTable.direction, "system"))),
  ]);

  const lead = leadRows[0];
  const latestReply = outbound[0]?.body ?? "(no reply recorded)";
  const firstAppt = appts[0] ?? null;

  let detectedAction = "qualify";
  if (appts.some((a) => a.type === "service_booking")) detectedAction = "book_service";
  else if (appts.some((a) => a.type === "online_consultation")) detectedAction = "book_online_consultation";
  else if (appts.some((a) => a.type === "walkin_consultation")) detectedAction = "book_walkin_consultation";
  else if (appts.some((a) => a.type === "callback")) detectedAction = "book_callback";
  else if (lead?.status === "needs_human") detectedAction = "escalate_human";

  return {
    action: detectedAction,
    status: lead?.status ?? "(unknown)",
    lang: lead?.language ?? "(unknown)",
    apptType: firstAppt?.type ?? null,
    apptService: firstAppt?.serviceRequested ?? null,
    apptCount: appts.length,
    botReply: latestReply,
    hasConfirmTail: latestReply.includes("✅"),
    hasEscalationMarker: latestReply.includes("🔴"),
    systemNotifs: systemNotifs.length,
  };
}

async function runTest(
  tc: TestCase,
  client: { id: number; name: string; twilioSender: string | null; [key: string]: unknown },
): Promise<{ pass: boolean; result: RunResult; failures: string[] }> {
  const messages = Array.isArray(tc.messages) ? tc.messages : [tc.messages];
  const phone = tc.phone;

  // Clean up previous runs for this test phone
  const existingLeads = await db
    .select()
    .from(leadsTable)
    .where(and(eq(leadsTable.phone, phone), eq(leadsTable.clientId, client.id)));
  for (const el of existingLeads) {
    await db.delete(conversationsTable).where(eq(conversationsTable.leadId, el.id));
    await db.delete(appointmentsTable).where(eq(appointmentsTable.leadId, el.id));
    await db.delete(leadsTable).where(eq(leadsTable.id, el.id));
  }

  // Create fresh lead
  const newLeads = await db
    .insert(leadsTable)
    .values({ clientId: client.id, phone, status: "new" })
    .returning();
  const lead = newLeads[0]!;

  // Run pipeline turn(s) sequentially
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]!;
    const fakeEventId = 99000 + parseInt(tc.id.replace("T0", "").replace("T", "")) * 10 + i;
    try {
      await runBotPipeline({
        clientRecord: client as Parameters<typeof runBotPipeline>[0]["clientRecord"],
        leadId: lead.id,
        messageEventId: fakeEventId,
        userMessage: msg,
        userPhone: phone,
        twilioSender: DOSTELI_TWILIO_SENDER,
      });
    } catch (err) {
      // Errors in pipeline are handled internally; continue
    }
    // Brief gap between turns to avoid race conditions
    if (i < messages.length - 1) await new Promise((r) => setTimeout(r, 300));
  }

  const result = await getLeadResult(lead.id, client.id);

  const failures: string[] = [];

  if (result.action !== tc.expectedAction)
    failures.push(`action: expected "${tc.expectedAction}", got "${result.action}"`);
  if (result.status !== tc.expectedStatus)
    failures.push(`status: expected "${tc.expectedStatus}", got "${result.status}"`);
  if (tc.expectedLang && result.lang !== tc.expectedLang)
    failures.push(`language: expected "${tc.expectedLang}", got "${result.lang}"`);
  if (
    ["book_service", "book_online_consultation", "book_walkin_consultation", "book_callback"].includes(result.action) &&
    !result.hasConfirmTail
  ) {
    failures.push("missing ✅ confirmation tail in reply");
  }
  if (result.action === "escalate_human" && !result.hasEscalationMarker) {
    failures.push("missing 🔴 escalation marker in reply");
  }

  return { pass: failures.length === 0, result, failures };
}

// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const hr = "─".repeat(72);
  const bold = (s: string) => s;

  const clients = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.slug, "dosteli"))
    .limit(1);
  if (!clients.length) throw new Error("Dosteli client not found — run seed first");
  const client = clients[0]!;

  console.log(`\n${"═".repeat(72)}`);
  console.log(`  UAT REPORT — Dosteli WhatsApp Bot`);
  console.log(`  Date    : ${new Date().toISOString()}`);
  console.log(`  Client  : ${client.name} (id=${client.id})`);
  console.log(`  Sandbox : ${process.env.TWILIO_SANDBOX === "true" ? "YES (no real sends)" : "NO — WARNING: real Twilio"}`);
  console.log(`${"═".repeat(72)}\n`);

  const summary: Array<{ tc: TestCase; pass: boolean; result: RunResult; failures: string[] }> = [];

  for (const tc of TEST_CASES) {
    const turns = Array.isArray(tc.messages) ? tc.messages.length : 1;
    process.stdout.write(`[${tc.id}] ${tc.name}${turns > 1 ? ` (${turns} turns)` : ""}...`);
    const { pass, result, failures } = await runTest(tc, client);
    process.stdout.write(` ${pass ? "PASS ✅" : "FAIL ❌"}\n`);
    summary.push({ tc, pass, result, failures });
  }

  console.log(`\n${hr}`);
  console.log("DETAILED RESULTS");
  console.log(hr);

  for (const { tc, pass, result, failures } of summary) {
    console.log(`\n${tc.id}: ${tc.name}  →  ${pass ? "PASS ✅" : "FAIL ❌"}`);
    if (tc.notes) console.log(`  Note    : ${tc.notes}`);
    console.log(`  Action  : expected=${tc.expectedAction}  actual=${result.action}  ${result.action === tc.expectedAction ? "✓" : "✗"}`);
    console.log(`  Status  : expected=${tc.expectedStatus}  actual=${result.status}  ${result.status === tc.expectedStatus ? "✓" : "✗"}`);
    console.log(`  Language: ${result.lang}${tc.expectedLang ? `  (expected: ${tc.expectedLang})  ${result.lang === tc.expectedLang ? "✓" : "✗"}` : ""}`);
    if (result.apptCount > 0)
      console.log(`  Appt    : type=${result.apptType}  service=${result.apptService ?? "(none)"}  count=${result.apptCount}`);
    console.log(`  Confirm : tail=${result.hasConfirmTail ? "✅ present" : "absent"}  escalation=${result.hasEscalationMarker ? "🔴 present" : "absent"}  sys_notifs=${result.systemNotifs}`);
    if (failures.length > 0) console.log(`  Failures: ${failures.join("; ")}`);
    // Print first 280 chars of reply, inline
    const replySnippet = result.botReply.replace(/\n/g, " ↩ ").slice(0, 280);
    console.log(`  Reply   : "${replySnippet}${result.botReply.length > 280 ? "…" : ""}"`);
  }

  const passed = summary.filter((r) => r.pass).length;
  const total = summary.length;
  const pct = Math.round((passed / total) * 100);

  console.log(`\n${"═".repeat(72)}`);
  console.log(`  RESULT: ${passed}/${total} passed  (${pct}%)`);
  if (passed < total) {
    console.log(`  FAILED:`);
    summary
      .filter((r) => !r.pass)
      .forEach((r) => console.log(`    • ${r.tc.id}: ${r.tc.name}`));
  }
  console.log(`${"═".repeat(72)}\n`);

  await (db as unknown as { $client: { end: () => Promise<void> } }).$client.end();
  process.exit(passed === total ? 0 : 1);
}

main().catch((err) => {
  console.error("UAT runner crashed:", err);
  process.exit(1);
});
