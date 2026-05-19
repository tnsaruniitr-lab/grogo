import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  Video,
  MonitorPlay,
  FileText,
  Image,
  Link2,
  Plus,
  Trash2,
  Loader2,
  Package,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AssetType = "calendly" | "loom" | "gmeet" | "pdf" | "image" | "custom";

interface Asset {
  id: number;
  type: string;
  label: string;
  url: string;
  serviceContext?: string;
  createdAt: string;
}

const ASSET_TYPE_CONFIG: Record<AssetType, {
  label: string;
  icon: React.ReactNode;
  description: string;
  urlPlaceholder: string;
  showContext: boolean;
  contextLabel?: string;
  contextPlaceholder?: string;
}> = {
  calendly: {
    label: "Calendly",
    icon: <CalendarDays className="h-4 w-4" />,
    description: "Booking link for calls & consultations",
    urlPlaceholder: "https://calendly.com/you/30min",
    showContext: false,
  },
  loom: {
    label: "Loom Video",
    icon: <MonitorPlay className="h-4 w-4" />,
    description: "Product demo or walkthrough video",
    urlPlaceholder: "https://loom.com/share/abc123",
    showContext: false,
  },
  gmeet: {
    label: "Google Meet",
    icon: <Video className="h-4 w-4" />,
    description: "Video call link for live meetings",
    urlPlaceholder: "https://meet.google.com/abc-defg-hij",
    showContext: false,
  },
  pdf: {
    label: "Price List / Brochure",
    icon: <FileText className="h-4 w-4" />,
    description: "PDF pricing guide or service brochure",
    urlPlaceholder: "https://example.com/pricing.pdf",
    showContext: true,
    contextLabel: "Service (optional)",
    contextPlaceholder: "e.g. physiotherapy, live-in care",
  },
  image: {
    label: "Price Chart",
    icon: <Image className="h-4 w-4" />,
    description: "Pricing chart or rate card image",
    urlPlaceholder: "https://example.com/price-chart.jpg",
    showContext: true,
    contextLabel: "Service (optional)",
    contextPlaceholder: "e.g. hourly rates, package pricing",
  },
  custom: {
    label: "Custom Link",
    icon: <Link2 className="h-4 w-4" />,
    description: "Any other resource or link",
    urlPlaceholder: "https://example.com/resource",
    showContext: true,
    contextLabel: "Context (optional)",
    contextPlaceholder: "Describe when to send this",
  },
};

const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  calendly: <CalendarDays className="h-3.5 w-3.5" />,
  loom: <MonitorPlay className="h-3.5 w-3.5" />,
  gmeet: <Video className="h-3.5 w-3.5" />,
  pdf: <FileText className="h-3.5 w-3.5" />,
  image: <Image className="h-3.5 w-3.5" />,
  custom: <Link2 className="h-3.5 w-3.5" />,
};

const TYPE_COLOR_MAP: Record<string, string> = {
  calendly: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  loom: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  gmeet: "bg-green-500/10 text-green-400 border-green-500/20",
  pdf: "bg-red-500/10 text-red-400 border-red-500/20",
  image: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  custom: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function AssetsDialog({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [form, setForm] = useState({ label: "", url: "", serviceContext: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${slug}/assets`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data = await res.json() as { assets: Asset[] };
      setAssets(data.assets);
    } catch {
      toast({ title: "Failed to load assets", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  useEffect(() => { void fetchAssets(); }, [fetchAssets]);

  const handleAdd = async () => {
    if (!selectedType) return;
    if (!form.label.trim()) { toast({ title: "Label is required", variant: "destructive" }); return; }
    if (!form.url.trim()) { toast({ title: "URL is required", variant: "destructive" }); return; }
    try { new URL(form.url.trim()); } catch {
      toast({ title: "Please enter a valid URL (include https://)", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${slug}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          label: form.label.trim(),
          url: form.url.trim(),
          serviceContext: form.serviceContext.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Create failed");
      }
      toast({ title: "Asset saved", description: "The bot will now be able to send this on request" });
      setAdding(false);
      setSelectedType(null);
      setForm({ label: "", url: "", serviceContext: "" });
      await fetchAssets();
    } catch (e: unknown) {
      toast({ title: (e instanceof Error ? e.message : "Save failed"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this asset? The bot will no longer be able to send it.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/clients/${slug}/assets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast({ title: "Asset removed" });
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const config = selectedType ? ASSET_TYPE_CONFIG[selectedType] : null;

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" /> Demo Assets — <span className="font-mono text-primary">{slug}</span>
          </DialogTitle>
          <DialogDescription>
            Save links and resources the bot can send on request — Calendly, Loom, GMeet, price lists, and more.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Existing assets */}
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : assets.length === 0 && !adding ? (
              <div className="text-center py-10 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No assets yet</p>
                <p className="text-xs mt-1">Add a Calendly link, Loom video, price PDF, or any link the bot should send on request.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-semibold shrink-0 ${TYPE_COLOR_MAP[asset.type] ?? TYPE_COLOR_MAP.custom}`}>
                      {TYPE_ICON_MAP[asset.type] ?? TYPE_ICON_MAP.custom}
                      <span className="capitalize">{asset.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">{asset.label}</p>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5 truncate"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{asset.url}</span>
                      </a>
                      {asset.serviceContext && (
                        <p className="text-xs text-muted-foreground/60 mt-0.5 italic">{asset.serviceContext}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleDelete(asset.id)}
                      disabled={deletingId === asset.id}
                      title="Remove asset"
                    >
                      {deletingId === asset.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add asset flow */}
            {adding && (
              <div className="border rounded-xl bg-muted/20 p-4 space-y-4">
                <p className="text-sm font-semibold">What type of asset?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(ASSET_TYPE_CONFIG) as AssetType[]).map((type) => {
                    const c = ASSET_TYPE_CONFIG[type];
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => { setSelectedType(type); setForm({ label: "", url: "", serviceContext: "" }); }}
                        className={`flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {c.icon}
                          <span className="text-xs font-semibold">{c.label}</span>
                        </div>
                        <p className="text-[11px] leading-snug opacity-70">{c.description}</p>
                      </button>
                    );
                  })}
                </div>

                {selectedType && config && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Label</Label>
                        <Input
                          className="h-8 text-sm"
                          placeholder={`e.g. Free 30-min call, Product demo…`}
                          value={form.label}
                          onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                          autoFocus
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">URL</Label>
                        <Input
                          className="h-8 text-sm"
                          placeholder={config.urlPlaceholder}
                          value={form.url}
                          onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                        />
                      </div>
                    </div>
                    {config.showContext && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">{config.contextLabel}</Label>
                        <Input
                          className="h-8 text-sm"
                          placeholder={config.contextPlaceholder}
                          value={form.serviceContext}
                          onChange={(e) => setForm((p) => ({ ...p, serviceContext: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => { setAdding(false); setSelectedType(null); setForm({ label: "", url: "", serviceContext: "" }); }}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAdd} disabled={saving || !selectedType} className="gap-1.5">
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    Save Asset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {!adding && (
          <div className="px-6 py-4 border-t">
            <Button
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setAdding(true)}
            >
              <Plus className="h-4 w-4" /> Add Asset
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
