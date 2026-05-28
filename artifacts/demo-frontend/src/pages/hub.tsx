import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListDemoClients,
  useDeleteDemoClient,
  useUpdateDemoClient,
  useGetDashboardStats,
  useGetCrawlStatus,
  useTriggerCrawl,
  getBasicAuthHeader,
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Globe,
  LayoutDashboard,
  Copy,
  CheckCheck,
  Trash2,
  Sparkles,
  Loader2,
  Upload,
  Users,
  PhoneCall,
  Settings,
  Pencil,
  RefreshCw,
  Database,
  AlertTriangle,
  CheckCircle2,
  Eye,
  MonitorSmartphone,
  X,
  ExternalLink,
  BookOpen,
  ClipboardCheck,
  Cable,
  Save,
  User,
  FileText,
  Package,
  Cpu,
  CopyPlus,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import { LANG_OPTIONS, type DemoLang } from "@/lib/demo-i18n";
import { INDUSTRY_OPTIONS } from "@/lib/industry-themes";
import { KnowledgeDialog } from "@/components/knowledge-dialog";
import { KnowledgeReviewPanel } from "@/components/knowledge-review-panel";
import { AssetsDialog } from "@/components/assets-dialog";
import { ModelDialog } from "@/components/model-dialog";
import { DuplicateDialog } from "@/components/duplicate-dialog";

/** Build fetch headers that always include the admin Basic Auth credential. */
function authH(extra: Record<string, string> = {}): Record<string, string> {
  const auth = getBasicAuthHeader();
  return auth ? { Authorization: auth, ...extra } : extra;
}

interface BrandingConfig {
  clientId?: number;
  companyName: string;
  slug: string;
  tagline?: string | null;
  heroHeadline?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  city?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  demoLanguage?: string | null;
  demoLanguages?: string[] | null;
  industry?: string | null;
  twilioSender?: string | null;
  defaultMessage?: string | null;
  mode?: "website" | "manual" | "individual" | null;
  liveChatModel?: string | null;
}

