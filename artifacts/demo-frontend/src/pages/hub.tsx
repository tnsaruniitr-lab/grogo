import { useState } from "react";
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
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LANG_OPTIONS, type DemoLang } from "@/lib/demo-i18n";

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
}

interface DemoClient {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
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

  const copyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/demo/${slug}`);
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
          <span className="text-sm font-bold text-white tracking-tight">Demo System</span>
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
                    onCopy={() => copyLink(client.slug)}
                    onEdit={() => setEditingClient(client)}
                    onDelete={() => {
                      if (confirm(`Delete demo "${client.branding.companyName}"?`)) {
                        deleteMutation.mutate({ id: client.id });
                      }
                    }}
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
    </div>
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

function CrawlBadge({ slug }: { slug: string }) {
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
}: {
  client: DemoClient;
  copied: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const primary = client.branding.primaryColor || "#A8C334";
  const secondary = client.branding.secondaryColor || "#1a3a1a";
  const langOption = LANG_OPTIONS.find((l) => l.value === client.branding.demoLanguage);

  const { data: stats } = useGetDashboardStats(
    { clientId: client.id },
    { query: { queryKey: ["hub-stats", client.id], staleTime: 30000 } }
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1a1d26] flex flex-col hover:border-white/20 transition-colors">
      {/* Color header */}
      <div className="h-20 relative flex items-end p-4" style={{ backgroundColor: primary }}>
        <BrandLogo logoUrl={client.branding.logoUrl} companyName={client.branding.companyName} secondary={secondary} />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {langOption && (
            <span className="text-sm" title={langOption.label}>{langOption.flag}</span>
          )}
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
          <RefreshCw className="h-3 w-3 text-white/20 shrink-0" />
          <span className="text-white/20 text-[10px] shrink-0">KB:</span>
          <CrawlBadge slug={client.slug} />
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-white/5">
          <Link
            href={`/demo/${client.slug}`}
            className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors"
          >
            <Globe className="h-3.5 w-3.5" /> Website
          </Link>
          <Link
            href={`/demo/${client.slug}/dashboard`}
            className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-white/40 hover:text-white/70 transition-colors"
              title="Copy link"
            >
              {copied ? <CheckCheck className="h-3.5 w-3.5 text-[#A8C334]" /> : <Copy className="h-3.5 w-3.5" />}
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
    demoLanguage: "de",
  });

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
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: branding.companyName,
          slug: branding.slug,
          branding: { ...branding, logoUrl: finalLogoUrl },
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
    setWebsiteUrl("");
    setBranding({ companyName: "", slug: "", tagline: "", primaryColor: "", secondaryColor: "", logoUrl: "", city: "", phone: "", websiteUrl: "", heroHeadline: "", demoLanguage: "de" });
    setLogoFile(null);
    setLogoPreview(null);
    setExtracted(false);
    setShowAdvanced(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Demo</DialogTitle>
          <DialogDescription>
            Paste a prospect's website — we scan it and build a branded landing page instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {/* URL input — always visible */}
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

          {/* Phase 1: hint before extraction */}
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

          {/* Phase 2: extracted preview + edit + create */}
          {extracted && (
            <div className="space-y-4">
              {/* Brand preview card */}
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="h-16 flex items-center px-4 gap-3" style={{ backgroundColor: primary }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="h-9 w-9 rounded object-contain bg-white/10 p-0.5"
                      onError={() => setLogoPreview(null)} />
                  ) : (
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-extrabold text-sm"
                      style={{ backgroundColor: secondary }}>
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

              {/* Language quick-pick */}
              <div className="flex gap-2">
                {LANG_OPTIONS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => update("demoLanguage", l.value)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      (branding.demoLanguage || "de") === l.value
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>

              {/* Collapsible advanced */}
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
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
                  {/* Logo override */}
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

              {/* Create button */}
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
    demoLanguage: client.branding.demoLanguage ?? "de",
  });

  const update = (key: keyof BrandingConfig, value: string) =>
    setBranding((prev) => ({ ...prev, [key]: value }));

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return branding.logoUrl ?? null;
    setUploading(true);
    try {
      const meta = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: branding.companyName,
          branding: { ...branding, logoUrl: finalLogoUrl },
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
            <div className="space-y-2">
              <Label>Demo Language</Label>
              <Select value={branding.demoLanguage ?? "de"} onValueChange={(v) => update("demoLanguage", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANG_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.flag} {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
