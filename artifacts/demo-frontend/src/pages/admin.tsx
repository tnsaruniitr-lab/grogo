import { useState } from "react";
import { AdminNav } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListDemoClients,
  useDeleteDemoClient,
  useUpdateDemoClient,
  createDemoClient,
} from "@workspace/api-client-react";
import {
  Globe,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  CheckCheck,
  ClipboardCheck,
  Sparkles,
  Upload,
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Save,
  ChevronDown,
  ChevronUp,
  Settings2,
} from "lucide-react";
import { KnowledgeDialog } from "@/components/knowledge-dialog";
import { KnowledgeReviewPanel } from "@/components/knowledge-review-panel";
import { useToast } from "@/hooks/use-toast";
import { LANG_OPTIONS } from "@/lib/demo-i18n";

interface BrandingConfig {
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


function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDemoUrl(slug: string): string {
  return `${window.location.origin}/demo/${slug}`;
}

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [knowledgeSlug, setKnowledgeSlug] = useState<string | null>(null);
  const [reviewSlug, setReviewSlug] = useState<string | null>(null);
  const [whatsappClient, setWhatsappClient] = useState<DemoClient | null>(null);

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
    await navigator.clipboard.writeText(getDemoUrl(slug));
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-secondary">Demo Admin</h1>
            <p className="text-muted-foreground mt-1">
              Erstelle gebrandete Demos für Interessenten — ein Link, ihr Look.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Neue Demo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aktive Demos</CardTitle>
            <CardDescription>
              {clients.length} Demo{clients.length !== 1 ? "s" : ""} erstellt
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Noch keine Demos</p>
                <p className="text-sm mt-1">Erstelle deine erste Demo oben</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unternehmen</TableHead>
                    <TableHead>Farbe</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Erstellt</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {client.branding.logoUrl ? (
                            <img
                              src={client.branding.logoUrl}
                              alt={client.branding.companyName}
                              className="h-8 w-8 rounded object-contain bg-muted p-0.5"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: client.branding.primaryColor ?? "#A8C334" }}
                            >
                              {client.branding.companyName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{client.branding.companyName}</p>
                            <p className="text-xs text-muted-foreground">/{client.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.branding.primaryColor ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-5 w-5 rounded-full border border-border"
                              style={{ backgroundColor: client.branding.primaryColor }}
                            />
                            <span className="text-xs font-mono text-muted-foreground">
                              {client.branding.primaryColor}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.branding.websiteUrl ? (
                          <a
                            href={client.branding.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            {new URL(client.branding.websiteUrl).hostname}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(client.createdAt).toLocaleDateString("de-DE")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            onClick={() => copyLink(client.slug)}
                          >
                            {copiedSlug === client.slug ? (
                              <><CheckCheck className="h-3 w-3" /> Kopiert</>
                            ) : (
                              <><Copy className="h-3 w-3" /> Link</>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            onClick={() => window.open(`/demo/${client.slug}`, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" /> Vorschau
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            onClick={() => window.open(`/demo/${client.slug}/dashboard`, "_blank")}
                          >
                            <LayoutDashboard className="h-3 w-3" /> Dashboard
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            onClick={() => setReviewSlug(client.slug)}
                          >
                            <ClipboardCheck className="h-3 w-3" /> Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            onClick={() => setKnowledgeSlug(client.slug)}
                          >
                            <BookOpen className="h-3 w-3" /> Knowledge
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => setWhatsappClient(client)}
                          >
                            <MessageCircle className="h-3 w-3" /> WhatsApp
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm(`Demo "${client.branding.companyName}" wirklich löschen?`)) {
                                deleteMutation.mutate({ id: client.id });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateDemoDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
          setShowCreate(false);
        }}
      />

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

      {whatsappClient && (
        <WhatsAppLinkDialog
          client={whatsappClient}
          onClose={() => setWhatsappClient(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
            setWhatsappClient(null);
          }}
        />
      )}
    </div>
  );
}

const INDUSTRY_OPTIONS = [
  { value: "medspa", label: "Medspa", emoji: "✨" },
  { value: "dental", label: "Dental", emoji: "🦷" },
  { value: "hair-clinic", label: "Hair Clinic", emoji: "💇" },
  { value: "iv-therapy", label: "IV Therapy", emoji: "⚡" },
  { value: "fertility", label: "Fertility", emoji: "❤️" },
  { value: "weight-mgmt", label: "Weight Mgmt", emoji: "📋" },
  { value: "wellness", label: "Wellness", emoji: "🌿" },
  { value: "surgery", label: "Surgery", emoji: "⭐" },
  { value: "home-care", label: "Home Care", emoji: "🏠" },
  { value: "other", label: "Other", emoji: "➕" },
];

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
  const [demoLanguages, setDemoLanguages] = useState<string[]>(["en"]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const toggleLanguage = (code: string) => {
    setDemoLanguages((prev) => {
      if (prev.includes(code)) {
        const next = prev.filter((l) => l !== code);
        return next.length === 0 ? prev : next;
      }
      return [...prev, code];
    });
  };

  const updateField = (key: keyof BrandingConfig, value: string) => {
    setBranding((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "companyName") next.slug = slugify(value);
      return next;
    });
  };

  const extractBranding = async () => {
    if (!websiteUrl) return;
    setExtracting(true);
    try {
      const res = await fetch("/api/admin/extract-branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}` }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Fehler", description: err.error ?? "Branding-Extraktion fehlgeschlagen", variant: "destructive" });
        return;
      }
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
        websiteUrl: data.websiteUrl ?? websiteUrl,
        heroHeadline: data.heroHeadline ?? "",
      });
      if (data.logoUrl) setLogoPreview(data.logoUrl);
      toast({ title: "Branding extrahiert", description: `${data.companyName} erkannt` });
    } catch {
      toast({ title: "Fehler", description: "Verbindung fehlgeschlagen", variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  };

  const handleLogoFile = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
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
      if (!meta.ok) throw new Error("Could not get upload URL");
      const { uploadURL, objectPath } = await meta.json();
      const upload = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": logoFile.type },
        body: logoFile,
      });
      if (!upload.ok) throw new Error("Upload failed");
      return `/api/storage${objectPath}`;
    } catch {
      toast({ title: "Logo-Upload fehlgeschlagen", variant: "destructive" });
      return branding.logoUrl ?? null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!branding.companyName || !branding.slug) {
      toast({ title: "Unternehmensname und Slug sind erforderlich", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const finalLogoUrl = await uploadLogo();
      const payload = {
        name: branding.companyName,
        slug: branding.slug,
        branding: {
          ...branding,
          companyName: branding.companyName,
          slug: branding.slug,
          logoUrl: finalLogoUrl,
          demoLanguage: demoLanguages[0] ?? "en",
          demoLanguages,
        },
      };
      const created = await createDemoClient(payload);
      toast({
        title: "Demo erstellt!",
        description: `Demo-Link: /demo/${created.slug}`,
      });
      onCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Demo konnte nicht erstellt werden";
      toast({ title: "Fehler", description: msg, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const reset = () => {
    setWebsiteUrl("");
    setBranding({ companyName: "", slug: "", tagline: "", primaryColor: "", secondaryColor: "", logoUrl: "", city: "", phone: "", websiteUrl: "", heroHeadline: "" });
    setDemoLanguages(["en"]);
    setLogoFile(null);
    setLogoPreview(null);
    setSelectedIndustry("");
    setShowAdvanced(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0">

        <div className="px-6 pt-6 pb-4 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Demo</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-0.5">
              Paste a prospect's website — we scan it and build a branded landing page instantly.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6">

          <div className="flex gap-2">
            <Input
              placeholder="e.g. growthmonk.ai"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && extractBranding()}
              className="flex-1"
            />
            <Button onClick={extractBranding} disabled={extracting || !websiteUrl} className="gap-2 shrink-0">
              {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {extracting ? "Scanning..." : "Scan"}
            </Button>
          </div>

          {branding.companyName && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt=""
                  className="h-10 w-10 rounded-lg object-contain bg-white p-1 shrink-0 border border-border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: branding.primaryColor || "#6366f1" }}
                >
                  {branding.companyName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">{branding.companyName}</p>
                {branding.tagline && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{branding.tagline}</p>
                )}
              </div>
              {branding.primaryColor && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className="h-4 w-4 rounded-full border border-border/60"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <span className="text-xs font-mono text-muted-foreground">{branding.primaryColor}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Business Type</Label>
            <div className="grid grid-cols-5 gap-2">
              {INDUSTRY_OPTIONS.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedIndustry((prev) => prev === value ? "" : value)}
                  className={[
                    "flex flex-col items-center gap-1 rounded-xl border py-3 px-1 text-xs font-medium transition-all",
                    selectedIndustry === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 hover:border-muted-foreground/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <span className="leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Company Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. City Dental Clinic"
                value={branding.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">URL Slug <span className="text-destructive">*</span></Label>
              <div className="flex items-center rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input select-none shrink-0">/demo/</span>
                <input
                  className="flex-1 px-3 py-2 text-sm font-mono bg-transparent outline-none"
                  placeholder="city-dental"
                  value={branding.slug}
                  onChange={(e) => updateField("slug", slugify(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Languages</Label>
            <div className="flex gap-2 flex-wrap">
              {LANG_OPTIONS.map(({ value, label, flag }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleLanguage(value)}
                  className={[
                    "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                    demoLanguages.includes(value)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/60",
                  ].join(" ")}
                >
                  {flag} {label}
                </button>
              ))}
            </div>
            {demoLanguages.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Default: {LANG_OPTIONS.find((o) => o.value === demoLanguages[0])?.flag}{" "}
                {LANG_OPTIONS.find((o) => o.value === demoLanguages[0])?.label}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <Settings2 className="h-4 w-4" />
            Customize colors, logo &amp; more...
            {showAdvanced ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </button>

          {showAdvanced && (
            <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Primary Color</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={branding.primaryColor || "#A8C334"}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="h-9 w-12 rounded border border-input cursor-pointer bg-transparent"
                    />
                    <Input
                      placeholder="#A8C334"
                      value={branding.primaryColor ?? ""}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="font-mono text-sm h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Secondary Color</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={branding.secondaryColor || "#1a3a1a"}
                      onChange={(e) => updateField("secondaryColor", e.target.value)}
                      className="h-9 w-12 rounded border border-input cursor-pointer bg-transparent"
                    />
                    <Input
                      placeholder="#1a3a1a"
                      value={branding.secondaryColor ?? ""}
                      onChange={(e) => updateField("secondaryColor", e.target.value)}
                      className="font-mono text-sm h-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tagline</Label>
                <Input
                  placeholder="Professional care with heart"
                  value={branding.tagline ?? ""}
                  onChange={(e) => updateField("tagline", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hero Headline</Label>
                <Input
                  placeholder="Care you can trust."
                  value={branding.heroHeadline ?? ""}
                  onChange={(e) => updateField("heroHeadline", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Logo</Label>
                <div className="flex items-center gap-3">
                  {logoPreview ? (
                    <div className="relative shrink-0">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-12 w-12 rounded-lg object-contain bg-white p-1 border border-border"
                        onError={(e) => { (e.target as HTMLImageElement).src = ""; setLogoPreview(null); }}
                      />
                      <button
                        className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none"
                        onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                      >×</button>
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-background border-2 border-dashed border-border flex items-center justify-center shrink-0">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer text-xs h-9"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }}
                    />
                    {!logoFile && (
                      <Input
                        placeholder="https://example.com/logo.png"
                        value={branding.logoUrl ?? ""}
                        onChange={(e) => { updateField("logoUrl", e.target.value); setLogoPreview(e.target.value || null); }}
                        className="text-xs h-9"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</Label>
                  <Input
                    placeholder="+1 555 000 0000"
                    value={branding.phone ?? ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">City</Label>
                  <Input
                    placeholder="Dubai"
                    value={branding.city ?? ""}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        <div className="px-6 pb-6">
          <Button
            onClick={handleCreate}
            disabled={creating || uploading || !branding.companyName}
            className="w-full h-11 gap-2 text-sm font-semibold"
          >
            {(creating || uploading) ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Create demo{branding.companyName ? ` for ${branding.companyName}` : ""}</>
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

/* KnowledgeDialog is now in @/components/knowledge-dialog */

function buildWaLink(twilioSender: string, slug: string, message: string): string {
  const number = twilioSender.replace(/^whatsapp:/i, "").replace(/[^0-9+]/g, "");
  const text = encodeURIComponent(`[${slug}] ${message}`);
  return `https://wa.me/${number}?text=${text}`;
}

function WhatsAppLinkDialog({
  client,
  onClose,
  onSaved,
}: {
  client: DemoClient;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const defaultMsg =
    (client.branding as BrandingConfig & { defaultMessage?: string | null }).defaultMessage ??
    `Hi, I'd like to learn more about ${client.branding.companyName}`;

  const [twilioSender, setTwilioSender] = useState(
    (client as DemoClient & { twilioSender?: string }).twilioSender ?? ""
  );
  const [message, setMessage] = useState(defaultMsg);
  const [copied, setCopied] = useState(false);
  const [snippetTab, setSnippetTab] = useState<"raw" | "inline" | "float">("inline");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const waLink = buildWaLink(twilioSender, client.slug, message);

  const updateMutation = useUpdateDemoClient({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
        toast({ title: "Saved", description: "WhatsApp link settings updated." });
        onSaved();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
      },
    },
  });

  const handleSave = () => {
    const existingBranding = client.branding as unknown as Record<string, unknown>;
    updateMutation.mutate({
      id: client.id,
      data: {
        twilioSender,
        branding: {
          ...existingBranding,
          defaultMessage: message,
        } as Parameters<typeof updateMutation.mutate>[0]["data"]["branding"],
      },
    });
  };

  const WA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>`;

  const snippets: Record<"raw" | "inline" | "float", { label: string; hint: string; code: string }> = {
    raw: {
      label: "Raw link",
      hint: "Use when the dev already has a button component. Just swap in this href.",
      code: waLink,
    },
    inline: {
      label: "Inline button",
      hint: "Self-contained styled button. Paste inside any section — no CSS file needed.",
      code: `<a href="${waLink}" target="_blank" rel="noopener noreferrer"
   style="display:inline-flex;align-items:center;gap:10px;background:#25D366;color:#ffffff;padding:12px 24px;border-radius:8px;font-family:sans-serif;font-size:15px;font-weight:600;text-decoration:none;">
  ${WA_SVG}
  Chat on WhatsApp
</a>`,
    },
    float: {
      label: "Floating widget",
      hint: "Fixed bottom-right bubble. Paste once before </body>. Works on every page automatically.",
      code: `<!-- WhatsApp floating button — paste before </body> -->
<style>
  #wa-float{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;align-items:center;justify-content:center;width:56px;height:56px;background:#25D366;border-radius:50%;box-shadow:0 4px 16px rgba(0,0,0,.28);text-decoration:none;transition:transform .2s,box-shadow .2s;}
  #wa-float:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(0,0,0,.32);}
</style>
<a id="wa-float" href="${waLink}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
</a>`,
    },
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(waLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySnippet = async () => {
    await navigator.clipboard.writeText(snippets[snippetTab].code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            WhatsApp Link — {client.branding.companyName}
          </DialogTitle>
          <DialogDescription>
            Incoming messages route automatically to this brand's bot and knowledge base.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label>Twilio Sender Number</Label>
            <Input
              value={twilioSender}
              onChange={(e) => setTwilioSender(e.target.value)}
              placeholder="whatsapp:+4915234567890"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              All brands can share the same number — the slug tag handles routing automatically.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Default Pre-fill Message</Label>
            <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground shrink-0 select-none bg-background border border-border rounded px-1.5 py-0.5">
                [{client.slug}]
              </span>
              <input
                className="flex-1 bg-transparent outline-none text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi, I'd like to learn more about ${client.branding.companyName}`}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The <code>[{client.slug}]</code> prefix is locked for routing. It's stripped before the bot or the lead ever sees it.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Generated link</Label>
              <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={copyLink}>
                {copied ? <><CheckCheck className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy link</>}
              </Button>
            </div>
            <Input readOnly value={waLink} className="font-mono text-xs bg-muted" />
          </div>

          <div className="space-y-3">
            <Label>Embed snippet</Label>

            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(["inline", "float", "raw"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSnippetTab(tab)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    snippetTab === tab
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {snippets[tab].label}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">{snippets[snippetTab].hint}</p>

            <div className="relative">
              <pre className="rounded-md bg-muted border border-border p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-48 overflow-y-auto">
                <code>{snippets[snippetTab].code}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-7 gap-1.5 text-xs bg-background"
                onClick={copySnippet}
              >
                {copiedSnippet ? <><CheckCheck className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
              </Button>
            </div>

            {snippetTab === "inline" && (
              <p className="text-xs text-muted-foreground">
                Drop inside a <code>{"<section>"}</code>, CTA div, or footer. Positioning is wherever you place it in the HTML.
              </p>
            )}
            {snippetTab === "float" && (
              <p className="text-xs text-muted-foreground">
                Fixed <strong>bottom-right</strong> on every page. Paste once before <code>{"</body>"}</code> — the CSS and icon are self-contained, no extra files needed.
              </p>
            )}
            {snippetTab === "raw" && (
              <p className="text-xs text-muted-foreground">
                Works on mobile (opens WhatsApp app) and desktop (opens WhatsApp Web). Wrap in any existing button or link element.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
