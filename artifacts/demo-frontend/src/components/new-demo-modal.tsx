import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Phase = "setup" | "scanning";
type StepStatus = "idle" | "connecting" | "done";

function IconWA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function IconIG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function IconFB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconBrain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.66z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.66z" />
    </svg>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircle({ color }: { color: string }) {
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${color}18`, border: `1.5px solid ${color}50` }}>
      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke={color} strokeWidth="2.2" strokeLinecap="round">
        <path d="M3 8l3.5 3.5L13 4.5" />
      </svg>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative inline-flex items-center shrink-0 focus:outline-none transition-all duration-300"
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? "#22c55e" : "rgba(255,255,255,0.1)",
        border: on ? "none" : "1px solid rgba(255,255,255,0.12)",
        boxShadow: on ? "0 0 12px rgba(34,197,94,0.35)" : "none",
      }}
    >
      <span style={{
        position: "absolute", left: on ? 22 : 2,
        width: 20, height: 20, borderRadius: "50%",
        background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
        transition: "left 0.25s ease",
      }} />
    </button>
  );
}

function PrefilledField({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{icon}</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "ui-monospace, monospace" }}>{value}</span>
      </div>
    </div>
  );
}

interface StepDef {
  id: string;
  label: string;
  sub: string;
  color: string;
  startDelay: number;
  doneDelay: number;
  icon: React.ReactNode;
}

const STEPS: StepDef[] = [
  { id: "instagram", label: "Instagram", sub: "Connecting business account", color: "#E1306C", startDelay: 400, doneDelay: 1900, icon: <IconIG className="w-4 h-4" /> },
  { id: "whatsapp",  label: "WhatsApp Business", sub: "Linking WABA · +49 123 456 789", color: "#25D366", startDelay: 900, doneDelay: 2500, icon: <IconWA className="w-4 h-4" /> },
  { id: "messenger", label: "Messenger", sub: "Connecting CareCompass page", color: "#0084FF", startDelay: 1600, doneDelay: 3200, icon: <IconFB className="w-4 h-4" /> },
  { id: "website",   label: "Website Crawl", sub: "AI scanning carecompass.me", color: "#8B5CF6", startDelay: 2400, doneDelay: 4300, icon: <IconGlobe className="w-4 h-4" /> },
  { id: "knowledge", label: "Knowledge Base", sub: "Building AI context…", color: "#F59E0B", startDelay: 3500, doneDelay: 99999, icon: <IconBrain className="w-4 h-4" /> },
];

function StepRow({ step, status, isLast }: { step: StepDef; status: StepStatus; isLast: boolean }) {
  const visible = status !== "idle";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: visible ? 1 : 0.22, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "11px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${step.color}15`, border: `1px solid ${step.color}28`,
        color: step.color,
      }}>
        {step.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{step.label}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginTop: 2 }}>{step.sub}</div>
        {status === "done" && (
          <div style={{ fontSize: 10, color: step.color, marginTop: 3, fontWeight: 600, opacity: 0.85 }}>
            ✓ Connection request sent
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        {status === "idle"       && <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />}
        {status === "connecting" && <Spinner color={step.color} />}
        {status === "done"       && <CheckCircle color={step.color} />}
      </div>
    </motion.div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewDemoModal({ open, onClose }: Props) {
  const [demoCase, setDemoCase] = useState(false);
  const [phase, setPhase] = useState<Phase>("setup");
  const [stepStates, setStepStates] = useState<Record<string, StepStatus>>({});
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleClose() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("setup");
    setStepStates({});
    setProgress(0);
    setDemoCase(false);
    onClose();
  }

  function startScan() {
    setPhase("scanning");
    setStepStates({});
    setProgress(0);

    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 2.5;
      if (p >= 78) { p = 78; if (intervalRef.current) clearInterval(intervalRef.current); }
      setProgress(p);
    }, 250);

    STEPS.forEach((step) => {
      const t1 = setTimeout(() => setStepStates((s) => ({ ...s, [step.id]: "connecting" })), step.startDelay);
      const t2 = setTimeout(() => setStepStates((s) => ({ ...s, [step.id]: "done" })), step.doneDelay);
      timersRef.current.push(t1, t2);
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Full-screen overlay — handles backdrop click + scrolling */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              overflowY: "auto",
              padding: "20px 16px 40px",
            }}
          >
          {/* Card — stop overlay click from closing when clicking the card */}
          <motion.div
            key="card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{ width: "min(460px, 100%)", marginTop: "auto", marginBottom: "auto", flexShrink: 0 }}
          >
            <div style={{
              borderRadius: 20,
              background: "linear-gradient(160deg, #0e1724 0%, #0b1118 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Top accent line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #22c55e 40%, #16a34a 60%, transparent)" }} />

              {/* Header */}
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(34,197,94,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 16 16" fill="#22c55e" style={{ width: 13, height: 13 }}>
                        <path d="M8 2l1.76 3.57L14 6.36l-3 2.93.71 4.14L8 11.32l-3.71 2.11.71-4.14L2 6.36l4.24-.79L8 2z" />
                      </svg>
                    </div>
                    {phase === "scanning" && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 8px", borderRadius: 20, background: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.25)" }}
                      >
                        Creating
                      </motion.span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                    {phase === "setup" ? "Configure channels & AI knowledge base" : "Setting up your demo environment…"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center rounded-full transition-colors"
                  style={{ width: 30, height: 30, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "20px 24px 24px" }}>
                <AnimatePresence mode="wait">
                  {phase === "setup" ? (
                    <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Demo case toggle row */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 16px", borderRadius: 12,
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${demoCase ? "rgba(34,197,94,0.22)" : "rgba(255,255,255,0.07)"}`,
                        transition: "border-color 0.3s",
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>carecompass.me</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Pre-fill with sample client data</div>
                        </div>
                        <Toggle on={demoCase} onChange={setDemoCase} />
                      </div>

                      {/* Collapsible fields */}
                      <motion.div
                        initial={false}
                        animate={{ height: demoCase ? "auto" : 0, opacity: demoCase ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 2 }}>
                          <PrefilledField label="WABA Number" value="+49 123 456 789" icon={<IconWA className="w-4 h-4" />} />
                          <PrefilledField label="Facebook Page" value="CareCompass · Page ID 83921045" icon={<IconFB className="w-4 h-4" />} />
                          <PrefilledField label="Website" value="carecompass.me" icon={<IconGlobe className="w-4 h-4" />} />
                        </div>
                      </motion.div>

                      {/* CTA */}
                      <button
                        onClick={demoCase ? startScan : undefined}
                        style={{
                          width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
                          fontWeight: 700, fontSize: 14, letterSpacing: "0.02em",
                          cursor: demoCase ? "pointer" : "not-allowed",
                          background: demoCase ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "rgba(255,255,255,0.05)",
                          color: demoCase ? "white" : "rgba(255,255,255,0.2)",
                          boxShadow: demoCase ? "0 4px 20px rgba(34,197,94,0.28)" : "none",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {demoCase ? "Scan & Connect Channels →" : "Enable Demo Case to continue"}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="scanning" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column" }}>
                      {/* Steps */}
                      {STEPS.map((step, i) => (
                        <StepRow key={step.id} step={step} status={stepStates[step.id] ?? "idle"} isLast={i === STEPS.length - 1} />
                      ))}

                      {/* Progress */}
                      <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>Deployment progress</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24" }}>{Math.round(progress)}%</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.07)" }}>
                          <motion.div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #22c55e, #16a34a)", width: `${progress}%` }} />
                        </div>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", margin: "8px 0 0" }}>
                          Scanning your site and connecting channels — this takes a few minutes.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
