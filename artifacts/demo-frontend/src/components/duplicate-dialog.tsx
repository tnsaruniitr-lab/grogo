import { useState } from "react";
import { CopyPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getBasicAuthHeader } from "@workspace/api-client-react";

interface DuplicateDialogProps {
  client: { id: number; slug: string; branding: { companyName: string } };
  onClose: () => void;
  onCreated: () => void;
}

export function DuplicateDialog({ client, onClose, onCreated }: DuplicateDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const defaultSlug = `${client.slug}-b`;
  const [slug, setSlug] = useState(defaultSlug);
  const [loading, setLoading] = useState(false);

  const slugified = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");

  const handleDuplicate = async () => {
    const finalSlug = slugified || defaultSlug;
    setLoading(true);
    const auth = getBasicAuthHeader();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (auth) headers["Authorization"] = auth;
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/duplicate`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ slug: finalSlug }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) {
        toast({ title: "Duplicate failed", description: json.error ?? "Unknown error", variant: "destructive" });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
      toast({
        title: "Brand duplicated",
        description: `/${finalSlug} is ready — assign a model and start testing.`,
      });
      onCreated();
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CopyPlus className="h-5 w-5 text-primary" />
            Duplicate — {client.branding.companyName}
          </DialogTitle>
          <DialogDescription>
            Creates an identical brand with a fresh slug, copied knowledge base, and no Twilio number.
            Assign a different model afterwards to run a side-by-side test.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          <div>
            <Label htmlFor="dup-slug" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              New slug
            </Label>
            <Input
              id="dup-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={defaultSlug}
              className="mt-1.5 font-mono text-sm"
            />
            {slugified && slugified !== slug && (
              <p className="text-xs text-muted-foreground mt-1">Will be saved as: <code className="font-mono">{slugified}</code></p>
            )}
          </div>

          <div className="rounded-md bg-muted/50 px-3 py-2 space-y-1 text-xs text-muted-foreground">
            <div>✓ Full knowledge base copied ({client.slug})</div>
            <div>✓ All branding &amp; config copied</div>
            <div>✓ Fresh demo token generated</div>
            <div className="text-amber-600">⚠ No WhatsApp / Twilio number — ManyChat works immediately</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleDuplicate} disabled={loading || !slugified} className="gap-2">
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <CopyPlus className="h-4 w-4" />
            }
            Duplicate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