interface DemoClient {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  twilioSender?: string;
  demoToken?: string | null;
  branding: BrandingConfig;
}

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function HubPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [editingClient, setEditingClient] = useState<DemoClient | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [previewClient, setPreviewClient] = useState<DemoClient | null>(null);
  const [previewMode, setPreviewMode] = useState<"demo" | "site">("demo");
  const [knowledgeSlug, setKnowledgeSlug] = useState<string | null>(null);
  const [reviewSlug, setReviewSlug] = useState<string | null>(null);
  const [assetsSlug, setAssetsSlug] = useState<string | null>(null);
  const [installClient, setInstallClient] = useState<DemoClient | null>(null);
  const [modelClient, setModelClient] = useState<DemoClient | null>(null);
  const [duplicateClient, setDuplicateClient] = useState<DemoClient | null>(null);

  const { data: clients = [], isLoading } = useListDemoClients<DemoClient[]>({
    query: {
      queryKey: ["demo-clients"],
      select: (d) => d as unknown as DemoClient[],
    },
  });

  const deleteMutation = useDeleteDemoClient({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
        toast({ title: "Demo deleted" });
      },
    },
  });

  const copyLink = async (slug: string, demoToken?: string | null) => {
    const tokenSuffix = demoToken ? `?t=${demoToken}` : "";
    await navigator.clipboard.writeText(`${window.location.origin}/demo/${slug}${tokenSuffix}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 md:px-10 h-14 flex items-center justify-between sticky top-0 z-50 bg-[#0f1117]/95 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-[#A8C334] flex items-center justify-center">
            <Settings className="h-3.5 w-3.5 text-[#1a3a1a]" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">GrowthMonk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Dosteli Internal ↗
          </Link>
          <Button
            size="sm"
            className="gap-1.5 bg-[#A8C334] hover:bg-[#95ae2a] text-[#1a3a1a] font-bold text-xs h-8"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-3.5 w-3.5" /> New Demo
          </Button>
        </div>
      </header>

      <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">All Demos</h1>
          <p className="text-white/50 mt-1.5 text-sm">
            Create branded WhatsApp bot demos for prospects — one link, their look.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
          </div>
        )}

        {!isLoading && clients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <Globe className="h-7 w-7 text-white/20" />
            </div>
            <p className="text-white font-semibold text-lg mb-1">No demos yet</p>
            <p className="text-white/40 text-sm mb-6 max-w-xs">
              Create your first demo — just enter the prospect's website URL.
            </p>
            <Button
              className="gap-2 bg-[#A8C334] hover:bg-[#95ae2a] text-[#1a3a1a] font-bold"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4" /> Create First Demo
            </Button>
          </motion.div>
        )}

        {!isLoading && clients.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {clients.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <BrandCard
                    client={client}
                    copied={copiedSlug === client.slug}
                    onCopy={() => copyLink(client.slug, client.demoToken)}
                    onEdit={() => setEditingClient(client)}
                    onDelete={() => {
                      if (confirm(`Delete demo "${client.branding.companyName}"?`)) {
                        deleteMutation.mutate({ id: client.id });
                      }
                    }}
                    onPreview={(mode) => {
                      setPreviewClient(client);
                      setPreviewMode(mode);
                    }}
                    onKnowledge={() => setKnowledgeSlug(client.slug)}
                    onReview={() => setReviewSlug(client.slug)}
                    onAssets={() => setAssetsSlug(client.slug)}
                    onInstall={() => setInstallClient(client)}
                    onModel={() => setModelClient(client)}
                    onDuplicate={() => setDuplicateClient(client)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <CreateDemoDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
          setShowCreate(false);
        }}
      />

      {editingClient && (
        <EditDemoDialog
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
            setEditingClient(null);
          }}
        />
      )}

      {previewClient && (
        <PreviewModal
          client={previewClient}
          mode={previewMode}
          onModeChange={setPreviewMode}
          onClose={() => setPreviewClient(null)}
        />
      )}

      {reviewSlug && (
        <KnowledgeReviewPanel
          slug={reviewSlug}
          onClose={() => setReviewSlug(null)}
        />
      )}

      {knowledgeSlug && (
        <KnowledgeDialog
          slug={knowledgeSlug}
          onClose={() => setKnowledgeSlug(null)}
        />
      )}

      {assetsSlug && (
        <AssetsDialog
          slug={assetsSlug}
          onClose={() => setAssetsSlug(null)}
        />
      )}

      {installClient && (
        <InstallPanel
          client={installClient}
          onClose={() => setInstallClient(null)}
        />
      )}

      {modelClient && (
        <ModelDialog
          client={modelClient}
          onClose={() => setModelClient(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
            setModelClient(null);
          }}
        />
      )}

      {duplicateClient && (
        <DuplicateDialog
          client={duplicateClient}
          onClose={() => setDuplicateClient(null)}
          onCreated={() => {
            queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
            setDuplicateClient(null);
          }}
        />
      )}
    </div>
  );
}

function InstallPanel({ client, onClose }: { client: DemoClient; onClose: () => void }) {
  const [config, setConfig] = useState<{ manychatApiKey: string | null } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [welcomeText, setWelcomeText] = useState(
    client.branding.defaultMessage ?? `[${client.slug}] Hi! I'm interested in your services 👋`
  );
  const [saving, setSaving] = useState(false);
  const [savedWelcome, setSavedWelcome] = useState(false);

  useEffect(() => {
    fetch("/api/admin/install-config", { headers: authH() })
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ manychatApiKey: null }));
  }, []);

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const saveWelcome = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: authH({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          branding: { ...client.branding, defaultMessage: welcomeText },
        }),
      });
      setSavedWelcome(true);
      setTimeout(() => setSavedWelcome(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const raw = client.branding.twilioSender ?? "";
  const digits = raw.replace("whatsapp:", "").replace(/^\+/, "");
  const waNumber = digits || "15558085030";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(welcomeText)}`;
  const origin = window.location.origin;
  const manychatWebhook = `${origin}/api/webhook/manychat/${client.slug}`;

  const rows: { key: string; label: string; value: string | null; hint?: string }[] = [
    { key: "slug",    label: "Slug",                value: client.slug,                      hint: "Unique identifier — sent in every ManyChat request to route to this brand" },
    { key: "wa",      label: "WhatsApp link",        value: waLink,                           hint: "Paste as the href of the WhatsApp button on their website" },
    { key: "twilio",  label: "Twilio number",        value: `+${waNumber}`,                   hint: "Shared WhatsApp Business number (same for all brands using the sandbox)" },
    { key: "webhook", label: "ManyChat webhook URL", value: manychatWebhook,                  hint: "Unique per brand — POST endpoint, configure in ManyChat → External Request" },
    { key: "apikey",  label: "ManyChat API key",     value: config?.manychatApiKey ?? null,   hint: "Shared key — send as x-api-key header in every ManyChat request" },
  ];

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg bg-[#0f1117] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Cable className="h-4 w-4 text-[#A8C334]" />
            Install & Connect — {client.branding.companyName}
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Copy these details to configure ManyChat and add the WhatsApp button to their website.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">

          {/* Editable: Welcome text */}
          <div className="rounded-xl border border-[#A8C334]/30 bg-[#A8C334]/5 p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8C334]/70">Welcome text</span>
              <button
                onClick={saveWelcome}
                disabled={saving}
                className="flex items-center gap-1 text-[11px] text-white/40 hover:text-[#A8C334] transition-colors disabled:opacity-40"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : savedWelcome ? (
                  <><CheckCheck className="h-3.5 w-3.5 text-[#A8C334]" /> Saved!</>
                ) : (
                  <><Save className="h-3.5 w-3.5" /> Save</>
                )}
              </button>
            </div>
            <input
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-white/80 outline-none placeholder-white/20 border-none"
              placeholder={`[${client.slug}] Hi, I'm interested in…`}
            />
            <p className="text-[10px] text-white/25 mt-1.5 leading-relaxed">Pre-filled message when the user taps the WhatsApp button — updates the link above live</p>
          </div>

          {/* Read-only copy rows */}
          {rows.map(({ key, label, value, hint }) => (
            <div key={key} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{label}</span>
                {value ? (
                  <button
                    onClick={() => copy(key, value)}
                    className="flex items-center gap-1 text-[11px] text-white/40 hover:text-[#A8C334] transition-colors"
                  >
                    {copied === key ? <CheckCheck className="h-3.5 w-3.5 text-[#A8C334]" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === key ? "Copied!" : "Copy"}
                  </button>
                ) : (
                  <span className="text-[11px] text-white/20 italic">not configured</span>
                )}
              </div>
              <p className="font-mono text-xs text-white/70 break-all leading-relaxed">
                {value ?? <span className="text-white/20 not-italic font-sans">—</span>}
              </p>
              {hint && <p className="text-[10px] text-white/25 mt-1.5 leading-relaxed">{hint}</p>}
            </div>
          ))}
        </div>

        {!config && (
          <p className="text-xs text-white/30 text-center mt-1 flex items-center justify-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading API key…
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BrandLogo({ logoUrl, companyName, secondary }: { logoUrl?: string | null; companyName: string; secondary: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (logoUrl && !imgFailed) {
    return (
      <img
        src={logoUrl}
        alt={companyName}
        className="h-10 w-auto max-w-[120px] object-contain rounded drop-shadow"
        onError={() => setImgFailed(true)}
      />
    );
  }
  return (
    <div
      className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow"
      style={{ backgroundColor: secondary }}
    >
      {companyName.slice(0, 2).toUpperCase()}
    </div>
  );
}

function CrawlBadge({ slug, onCrawlComplete }: { slug: string; onCrawlComplete?: () => void }) {
  const { data: crawl, refetch } = useGetCrawlStatus(slug, {
    query: {
      queryKey: ["crawl-status", slug],
      staleTime: 5000,
      refetchInterval: (q) => {
        const s = q.state.data?.status;
        return s === "queued" || s === "running" ? 4000 : false;
      },
    },
  });
  const { mutate: triggerCrawl, isPending } = useTriggerCrawl({
    mutation: { onSuccess: () => setTimeout(() => refetch(), 1000) },
  });

  const prevStatusRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const prev = prevStatusRef.current;
    const curr = crawl?.status;
    if ((prev === "queued" || prev === "running") && (curr === "completed" || curr === "partial")) {
      onCrawlComplete?.();
    }
    prevStatusRef.current = curr;
  }, [crawl?.status, onCrawlComplete]);

  if (!crawl) {
    return (
      <button
        onClick={() => triggerCrawl({ slug })}
        disabled={isPending}
        className="flex items-center gap-1 text-[10px] font-semibold text-white/30 hover:text-white/60 transition-colors disabled:opacity-50"
        title="No crawl yet — click to crawl website"
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Database className="h-3 w-3" />
        )}
        No KB
      </button>
    );
  }

  if (crawl.status === "queued" || crawl.status === "running") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-yellow-400/80">
        <Loader2 className="h-3 w-3 animate-spin" />
        Crawling…
      </span>
    );
  }

  if (crawl.status === "failed") {
    return (
      <button
        onClick={() => triggerCrawl({ slug })}
        disabled={isPending}
        className="flex items-center gap-1 text-[10px] font-semibold text-red-400/80 hover:text-red-300 transition-colors disabled:opacity-50"
        title="Crawl failed — click to retry"
      >
        <AlertTriangle className="h-3 w-3" />
        Failed · Retry
      </button>
    );
  }

  return (
    <button
      onClick={() => triggerCrawl({ slug })}
      disabled={isPending}
      className="flex items-center gap-1 text-[10px] font-semibold text-[#A8C334]/80 hover:text-[#A8C334] transition-colors disabled:opacity-50"
      title={`${crawl.chunksExtracted} knowledge chunks from ${crawl.pagesCrawled} pages — click to re-crawl`}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <CheckCircle2 className="h-3 w-3" />
      )}
      {crawl.chunksExtracted} facts · {crawl.pagesCrawled}p
    </button>
  );
}

