import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListDemoClients,
  useDeleteDemoClient,
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
  Plus,
  Globe,
  LayoutDashboard,
  Copy,
  CheckCheck,
  Trash2,
  Sparkles,
  Loader2,
  Upload,
  ExternalLink,
  Users,
  PhoneCall,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        toast({ title: "Demo gelöscht" });
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
            Dosteli intern ↗
          </Link>
          <Button
            size="sm"
            className="gap-1.5 bg-[#A8C334] hover:bg-[#95ae2a] text-[#1a3a1a] font-bold text-xs h-8"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-3.5 w-3.5" /> Neue Demo
          </Button>
        </div>
      </header>

      <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        {/* Headline */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Alle Demos</h1>
          <p className="text-white/50 mt-1.5 text-sm">
            Erstelle gebrandete WhatsApp-Bot-Demos für Interessenten — ein Link, ihr Look.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && clients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <Globe className="h-7 w-7 text-white/20" />
            </div>
            <p className="text-white font-semibold text-lg mb-1">Noch keine Demos</p>
            <p className="text-white/40 text-sm mb-6 max-w-xs">
              Erstelle deine erste Demo — gib einfach die Website des Interessenten ein.
            </p>
            <Button
              className="gap-2 bg-[#A8C334] hover:bg-[#95ae2a] text-[#1a3a1a] font-bold"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4" /> Erste Demo erstellen
            </Button>
          </motion.div>
        )}

        {/* Brand cards grid */}
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
                    onDelete={() => {
                      if (confirm(`Demo "${client.branding.companyName}" wirklich löschen?`)) {
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
    </div>
  );
}

function BrandCard({
  client,
  copied,
  onCopy,
  onDelete,
}: {
  client: DemoClient;
  copied: boolean;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const primary = client.branding.primaryColor ?? "#A8C334";
  const secondary = client.branding.secondaryColor ?? "#1a3a1a";

  const { data: stats } = useGetDashboardStats(
    { clientId: client.id },
    { query: { queryKey: ["hub-stats", client.id], staleTime: 30000 } }
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1a1d26] flex flex-col hover:border-white/20 transition-colors group">
      {/* Color header */}
      <div className="h-20 relative flex items-end p-4" style={{ backgroundColor: primary }}>
        {client.branding.logoUrl ? (
          <img
            src={client.branding.logoUrl}
            alt={client.branding.companyName}
            className="h-10 w-auto max-w-[120px] object-contain rounded drop-shadow"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow"
            style={{ backgroundColor: secondary }}
          >
            {client.branding.companyName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-[10px] font-bold">
          /{client.slug}
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

        {/* Stats chips */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
            <Users className="h-3.5 w-3.5 text-white/40" />
            <span className="text-white text-xs font-bold">
              {stats?.totalLeads ?? "—"}
            </span>
            <span className="text-white/30 text-[10px]">Leads</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
            <PhoneCall className="h-3.5 w-3.5 text-white/40" />
            <span className="text-white text-xs font-bold">
              {stats?.newLeads ?? "—"}
            </span>
            <span className="text-white/30 text-[10px]">Neu</span>
          </div>
          {stats?.callbackBooked ? (
            <div className="flex items-center gap-1.5 bg-[#A8C334]/10 rounded-lg px-2.5 py-1.5">
              <span className="text-[#A8C334] text-xs font-bold">{stats.callbackBooked}</span>
              <span className="text-[#A8C334]/60 text-[10px]">Rückrufe</span>
            </div>
          ) : null}
        </div>

        {/* Action buttons */}
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
              title="Link kopieren"
            >
              {copied ? <CheckCheck className="h-3.5 w-3.5 text-[#A8C334]" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={onDelete}
              className="text-white/20 hover:text-red-400 transition-colors"
              title="Demo löschen"
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
      if (!res.ok) { toast({ title: "Extraktion fehlgeschlagen", variant: "destructive" }); return; }
      const data: BrandingConfig = await res.json();
      setBranding({
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
      });
      if (data.logoUrl) setLogoPreview(data.logoUrl);
      toast({ title: `${data.companyName} erkannt` });
    } catch {
      toast({ title: "Verbindung fehlgeschlagen", variant: "destructive" });
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
      toast({ title: "Name und Slug erforderlich", variant: "destructive" });
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
        toast({ title: err.error ?? "Fehler", variant: "destructive" });
        return;
      }
      const created = await res.json();
      toast({ title: `Demo "${created.name}" erstellt!`, description: `/demo/${created.slug}` });
      onCreated();
      reset();
    } finally { setCreating(false); }
  };

  const reset = () => {
    setWebsiteUrl("");
    setBranding({ companyName: "", slug: "", tagline: "", primaryColor: "", secondaryColor: "", logoUrl: "", city: "", phone: "", websiteUrl: "", heroHeadline: "" });
    setLogoFile(null);
    setLogoPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neue Demo erstellen</DialogTitle>
          <DialogDescription>
            Gib die Website des Interessenten ein — wir extrahieren Logo, Farben und Namen automatisch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label>Website-Adresse</Label>
            <div className="flex gap-2">
              <Input
                placeholder="z.B. pflegedienst-muenchen.de"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && extract()}
              />
              <Button onClick={extract} disabled={extracting || !websiteUrl} className="shrink-0 gap-1.5">
                {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Extrahieren
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Unternehmensname *</Label>
              <Input value={branding.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Pflegedienst München GmbH" />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">/demo/</span>
                <Input value={branding.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Stadt</Label>
              <Input value={branding.city ?? ""} onChange={(e) => update("city", e.target.value)} placeholder="München" />
            </div>
            <div className="space-y-2">
              <Label>Primärfarbe</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={branding.primaryColor || "#A8C334"} onChange={(e) => update("primaryColor", e.target.value)} className="h-10 w-14 rounded border border-input cursor-pointer" />
                <Input value={branding.primaryColor ?? ""} onChange={(e) => update("primaryColor", e.target.value)} className="font-mono text-sm" placeholder="#A8C334" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sekundärfarbe</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={branding.secondaryColor || "#1a3a1a"} onChange={(e) => update("secondaryColor", e.target.value)} className="h-10 w-14 rounded border border-input cursor-pointer" />
                <Input value={branding.secondaryColor ?? ""} onChange={(e) => update("secondaryColor", e.target.value)} className="font-mono text-sm" placeholder="#1a3a1a" />
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Tagline</Label>
              <Input value={branding.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)} placeholder="Professionelle Pflege mit Herz" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Hero-Überschrift</Label>
              <Input value={branding.heroHeadline ?? ""} onChange={(e) => update("heroHeadline", e.target.value)} placeholder="Pflege, der Sie vertrauen können." />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input value={branding.phone ?? ""} onChange={(e) => update("phone", e.target.value)} placeholder="+49 89 12345678" />
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
                  <p className="font-extrabold" style={{ color: branding.primaryColor }}>{branding.companyName || "Name"}</p>
                  {branding.tagline && <p className="text-xs text-muted-foreground">{branding.tagline}</p>}
                </div>
                <div className="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: branding.primaryColor }}>/demo/{branding.slug || "slug"}</div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { onClose(); reset(); }}>Abbrechen</Button>
            <Button onClick={create} disabled={creating || uploading || !branding.companyName} className="gap-2">
              {(creating || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              Demo erstellen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
