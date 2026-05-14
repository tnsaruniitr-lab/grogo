import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListDemoClients,
  useDeleteDemoClient,
  useUpdateDemoClient,
  useGetDashboardStats,
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

        <div className="flex gap-2">
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
      toast({ title: `${data.companyName} detected` });
    } catch {
      toast({ title: "Connection failed", variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  };

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
      toast({ title: `Demo "${created.name}" created!`, description: `/demo/${created.slug}` });
      onCreated();
      reset();
    } finally { setCreating(false); }
  };

  const reset = () => {
    setWebsiteUrl("");
    setBranding({ companyName: "", slug: "", tagline: "", primaryColor: "", secondaryColor: "", logoUrl: "", city: "", phone: "", websiteUrl: "", heroHeadline: "", demoLanguage: "de" });
    setLogoFile(null);
    setLogoPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Demo</DialogTitle>
          <DialogDescription>
            Enter the prospect's website — we'll automatically extract their logo, colors, and name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label>Website URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. care-service-munich.de"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && extract()}
              />
              <Button onClick={extract} disabled={extracting || !websiteUrl} className="shrink-0 gap-1.5">
                {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Extract
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Company Name *</Label>
              <Input value={branding.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Munich Care Service GmbH" />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">/demo/</span>
                <Input value={branding.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={branding.city ?? ""} onChange={(e) => update("city", e.target.value)} placeholder="Munich" />
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={branding.primaryColor || "#A8C334"} onChange={(e) => update("primaryColor", e.target.value)} className="h-10 w-14 rounded border border-input cursor-pointer" />
                <Input value={branding.primaryColor ?? ""} onChange={(e) => update("primaryColor", e.target.value)} className="font-mono text-sm" placeholder="#A8C334" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={branding.secondaryColor || "#1a3a1a"} onChange={(e) => update("secondaryColor", e.target.value)} className="h-10 w-14 rounded border border-input cursor-pointer" />
                <Input value={branding.secondaryColor ?? ""} onChange={(e) => update("secondaryColor", e.target.value)} className="font-mono text-sm" placeholder="#1a3a1a" />
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
              <Label>Phone</Label>
              <Input value={branding.phone ?? ""} onChange={(e) => update("phone", e.target.value)} placeholder="+49 89 12345678" />
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

          {/* Logo upload */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-start gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img src={logoPreview} alt="" className="h-16 w-16 rounded-lg object-contain bg-muted p-1 border" onError={() => setLogoPreview(null)} />
                  <button className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-4 h-4 text-xs flex items-center justify-center" onClick={() => { setLogoFile(null); setLogoPreview(null); }}>×</button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-lg bg-muted border-2 border-dashed flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input type="file" accept="image/*" className="cursor-pointer" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
                }} />
                {!logoFile && (
                  <Input placeholder="https://example.com/logo.png" value={branding.logoUrl ?? ""} onChange={(e) => { update("logoUrl", e.target.value); setLogoPreview(e.target.value || null); }} className="text-xs" />
                )}
              </div>
            </div>
          </div>

          {/* Live preview chip */}
          {branding.primaryColor && (
            <div className="rounded-xl p-4 border" style={{ backgroundColor: branding.primaryColor + "18" }}>
              <div className="flex items-center gap-3">
                {logoPreview && <img src={logoPreview} alt="" className="h-9 w-9 rounded object-contain bg-white p-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                <div>
                  <p className="font-extrabold" style={{ color: branding.primaryColor }}>{branding.companyName || "Company Name"}</p>
                  {branding.tagline && <p className="text-xs text-muted-foreground">{branding.tagline}</p>}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {LANG_OPTIONS.find((l) => l.value === branding.demoLanguage) && (
                    <span className="text-base">{LANG_OPTIONS.find((l) => l.value === branding.demoLanguage)!.flag}</span>
                  )}
                  <div className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: branding.primaryColor }}>
                    /demo/{branding.slug || "slug"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { onClose(); reset(); }}>Cancel</Button>
            <Button onClick={create} disabled={creating || uploading || !branding.companyName} className="gap-2">
              {(creating || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Demo
            </Button>
          </div>
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
