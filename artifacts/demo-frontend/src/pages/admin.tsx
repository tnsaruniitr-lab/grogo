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
  useListKnowledgeEntries,
  useCreateKnowledgeEntry,
  useDeleteKnowledgeEntry,
} from "@workspace/api-client-react";
import type { KnowledgeEntry } from "@workspace/api-client-react";
import {
  Globe,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  CheckCheck,
  Sparkles,
  Upload,
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
                            onClick={() => setKnowledgeSlug(client.slug)}
                          >
                            <BookOpen className="h-3 w-3" /> Knowledge
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

      {knowledgeSlug && (
        <KnowledgeDialog
          slug={knowledgeSlug}
          onClose={() => setKnowledgeSlug(null)}
        />
      )}
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
        },
      };
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Fehler", description: err.error ?? "Demo konnte nicht erstellt werden", variant: "destructive" });
        return;
      }
      const created: DemoClient = await res.json();
      toast({
        title: "Demo erstellt!",
        description: `Demo-Link: /demo/${created.slug}`,
      });
      onCreated();
    } finally {
      setCreating(false);
    }
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

        <div className="space-y-6 mt-2">
          <div className="space-y-2">
            <Label>Website-Adresse</Label>
            <div className="flex gap-2">
              <Input
                placeholder="z.B. pflegedienst-muenchen.de"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && extractBranding()}
              />
              <Button onClick={extractBranding} disabled={extracting || !websiteUrl} className="gap-2 shrink-0">
                {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Extrahieren
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Wir lesen Logo, Markenfarbe und Firmennamen automatisch aus.
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Unternehmensname *</Label>
              <Input
                placeholder="Pflegedienst München GmbH"
                value={branding.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Demo-Slug *</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">/demo/</span>
                <Input
                  placeholder="pflegedienst-muenchen"
                  value={branding.slug}
                  onChange={(e) => updateField("slug", slugify(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stadt</Label>
              <Input
                placeholder="München"
                value={branding.city ?? ""}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Primärfarbe</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={branding.primaryColor || "#A8C334"}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  className="h-10 w-14 rounded border border-input cursor-pointer"
                />
                <Input
                  placeholder="#A8C334"
                  value={branding.primaryColor ?? ""}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sekundärfarbe</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={branding.secondaryColor || "#1a3a1a"}
                  onChange={(e) => updateField("secondaryColor", e.target.value)}
                  className="h-10 w-14 rounded border border-input cursor-pointer"
                />
                <Input
                  placeholder="#1a3a1a"
                  value={branding.secondaryColor ?? ""}
                  onChange={(e) => updateField("secondaryColor", e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Tagline / Slogan</Label>
              <Input
                placeholder="Professionelle Pflege mit Herz"
                value={branding.tagline ?? ""}
                onChange={(e) => updateField("tagline", e.target.value)}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Hero-Überschrift</Label>
              <Input
                placeholder="Pflege, der Sie vertrauen können."
                value={branding.heroHeadline ?? ""}
                onChange={(e) => updateField("heroHeadline", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input
                placeholder="+49 89 12345678"
                value={branding.phone ?? ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Website-URL</Label>
              <Input
                placeholder="https://pflegedienst-muenchen.de"
                value={branding.websiteUrl ?? ""}
                onChange={(e) => updateField("websiteUrl", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-start gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo-Vorschau"
                    className="h-16 w-16 rounded-lg object-contain bg-muted p-1 border border-border"
                    onError={(e) => { (e.target as HTMLImageElement).src = ""; setLogoPreview(null); }}
                  />
                  <button
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                    onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                  >×</button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoFile(file);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Logo hochladen oder URL automatisch aus der Website übernehmen
                </p>
                {!logoFile && (
                  <Input
                    placeholder="https://example.com/logo.png"
                    value={branding.logoUrl ?? ""}
                    onChange={(e) => {
                      updateField("logoUrl", e.target.value);
                      setLogoPreview(e.target.value || null);
                    }}
                    className="text-xs"
                  />
                )}
              </div>
            </div>
          </div>

          {branding.primaryColor && (
            <div className="rounded-lg p-4 border border-border" style={{ backgroundColor: branding.primaryColor + "22" }}>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Vorschau</p>
              <div className="flex items-center gap-3">
                {logoPreview && (
                  <img src={logoPreview} alt="" className="h-10 w-10 rounded object-contain bg-white p-0.5"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <div>
                  <p className="font-extrabold text-lg" style={{ color: branding.primaryColor }}>
                    {branding.companyName || "Unternehmensname"}
                  </p>
                  {branding.tagline && <p className="text-xs text-muted-foreground">{branding.tagline}</p>}
                </div>
                <div className="ml-auto">
                  <div className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: branding.primaryColor }}>
                    WhatsApp
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { onClose(); reset(); }}>
              Abbrechen
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || uploading || !branding.companyName}
              className="gap-2"
            >
              {(creating || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              Demo erstellen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const LANG_LABELS: Record<string, string> = { en: "EN", de: "DE", tr: "TR" };
const LANG_COLORS: Record<string, string> = {
  en: "bg-blue-100 text-blue-700",
  de: "bg-green-100 text-green-700",
  tr: "bg-red-100 text-red-700",
};

function KnowledgeDialog({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const qk = ["knowledge", slug];

  const { data, isLoading } = useListKnowledgeEntries<{ entries: KnowledgeEntry[]; categories: string[] }>(slug, {
    query: {
      queryKey: qk,
      select: (d) => d as unknown as { entries: KnowledgeEntry[]; categories: string[] },
    },
  });

  const entries = data?.entries ?? [];
  const allCategories = data?.categories ?? [];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const currentCat = activeCategory ?? allCategories[0] ?? null;
  const shown = currentCat ? entries.filter((e) => e.category === currentCat) : [];

  const deleteMutation = useDeleteKnowledgeEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: qk });
        toast({ title: "Entry deleted" });
      },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    },
  });

  const [form, setForm] = useState({ category: "", newCategory: "", question: "", answer: "", language: "en" });
  const [adding, setAdding] = useState(false);

  const createMutation = useCreateKnowledgeEntry({
    mutation: {
      onSuccess: (created) => {
        queryClient.invalidateQueries({ queryKey: qk });
        setActiveCategory(created.category);
        setAdding(false);
        setForm({ category: "", newCategory: "", question: "", answer: "", language: "en" });
        toast({ title: "Entry added", description: `Embedding generated automatically` });
      },
      onError: () => toast({ title: "Create failed", variant: "destructive" }),
    },
  });

  const handleCreate = () => {
    const cat = form.newCategory.trim() || form.category;
    if (!cat || !form.question.trim() || !form.answer.trim()) {
      toast({ title: "Category, question and answer are required", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      slug,
      data: { category: cat, question: form.question.trim(), answer: form.answer.trim(), language: form.language, priority: 0 },
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Knowledge Base — <span className="font-mono text-primary">{slug}</span>
          </DialogTitle>
          <DialogDescription>
            {entries.length} entries across {allCategories.length} categories. These are the Q&amp;A pairs the bot uses to answer questions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: category list */}
          <div className="w-44 border-r bg-muted/30 flex flex-col shrink-0">
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                {isLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
                ) : allCategories.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-3">No entries yet</p>
                ) : (
                  allCategories.map((cat) => {
                    const count = entries.filter((e) => e.category === cat).length;
                    const isActive = (activeCategory ?? allCategories[0]) === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between gap-1 transition-colors ${isActive ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}
                      >
                        <span className="truncate capitalize">{cat}</span>
                        <span className={`text-xs shrink-0 font-mono ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{count}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-2 border-t">
              <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs" onClick={() => setAdding(true)}>
                <Plus className="h-3 w-3" /> Add Entry
              </Button>
            </div>
          </div>

          {/* Right: entries */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : shown.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No entries in this category</p>
                  </div>
                ) : (
                  shown.map((entry) => {
                    const expanded = expandedIds.has(entry.id);
                    return (
                      <div key={entry.id} className="border rounded-lg bg-card overflow-hidden">
                        <div
                          className="flex items-start gap-2 p-3 cursor-pointer hover:bg-muted/30 select-none"
                          onClick={() => toggleExpand(entry.id)}
                        >
                          <div className="mt-0.5 text-muted-foreground shrink-0">
                            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-snug truncate">{entry.question}</p>
                            {!expanded && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.answer}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${LANG_COLORS[entry.language] ?? "bg-muted text-muted-foreground"}`}>
                              {LANG_LABELS[entry.language] ?? entry.language.toUpperCase()}
                            </span>
                            {entry.source === "manual" && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">manual</span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Delete this entry?")) {
                                  deleteMutation.mutate({ slug, id: entry.id });
                                }
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {expanded && (
                          <div className="px-9 pb-3 pt-0">
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.answer}</p>
                            {entry.sourceUrl && (
                              <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1.5 flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" /> {entry.sourceUrl}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Add entry form */}
        {adding && (
          <div className="border-t bg-muted/20 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">New Entry</p>
              <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v, newCategory: "" }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Existing…" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="or type new category"
                  className="h-8 text-xs"
                  value={form.newCategory}
                  onChange={(e) => setForm((p) => ({ ...p, newCategory: e.target.value, category: "" }))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Language</Label>
                <Select value={form.language} onValueChange={(v) => setForm((p) => ({ ...p, language: v }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en" className="text-xs">English</SelectItem>
                    <SelectItem value="de" className="text-xs">German</SelectItem>
                    <SelectItem value="tr" className="text-xs">Turkish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Question</Label>
                <Input
                  placeholder="e.g. What does a session cost?"
                  className="h-8 text-xs"
                  value={form.question}
                  onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Answer</Label>
              <Textarea
                placeholder="Provide the full answer the bot should give…"
                className="text-xs resize-none"
                rows={3}
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" className="gap-2" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                Add & Embed
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
