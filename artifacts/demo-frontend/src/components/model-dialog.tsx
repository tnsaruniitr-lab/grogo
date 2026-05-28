import { useState } from "react";
import { Cpu, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateDemoClient } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const MODEL_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: "", label: "Global default", description: "Uses the platform-wide model setting" },
  { value: "gpt-4o-mini", label: "GPT-4o mini", description: "Balanced speed & quality — current default" },
  { value: "gpt-4.1-nano", label: "GPT-4.1 nano", description: "Fastest & cheapest — great for high volume" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 mini", description: "Fast with stronger reasoning" },
  { value: "gpt-4.1", label: "GPT-4.1", description: "Highest quality — slower & more expensive" },
];

interface ModelDialogClient {
  id: number;
  branding: { companyName: string; liveChatModel?: string | null };
}

export function ModelDialog({
  client,
  onClose,
  onSaved,
}: {
  client: ModelDialogClient;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string>(client.branding.liveChatModel ?? "");

  const updateMutation = useUpdateDemoClient({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["demo-clients"] });
        toast({ title: "Model saved", description: "Bot will use the selected model from the next message." });
        onSaved();
      },
      onError: () => {
        toast({ title: "Error saving model", variant: "destructive" });
      },
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: client.id,
      data: {
        branding: {
          companyName: client.branding.companyName,
          liveChatModel: selected || null,
        } as Parameters<typeof updateMutation.mutate>[0]["data"]["branding"],
      },
    });
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            AI Model — {client.branding.companyName}
          </DialogTitle>
          <DialogDescription>
            Pick the AI model for this brand's bot replies. "Global default" follows the platform-wide setting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {MODEL_OPTIONS.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={[
                "w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                selected === value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-transparent hover:border-muted-foreground/40",
              ].join(" ")}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
              </div>
              {selected === value && (
                <div className="h-4 w-4 rounded-full bg-primary mt-0.5 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