function BrandCard({
  client,
  copied,
  onCopy,
  onEdit,
  onDelete,
  onPreview,
  onKnowledge,
  onReview,
  onAssets,
  onInstall,
  onModel,
  onDuplicate,
}: {
  client: DemoClient;
  copied: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: (mode: "demo" | "site") => void;
  onKnowledge: () => void;
  onReview: () => void;
  onAssets: () => void;
  onInstall: () => void;
  onModel: () => void;
  onDuplicate: () => void;
}) {
  const primary = client.branding.primaryColor || "#A8C334";
  const secondary = client.branding.secondaryColor || "#1a3a1a";
  const activeLangs = (() => {
    const langs = client.branding.demoLanguages;
    const codes = Array.isArray(langs) && langs.length > 0
      ? langs
      : client.branding.demoLanguage ? [client.branding.demoLanguage] : [];
    return codes.map((code) => LANG_OPTIONS.find((l) => l.value === code)).filter(Boolean);
  })();

  const { data: stats } = useGetDashboardStats(
    { clientId: client.id },
    { query: { queryKey: ["hub-stats", client.id], staleTime: 30000 } }
  );

  const { data: crawlData } = useGetCrawlStatus(client.slug, {
    query: { queryKey: ["crawl-status", client.slug], staleTime: 10000 },
  });

  const waDigits = (client.branding.twilioSender ?? "")
    .replace(/^whatsapp:/i, "")
    .replace(/[^0-9]/g, "") || "15558085030";
  const waMessage =
    client.branding.defaultMessage ??
    `[${client.slug}] Hi! I'm interested in your services 👋`;
  const waLink = `https://wa.me/${waDigits}?text=${encodeURIComponent(waMessage)}`;
  const clientMode = client.branding.mode;
  const isManualMode = clientMode === "manual" || clientMode === "individual";
  const crawlReady =
    isManualMode ||
    ((crawlData?.status === "completed" || crawlData?.status === "partial") &&
      (crawlData?.chunksExtracted ?? 0) > 0);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1a1d26] flex flex-col hover:border-white/20 transition-colors">
      {/* Color header */}
      <div className="h-20 relative flex items-end p-4" style={{ backgroundColor: primary }}>
        <BrandLogo logoUrl={client.branding.logoUrl} companyName={client.branding.companyName} secondary={secondary} />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {activeLangs.map((opt) => (
            <span key={opt!.value} className="text-sm" title={opt!.label}>{opt!.flag}</span>
          ))}
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-[10px] font-bold">
            /{client.slug}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <p className="font-bold text-white text-base leading-tight">{client.branding.companyName}</p>
          {client.branding.city && (
            <p className="text-white/40 text-xs mt-0.5">{client.branding.city}</p>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
            <Users className="h-3.5 w-3.5 text-white/40" />
            <span className="text-white text-xs font-bold">{stats?.totalLeads ?? "—"}</span>
            <span className="text-white/30 text-[10px]">Leads</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
            <PhoneCall className="h-3.5 w-3.5 text-white/40" />
            <span className="text-white text-xs font-bold">{stats?.newLeads ?? "—"}</span>
            <span className="text-white/30 text-[10px]">New</span>
          </div>
          {(stats?.callbackBooked ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-[#A8C334]/10 rounded-lg px-2.5 py-1.5">
              <span className="text-[#A8C334] text-xs font-bold">{stats!.callbackBooked}</span>
              <span className="text-[#A8C334]/60 text-[10px]">Callbacks</span>
            </div>
          )}
        </div>

        {/* Crawl status row */}
        <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2.5 py-1.5">
          {isManualMode ? (
            <FileText className="h-3 w-3 text-white/20 shrink-0" />
          ) : (
            <RefreshCw className="h-3 w-3 text-white/20 shrink-0" />
          )}
          <span className="text-white/20 text-[10px] shrink-0">KB:</span>
          {isManualMode ? (
            <span className="text-[10px] font-semibold text-[#A8C334]/80 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Manual · ready
            </span>
          ) : (
            <CrawlBadge slug={client.slug} onCrawlComplete={onReview} />
          )}
        </div>

        {/* WhatsApp QR — only shown post-crawl once knowledge is approved */}
        {crawlReady && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="shrink-0 rounded-lg overflow-hidden bg-white p-1.5">
              <QRCodeSVG
                value={waLink}
                size={72}
                fgColor={primary}
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#25D366] shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <p className="text-white text-[11px] font-semibold">WhatsApp QR</p>
              </div>
              <p className="text-white/35 text-[10px] leading-snug">Scan to open a pre-filled chat</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-white/30 hover:text-[#25D366] transition-colors"
              >
                <ExternalLink className="h-2.5 w-2.5" /> Test link
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-white/5">
          {/* Preview toggle — AI Demo vs Current Site */}
          <div className="flex items-center rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => onPreview("demo")}
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors border-r border-white/10"
              title="Preview AI demo"
            >
              <MonitorSmartphone className="h-3.5 w-3.5" /> Demo
            </button>
            <button
              onClick={() => onPreview("site")}
              disabled={!client.branding.websiteUrl}
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              title={client.branding.websiteUrl ? "Preview current website" : "No website URL — add one in Edit"}
            >
              <Globe className="h-3.5 w-3.5" /> Site
            </button>
          </div>

          <Link
            href={`/demo/${client.slug}/dashboard${client.demoToken ? `?t=${client.demoToken}` : ""}`}
            className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </Link>

          <button
            onClick={onReview}
            className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-[#A8C334] transition-colors"
            title="Review & approve AI knowledge"
          >
            <ClipboardCheck className="h-3.5 w-3.5" /> Review
          </button>

          <button
            onClick={onKnowledge}
            className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors"
            title="Edit knowledge base"
          >
            <BookOpen className="h-3.5 w-3.5" /> Knowledge
          </button>

          <button
            onClick={onAssets}
            className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-[#A8C334] transition-colors"
            title="Demo assets — Calendly, Loom, price lists, and more"
          >
            <Package className="h-3.5 w-3.5" /> Assets
          </button>

          <button
            onClick={onModel}
            className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-[#A8C334] transition-colors"
            title="AI model override for this brand"
          >
            <Cpu className="h-3.5 w-3.5" />
            {client.branding.liveChatModel
              ? client.branding.liveChatModel.replace("gpt-", "").replace("o-mini", "o mini")
              : "Model"}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-white/40 hover:text-white/70 transition-colors"
              title="Copy demo link"
            >
              {copied ? <CheckCheck className="h-3.5 w-3.5 text-[#A8C334]" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={onInstall}
              className="text-white/30 hover:text-[#A8C334] transition-colors"
              title="Install / Connect — WhatsApp link, ManyChat webhook, API key"
            >
              <Cable className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDuplicate}
              className="text-white/30 hover:text-blue-400 transition-colors"
              title="Duplicate brand for A/B model testing"
            >
              <CopyPlus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onEdit}
              className="text-white/30 hover:text-white transition-colors"
              title="Edit branding"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="text-white/20 hover:text-red-400 transition-colors"
              title="Delete demo"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({
  client,
  mode,
  onModeChange,
  onClose,
}: {
  client: DemoClient;
  mode: "demo" | "site";
  onModeChange: (mode: "demo" | "site") => void;
  onClose: () => void;
}) {
  const demoUrl = `${import.meta.env.BASE_URL}demo/${client.slug}`;
  const siteUrl = client.branding.websiteUrl ?? null;
  // Embed the Basic Auth token in the URL so the browser's iframe src navigation
  // can authenticate — iframe loads cannot attach Authorization headers.
  const authToken = getBasicAuthHeader()?.replace(/^Basic /, "") ?? "";
  const proxiedSiteUrl = siteUrl
    ? `/api/admin/site-proxy?token=${encodeURIComponent(authToken)}&url=${encodeURIComponent(siteUrl)}`
    : null;
  const activeUrl = mode === "demo" ? demoUrl : proxiedSiteUrl;
  const tabUrl = mode === "demo" ? demoUrl : siteUrl;
  const hasWebsite = !!siteUrl;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#0a0c10" }}>
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 shrink-0 bg-[#0f1117]">
        {/* Brand identity */}
        <div className="flex items-center gap-2 min-w-0">
          {client.branding.logoUrl ? (
            <img
              src={client.branding.logoUrl}
              alt={client.branding.companyName}
              className="h-6 w-auto max-w-[80px] object-contain opacity-90"
            />
          ) : (
            <div
              className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: client.branding.primaryColor || "#A8C334" }}
            >
              {client.branding.companyName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-white/70 font-semibold text-sm truncate hidden sm:block">
            {client.branding.companyName}
          </span>
        </div>

        {/* Toggle pill — centred */}
        <div className="flex items-center rounded-xl bg-white/8 border border-white/10 p-0.5 gap-0.5 mx-auto">
          <button
            onClick={() => onModeChange("demo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "demo"
                ? "bg-[#A8C334] text-[#1a3a1a] shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <MonitorSmartphone className="h-3.5 w-3.5" /> AI Demo
          </button>
          <button
            onClick={() => hasWebsite && onModeChange("site")}
            disabled={!hasWebsite}
            title={!hasWebsite ? "No website URL configured — add one in Edit" : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "site"
                ? "bg-white text-black shadow-sm"
                : "text-white/50 hover:text-white"
            } disabled:opacity-25 disabled:cursor-not-allowed`}
          >
            <Globe className="h-3.5 w-3.5" /> Current Site
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {tabUrl && (
            <a
              href={tabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/70 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors ml-1"
            title="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* iframe */}
      <div className="flex-1 relative overflow-hidden">
        {activeUrl ? (
          <>
            <iframe
              key={activeUrl}
              src={activeUrl}
              className="absolute inset-0 w-full h-full border-0 bg-white"
              title={`Preview: ${client.branding.companyName}`}
            />
            {/* Subtle open-in-tab hint */}
            {tabUrl && (
              <div className="absolute top-0 right-0 z-10 pointer-events-auto">
                <a
                  href={tabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 m-2 text-xs text-white/50 hover:text-white/90 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 rounded px-2.5 py-1 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" /> Open in new tab
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <Globe className="h-10 w-10 text-white/10" />
            <p className="text-white/30 text-sm font-medium">No website URL configured</p>
            <p className="text-white/20 text-xs max-w-xs">
              Add a website URL in the Edit panel to compare with the AI demo.
            </p>
          </div>
        )}

        {/* WhatsApp FAB overlay — shows on current site so prospect sees bot placement */}
        {mode === "site" && activeUrl && (
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-gray-100 whitespace-nowrap">
              👆 Your AI bot would appear here
            </div>
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: "#25D366" }}
              onClick={() => {
                const raw = client.branding.twilioSender ?? "";
                const digits = raw.replace("whatsapp:", "").replace("+", "");
                const number = digits || "15558085030";
                const text = encodeURIComponent(`[${client.slug}] Hi! I'm interested in your services 👋`);
                window.open(`https://wa.me/${number}?text=${text}`, "_blank");
              }}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateDemoDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<"website" | "manual" | "individual" | null>(null);
  const [manualKnowledge, setManualKnowledge] = useState({
    businessDescription: "",
    servicesOffered: "",
    pricingInfo: "",
    locationAndTarget: "",
  });
  const [individualKnowledge, setIndividualKnowledge] = useState({
    personalPitch: "",
    servicesOffer: "",
    idealClientProfile: "",
    qualifyingQuestion1: "",
    qualifyingQuestion2: "",
    qualifyingQuestion3: "",
    availability: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [demoLanguages, setDemoLanguages] = useState<string[]>(["en"]);
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: "",
    slug: "",
    tagline: "",
    primaryColor: "",
    secondaryColor: "",
    logoUrl: "",
    city: "",
    phone: "",
    websiteUrl: "",
    heroHeadline: "",
    industry: "",
  });

  const toggleLanguage = (code: string) => {
    setDemoLanguages((prev) => {
      if (prev.includes(code)) {
        const next = prev.filter((l) => l !== code);
        return next.length === 0 ? prev : next;
      }
      return [...prev, code];
    });
  };

  const primary = branding.primaryColor || "#A8C334";
  const secondary = branding.secondaryColor || "#1a3a1a";

  const update = (key: keyof BrandingConfig, value: string) => {
    setBranding((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "companyName") next.slug = slugify(value);
      return next;
    });
  };

  const extract = async () => {
    if (!websiteUrl) return;
    setExtracting(true);
    try {
      const url = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
      const res = await fetch("/api/admin/extract-branding", {
        method: "POST",
        headers: authH({ "Content-Type": "application/json" }),
        body: JSON.stringify({ url }),
      });
      if (!res.ok) { toast({ title: "Extraction failed", variant: "destructive" }); return; }
      const data: BrandingConfig = await res.json();
      setBranding((prev) => ({
        companyName: data.companyName ?? "",
        slug: data.slug ?? "",
        tagline: data.tagline ?? "",
        primaryColor: data.primaryColor ?? "",
        secondaryColor: data.secondaryColor ?? "",
        logoUrl: data.logoUrl ?? "",
        city: data.city ?? "",
        phone: data.phone ?? "",
        websiteUrl: data.websiteUrl ?? url,
        heroHeadline: data.heroHeadline ?? "",
        demoLanguage: prev.demoLanguage ?? "de",
        industry: prev.industry ?? "",
      }));
      if (data.logoUrl) setLogoPreview(data.logoUrl);
      setExtracted(true);
    } catch {
      toast({ title: "Connection failed", variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return branding.logoUrl || null;
    setUploading(true);
    try {
      const meta = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: authH({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name: logoFile.name, size: logoFile.size, contentType: logoFile.type }),
      });
      const { uploadURL, objectPath } = await meta.json();
      await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": logoFile.type }, body: logoFile });
      return `/api/storage${objectPath}`;
    } catch { return branding.logoUrl || null; }
    finally { setUploading(false); }
  };

  const create = async () => {
    if (!branding.companyName || !branding.slug) {
      toast({ title: "Name and slug are required", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const finalLogoUrl = await uploadLogo();
      const modePayload =
        mode === "manual"
          ? manualKnowledge
          : mode === "individual"
            ? individualKnowledge
            : {};
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: authH({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          name: branding.companyName,
          slug: branding.slug,
          branding: {
            ...branding,
            logoUrl: finalLogoUrl,
            demoLanguage: demoLanguages[0] ?? "en",
            demoLanguages,
            mode: mode ?? "website",
            ...modePayload,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: err.error ?? "Error creating demo", variant: "destructive" });
        return;
      }
      const created = await res.json();
      toast({ title: `Demo created!`, description: `/demo/${created.slug}` });
      onCreated();
      reset();
    } finally { setCreating(false); }
  };

  const reset = () => {
    setMode(null);
    setWebsiteUrl("");
    setDemoLanguages(["en"]);
    setBranding({ companyName: "", slug: "", tagline: "", primaryColor: "", secondaryColor: "", logoUrl: "", city: "", phone: "", websiteUrl: "", heroHeadline: "", industry: "" });
    setLogoFile(null);
    setLogoPreview(null);
    setExtracted(false);
    setShowAdvanced(false);
    setManualKnowledge({ businessDescription: "", servicesOffered: "", pricingInfo: "", locationAndTarget: "" });
    setIndividualKnowledge({ personalPitch: "", servicesOffer: "", idealClientProfile: "", qualifyingQuestion1: "", qualifyingQuestion2: "", qualifyingQuestion3: "", availability: "" });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Demo</DialogTitle>
          <DialogDescription>
            {mode === null && "Choose how to set up the bot's knowledge base."}
            {mode === "website" && "We scan the site and build a branded knowledge base instantly."}
            {mode === "manual" && "Fill in a few key details — we'll build the bot's knowledge base from those."}
            {mode === "individual" && "Set up your personal AI assistant that never misses a lead."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">

          {/* ── STEP 0: Mode picker ── */}
          {mode === null && (
            <div className="space-y-2">
              <div className="grid gap-2">
                <button
                  onClick={() => setMode("website")}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">I have a website</p>
                    <p className="text-xs text-muted-foreground mt-0.5">We scan it and build the knowledge base automatically</p>
                  </div>
                </button>
                <button
                  onClick={() => setMode("manual")}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">I don't have a website</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Enter a few details manually — we build the knowledge base from those</p>
                  </div>
                </button>
                <button
                  onClick={() => setMode("individual")}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                    <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">I'm an individual</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sales, consulting, freelance — a personal AI that never misses a lead</p>
                  </div>
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <Button variant="ghost" size="sm" onClick={() => { onClose(); reset(); }}>Cancel</Button>
              </div>
            </div>
          )}

          {/* ── MODE A: Website (existing scan flow) ── */}
          {mode === "website" && (
            <div className="space-y-4">
              <button
                onClick={() => { setMode(null); setExtracted(false); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>

              {/* URL input */}
              <div className="flex gap-2">
                <Input
                  placeholder="care-service-munich.de"
                  value={websiteUrl}
                  onChange={(e) => { setWebsiteUrl(e.target.value); if (extracted) setExtracted(false); }}
                  onKeyDown={(e) => e.key === "Enter" && extract()}
                  className="flex-1"
                />
                <Button onClick={extract} disabled={extracting || !websiteUrl} className="shrink-0 gap-1.5">
                  {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {extracting ? "Scanning…" : "Scan"}
                </Button>
              </div>

              {!extracted && !extracting && (
                <div className="rounded-xl border border-dashed border-border p-6 flex flex-col items-center gap-2 text-center text-muted-foreground">
                  <Globe className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Enter any website URL above and press <strong>Scan</strong>.<br />We'll pull the brand name, colors, and logo automatically.</p>
                </div>
              )}

              {extracting && (
                <div className="rounded-xl border border-dashed border-border p-6 flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin opacity-40" />
                  <p className="text-sm">Scanning website…</p>
                </div>
              )}

              {extracted && (
                <div className="space-y-4">
                  {/* Brand preview card */}
                  <div className="rounded-xl overflow-hidden border border-border">
                    <div className="h-16 flex items-center px-4 gap-3" style={{ backgroundColor: primary }}>
                      {logoPreview ? (
                        <img src={logoPreview} alt="" className="h-9 w-9 rounded object-contain bg-white/10 p-0.5" onError={() => setLogoPreview(null)} />
                      ) : (
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-extrabold text-sm" style={{ backgroundColor: secondary }}>
                          {branding.companyName.slice(0, 2).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-extrabold text-base leading-tight truncate">{branding.companyName}</p>
                        {branding.tagline && <p className="text-white/70 text-xs truncate">{branding.tagline}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-sm">{LANG_OPTIONS.find((l) => l.value === (branding.demoLanguage || "de"))?.flag}</span>
                        <span className="text-xs bg-black/20 text-white px-2 py-0.5 rounded-full font-mono">/demo/{branding.slug || "…"}</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: primary }} />
                      <span className="text-xs text-muted-foreground">{primary}</span>
                      {branding.secondaryColor && <>
                        <div className="h-3 w-3 rounded-full border border-border ml-2" style={{ backgroundColor: secondary }} />
                        <span className="text-xs text-muted-foreground">{secondary}</span>
                      </>}
                      <button className="ml-auto text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground" onClick={() => setExtracted(false)}>
                        ← Change URL
                      </button>
                    </div>
                  </div>

                  {/* Industry type selector */}
                  <div className="space-y-2">
                    <Label className="text-xs">Business Type</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <button key={opt.value} type="button" onClick={() => setBranding((prev) => ({ ...prev, industry: opt.value }))}
                          className={`flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg border text-center transition-colors text-xs leading-tight ${branding.industry === opt.value ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"}`}
                        >
                          <span className="text-base leading-none">{opt.emoji}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    {branding.industry && (
                      <p className="text-[11px] text-muted-foreground">
                        Video theme: <span className="font-medium text-foreground">{INDUSTRY_OPTIONS.find(o => o.value === branding.industry)?.label}</span>
                        {" "}· Colors from their brand applied automatically
                      </p>
                    )}
                  </div>

                  {/* Editable name + slug */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Company Name *</Label>
                      <Input value={branding.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Company Name" className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">URL slug *</Label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground shrink-0">/demo/</span>
                        <Input value={branding.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="font-mono text-xs h-9" />
                      </div>
                    </div>
                  </div>

                  {/* Language multi-pick */}
                  <div className="flex gap-2 flex-wrap">
                    {LANG_OPTIONS.map((l) => {
                      const active = demoLanguages.includes(l.value);
                      return (
                        <button key={l.value} type="button" onClick={() => toggleLanguage(l.value)}
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${active ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"}`}
                        >
                          {l.flag} {l.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Collapsible advanced */}
                  <button onClick={() => setShowAdvanced((v) => !v)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Settings className="h-3.5 w-3.5" />
                    {showAdvanced ? "Hide advanced options" : "Customize colors, logo & more…"}
                  </button>

                  {showAdvanced && (
                    <div className="space-y-3 rounded-xl border border-border p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Primary Color</Label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={primary} onChange={(e) => update("primaryColor", e.target.value)} className="h-9 w-10 rounded border border-input cursor-pointer shrink-0" />
                            <Input value={branding.primaryColor ?? ""} onChange={(e) => update("primaryColor", e.target.value)} className="font-mono text-xs h-9" placeholder="#A8C334" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Secondary Color</Label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={secondary} onChange={(e) => update("secondaryColor", e.target.value)} className="h-9 w-10 rounded border border-input cursor-pointer shrink-0" />
                            <Input value={branding.secondaryColor ?? ""} onChange={(e) => update("secondaryColor", e.target.value)} className="font-mono text-xs h-9" placeholder="#1a3a1a" />
                          </div>
                        </div>
                        <div className="col-span-2 space-y-1.5">
                          <Label className="text-xs">Tagline</Label>
                          <Input value={branding.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)} placeholder="Professional Care with Heart" className="h-9" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">City</Label>
                          <Input value={branding.city ?? ""} onChange={(e) => update("city", e.target.value)} placeholder="Munich" className="h-9" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Phone</Label>
                          <Input value={branding.phone ?? ""} onChange={(e) => update("phone", e.target.value)} placeholder="+49 89 123" className="h-9" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Logo override</Label>
                        <div className="flex items-center gap-3">
                          {logoPreview && (
                            <div className="relative shrink-0">
                              <img src={logoPreview} alt="" className="h-10 w-10 rounded object-contain bg-muted p-0.5 border" onError={() => setLogoPreview(null)} />
                              <button className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 text-xs flex items-center justify-center" onClick={() => { setLogoFile(null); setLogoPreview(null); update("logoUrl", ""); }}>×</button>
                            </div>
                          )}
                          <Input type="file" accept="image/*" className="cursor-pointer h-9 text-xs" onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
                          }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button onClick={create} disabled={creating || uploading || !branding.companyName} className="w-full h-11 gap-2 text-base">
                    {(creating || uploading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {creating ? "Creating…" : uploading ? "Uploading logo…" : `Create demo for ${branding.companyName || "…"}`}
                  </Button>
                </div>
              )}

              {!extracted && (
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => { onClose(); reset(); }}>Cancel</Button>
                </div>
              )}
            </div>
          )}

          {/* ── MODE B: No website — manual fields ── */}
          {mode === "manual" && (
            <div className="space-y-4">
              <button
                onClick={() => setMode(null)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">About your business *</Label>
                  <Textarea
                    placeholder="We are a home healthcare company serving families in Munich, offering nursing and physiotherapy at home."
                    value={manualKnowledge.businessDescription}
                    onChange={(e) => setManualKnowledge(p => ({ ...p, businessDescription: e.target.value }))}
                    className="resize-none text-sm"
                    rows={2}
                  />
                  <p className="text-[10px] text-muted-foreground">2–3 sentences — answers "who are you?"</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Services you offer *</Label>
                  <Textarea
                    placeholder="Home nursing, physiotherapy, dementia care, 24h live-in care…"
                    value={manualKnowledge.servicesOffered}
                    onChange={(e) => setManualKnowledge(p => ({ ...p, servicesOffered: e.target.value }))}
                    className="resize-none text-sm"
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Pricing</Label>
                  <Textarea
                    placeholder="From €45/hour for basic care. Custom quotes available — contact us."
                    value={manualKnowledge.pricingInfo}
                    onChange={(e) => setManualKnowledge(p => ({ ...p, pricingInfo: e.target.value }))}
                    className="resize-none text-sm"
                    rows={1}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Location & who you serve</Label>
                  <Textarea
                    placeholder="Based in Munich, serving families across Bavaria. We specialise in Turkish and German-speaking clients."
                    value={manualKnowledge.locationAndTarget}
                    onChange={(e) => setManualKnowledge(p => ({ ...p, locationAndTarget: e.target.value }))}
                    className="resize-none text-sm"
                    rows={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Company Name *</Label>
                  <Input value={branding.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Company Name" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">URL slug *</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground shrink-0">/demo/</span>
                    <Input value={branding.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="font-mono text-xs h-9" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {LANG_OPTIONS.map((l) => {
                  const active = demoLanguages.includes(l.value);
                  return (
                    <button key={l.value} type="button" onClick={() => toggleLanguage(l.value)}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${active ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"}`}
                    >
                      {l.flag} {l.label}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={create}
                disabled={creating || !branding.companyName || !manualKnowledge.businessDescription || !manualKnowledge.servicesOffered}
                className="w-full h-11 gap-2 text-base"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {creating ? "Creating…" : `Create bot for ${branding.companyName || "…"}`}
              </Button>
            </div>
          )}

          {/* ── MODE C: Individual / EA ── */}
          {mode === "individual" && (
            <div className="space-y-4">
              <button
                onClick={() => setMode(null)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Your name & role *</Label>
                  <Input
                    placeholder="Alex Chen — Enterprise SaaS Sales"
                    value={branding.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    className="h-9"
                  />
                  <p className="text-[10px] text-muted-foreground">This is how the bot introduces you</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Your personal pitch *</Label>
                  <Textarea
                    placeholder="I help B2B SaaS companies build outbound pipelines and close enterprise deals faster…"
                    value={individualKnowledge.personalPitch}
                    onChange={(e) => setIndividualKnowledge(p => ({ ...p, personalPitch: e.target.value }))}
                    className="resize-none text-sm"
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">What you offer</Label>
                  <Textarea
                    placeholder="Sales strategy consulting, SDR coaching, pipeline reviews, outreach playbooks…"
                    value={individualKnowledge.servicesOffer}
                    onChange={(e) => setIndividualKnowledge(p => ({ ...p, servicesOffer: e.target.value }))}
                    className="resize-none text-sm"
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Ideal client profile</Label>
                  <Textarea
                    placeholder="B2B SaaS, 50–500 employees, Series A+, UK/EU, with a sales team of 5+."
                    value={individualKnowledge.idealClientProfile}
                    onChange={(e) => setIndividualKnowledge(p => ({ ...p, idealClientProfile: e.target.value }))}
                    className="resize-none text-sm"
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Qualifying questions (up to 3)</Label>
                  <Input placeholder="e.g. What's your current monthly lead volume?" className="h-8 text-xs mb-1.5"
                    value={individualKnowledge.qualifyingQuestion1}
                    onChange={(e) => setIndividualKnowledge(p => ({ ...p, qualifyingQuestion1: e.target.value }))} />
                  <Input placeholder="e.g. Do you have a dedicated SDR team?" className="h-8 text-xs mb-1.5"
                    value={individualKnowledge.qualifyingQuestion2}
                    onChange={(e) => setIndividualKnowledge(p => ({ ...p, qualifyingQuestion2: e.target.value }))} />
                  <Input placeholder="e.g. What's your budget for sales tools?" className="h-8 text-xs"
                    value={individualKnowledge.qualifyingQuestion3}
                    onChange={(e) => setIndividualKnowledge(p => ({ ...p, qualifyingQuestion3: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Your availability for calls</Label>
                  <Input placeholder="Mon–Fri, 9am–6pm GMT" className="h-8 text-xs"
                    value={individualKnowledge.availability}
                    onChange={(e) => setIndividualKnowledge(p => ({ ...p, availability: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">URL slug *</Label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground shrink-0">/demo/</span>
                  <Input value={branding.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="font-mono text-xs h-9" />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {LANG_OPTIONS.map((l) => {
                  const active = demoLanguages.includes(l.value);
                  return (
                    <button key={l.value} type="button" onClick={() => toggleLanguage(l.value)}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${active ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-foreground/30"}`}
                    >
                      {l.flag} {l.label}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={create}
                disabled={creating || !branding.companyName || !individualKnowledge.personalPitch}
                className="w-full h-11 gap-2 text-base"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {creating ? "Creating…" : `Create bot for ${branding.companyName || "…"}`}
              </Button>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditDemoDialog({
  client,
  onClose,
  onSaved,
}: {
  client: DemoClient;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(client.branding.logoUrl ?? null);
  const [twilioSender, setTwilioSender] = useState(client.twilioSender ?? "");
  const [editDemoLanguages, setEditDemoLanguages] = useState<string[]>(() => {
    const langs = client.branding.demoLanguages;
    if (Array.isArray(langs) && langs.length > 0) return langs;
    return [client.branding.demoLanguage ?? "en"];
  });
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: client.branding.companyName ?? "",
    slug: client.branding.slug ?? client.slug,
    tagline: client.branding.tagline ?? "",
    heroHeadline: client.branding.heroHeadline ?? "",
    primaryColor: client.branding.primaryColor ?? "",
    secondaryColor: client.branding.secondaryColor ?? "",
    logoUrl: client.branding.logoUrl ?? "",
    city: client.branding.city ?? "",
    phone: client.branding.phone ?? "",
    websiteUrl: client.branding.websiteUrl ?? "",
  });

  const toggleEditLanguage = (code: string) => {
    setEditDemoLanguages((prev) => {
      if (prev.includes(code)) {
        const next = prev.filter((l) => l !== code);
        return next.length === 0 ? prev : next;
      }
      return [...prev, code];
    });
  };

  const update = (key: keyof BrandingConfig, value: string) =>
    setBranding((prev) => ({ ...prev, [key]: value }));

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return branding.logoUrl ?? null;
    setUploading(true);
    try {
      const meta = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: authH({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name: logoFile.name, size: logoFile.size, contentType: logoFile.type }),
      });
      const { uploadURL, objectPath } = await meta.json();
      await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": logoFile.type }, body: logoFile });
      return `/api/storage${objectPath}`;
    } catch { return branding.logoUrl ?? null; }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!branding.companyName) {
      toast({ title: "Company name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const finalLogoUrl = await uploadLogo();
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: authH({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          name: branding.companyName,
          twilioSender: twilioSender.trim(),
          branding: {
            ...branding,
            logoUrl: finalLogoUrl,
            demoLanguage: editDemoLanguages[0] ?? "en",
            demoLanguages: editDemoLanguages,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: err.error ?? "Save failed", variant: "destructive" });
        return;
      }
      toast({ title: "Branding saved" });
      onSaved();
    } finally { setSaving(false); }
  };

  const primary = branding.primaryColor || "#A8C334";

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Branding — {client.branding.companyName}</DialogTitle>
          <DialogDescription>
            Update logo, colors, name, and language for this demo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Logo section — prominent at top */}
          <div className="space-y-3">
            <Label className="text-base font-bold">Logo</Label>
            <div className="rounded-xl p-5 border-2 border-dashed border-border flex flex-col items-center gap-4 bg-muted/30">
              {/* Preview in brand colors */}
              <div
                className="w-full rounded-lg h-20 flex items-center justify-center gap-3 relative overflow-hidden"
                style={{ backgroundColor: primary }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-12 max-w-[200px] object-contain drop-shadow-md"
                    onError={() => setLogoPreview(null)}
                  />
                ) : (
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    {branding.companyName.toUpperCase() || "COMPANY"}
                  </span>
                )}
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Upload image file</Label>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Or paste URL</Label>
                  <Input
                    placeholder="https://example.com/logo.png"
                    value={logoFile ? "" : (branding.logoUrl ?? "")}
                    disabled={!!logoFile}
                    onChange={(e) => {
                      update("logoUrl", e.target.value);
                      setLogoPreview(e.target.value || null);
                    }}
                    className="text-xs"
                  />
                </div>
              </div>

              {logoPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive text-xs"
                  onClick={() => { setLogoFile(null); setLogoPreview(null); update("logoUrl", ""); }}
                >
                  Remove logo
                </Button>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Company Name *</Label>
              <Input value={branding.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={branding.primaryColor || "#A8C334"}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="h-10 w-14 rounded border border-input cursor-pointer"
                />
                <Input
                  value={branding.primaryColor ?? ""}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="font-mono text-sm"
                  placeholder="#A8C334"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={branding.secondaryColor || "#1a3a1a"}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                  className="h-10 w-14 rounded border border-input cursor-pointer"
                />
                <Input
                  value={branding.secondaryColor ?? ""}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                  className="font-mono text-sm"
                  placeholder="#1a3a1a"
                />
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Tagline</Label>
              <Input value={branding.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)} placeholder="Professional Care with Heart" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Hero Headline</Label>
              <Input value={branding.heroHeadline ?? ""} onChange={(e) => update("heroHeadline", e.target.value)} placeholder="Care you can trust." />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={branding.city ?? ""} onChange={(e) => update("city", e.target.value)} placeholder="Munich" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={branding.phone ?? ""} onChange={(e) => update("phone", e.target.value)} placeholder="+49 89 12345678" />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input value={branding.websiteUrl ?? ""} onChange={(e) => update("websiteUrl", e.target.value)} placeholder="https://example.de" className="col-span-2" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>WhatsApp Number (Twilio sender)</Label>
              <Input
                value={twilioSender}
                onChange={(e) => setTwilioSender(e.target.value)}
                placeholder="whatsapp:+15558085030"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Format: <code>whatsapp:+&lt;number&gt;</code>. Each brand can have a unique number; defaults to the shared sandbox number.</p>
            </div>
            <div className="space-y-2">
              <Label>Demo Languages</Label>
              <div className="flex gap-2 flex-wrap">
                {LANG_OPTIONS.map((l) => {
                  const active = editDemoLanguages.includes(l.value);
                  return (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => toggleEditLanguage(l.value)}
                      className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      {l.flag} {l.label}
                    </button>
                  );
                })}
              </div>
              {editDemoLanguages.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Default: {LANG_OPTIONS.find((o) => o.value === editDemoLanguages[0])?.flag}{" "}
                  {LANG_OPTIONS.find((o) => o.value === editDemoLanguages[0])?.label}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving || uploading || !branding.companyName} className="gap-2">
              {(saving || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
