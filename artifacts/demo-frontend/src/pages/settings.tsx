import { useState, useEffect, useRef } from "react";
import { AdminNav } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Save, RotateCcw, Cpu, Brain, Globe, MessageCircle, Layers } from "lucide-react";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import type { SystemSettings } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const MODEL_OPTIONS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1-mini",
  "gpt-4.1",
  "gpt-4.5",
  "gpt-5.4-nano",
  "gpt-5.4-mini",
  "gpt-5.4",
  "gpt-5.4-pro",
  "gpt-5.5",
  "gpt-5.5-pro",
  "o4-mini",
  "o3",
  "o3-deep-research",
] as const;

function SettingsSection({ title, description, icon: Icon, children }: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function ModelSelect({ label, value, onChange, description }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MODEL_OPTIONS.map((m) => (
            <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, comingSoon }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  comingSoon?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${comingSoon ? "opacity-50" : ""}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold">{label}</p>
          {comingSoon && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-slate-300 text-slate-500 font-normal">
              coming soon
            </Badge>
          )}
        </div>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="shrink-0 mt-0.5" disabled={comingSoon} />
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: serverSettings, isLoading } = useGetSettings();
  const updateMutation = useUpdateSettings({
    mutation: {
      onSuccess: () => {
        setDirty(false);
        toast({ title: "Settings saved" });
      },
      onError: () => toast({ title: "Save failed", variant: "destructive" }),
    },
  });

  const [draft, setDraft] = useState<Partial<SystemSettings>>({});
  const [dirty, setDirty] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (serverSettings && !initialized.current) {
      initialized.current = true;
      setDraft(serverSettings);
    }
  }, [serverSettings]);

  const set = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    updateMutation.mutate({ data: draft });
  };

  const handleReset = () => {
    if (serverSettings) {
      setDraft(serverSettings);
      setDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const s = draft;

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Platform Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Configure AI models, crawl behaviour, and pipeline controls.</p>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-700 text-[11px]">
                Unsaved changes
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleReset} disabled={!dirty}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!dirty || updateMutation.isPending} className="gap-1.5">
              {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-6">

          {/* AI Models */}
          <SettingsSection
            title="AI Models"
            description="Choose which OpenAI model runs each pipeline stage. Stronger models produce better results but cost more."
            icon={Brain}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ModelSelect
                label="Page extraction model"
                value={s.pageExtractionModel ?? "gpt-4o-mini"}
                onChange={(v) => set("pageExtractionModel", v)}
                description="Used for per-page Q&A extraction. Keep cheap."
              />
              <ModelSelect
                label="Profile synthesis model"
                value={s.profileSynthesisModel ?? "gpt-4o"}
                onChange={(v) => set("profileSynthesisModel", v)}
                description="Synthesises the canonical business profile. Use strong model."
              />
              <ModelSelect
                label="Web research model"
                value={s.webResearchModel ?? "gpt-4o"}
                onChange={(v) => set("webResearchModel", v)}
                description="Used for external evidence enrichment."
              />
              <ModelSelect
                label="Live chat model"
                value={s.liveChatModel ?? "gpt-4o-mini"}
                onChange={(v) => set("liveChatModel", v)}
                description="Powers WhatsApp conversations."
              />
            </div>
          </SettingsSection>

          {/* Crawl Pipeline */}
          <SettingsSection
            title="Crawl Pipeline"
            description="Controls page discovery, extraction limits, and extractor version."
            icon={Layers}
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Extractor version</Label>
              <p className="text-[11px] text-muted-foreground">V1: simple extraction, auto-approve. V2: evidence-backed, pending until human activates.</p>
              <Select value={s.extractorVersion ?? "v1"} onValueChange={(v) => set("extractorVersion", v as "v1" | "v2")}>
                <SelectTrigger className="h-8 text-xs w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1" className="text-xs">
                    <div className="flex items-center gap-2">v1 <Badge variant="outline" className="text-[10px] h-4 px-1">stable</Badge></div>
                  </SelectItem>
                  <SelectItem value="v2" className="text-xs">
                    <div className="flex items-center gap-2">v2 <Badge className="text-[10px] h-4 px-1 bg-violet-600">new</Badge></div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Max pages per crawl</Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  className="h-8 text-xs"
                  value={s.maxPagesPerCrawl ?? 50}
                  onChange={(e) => set("maxPagesPerCrawl", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Crawl concurrency</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  className="h-8 text-xs"
                  value={s.crawlConcurrency ?? 5}
                  onChange={(e) => set("crawlConcurrency", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Min extraction confidence</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  className="h-8 text-xs"
                  value={s.minExtractionConfidence ?? 0.6}
                  onChange={(e) => set("minExtractionConfidence", Number(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            <ToggleRow
              label="Structured data parsing"
              description="Parse JSON-LD / Schema.org markup during extraction"
              checked={s.enableStructuredDataParsing ?? true}
              onChange={(v) => set("enableStructuredDataParsing", v)}
              comingSoon
            />
            <ToggleRow
              label="JS render fallback"
              description="Attempt headless rendering when page text is too short"
              checked={s.enableJsRenderFallback ?? false}
              onChange={(v) => set("enableJsRenderFallback", v)}
              comingSoon
            />
          </SettingsSection>

          {/* Approval & Activation */}
          <SettingsSection
            title="Approval & Activation"
            description="Controls when extracted knowledge becomes visible to the live chatbot."
            icon={Cpu}
          >
            <ToggleRow
              label="Require human activation (V2)"
              description="V2 crawl results stay pending until an admin activates them. Disable to auto-activate."
              checked={s.requireHumanActivation ?? true}
              onChange={(v) => set("requireHumanActivation", v)}
              comingSoon
            />
            <ToggleRow
              label="Auto-approve manual entries"
              description="Knowledge entries added manually in the admin panel are approved immediately"
              checked={s.allowAutoApproveManualEntries ?? true}
              onChange={(v) => set("allowAutoApproveManualEntries", v)}
            />
            <ToggleRow
              label="Approved-only for live chat"
              description="Only approved knowledge rows are returned to the live chatbot"
              checked={s.approvedOnlyForLiveChat ?? true}
              onChange={(v) => set("approvedOnlyForLiveChat", v)}
              comingSoon
            />
          </SettingsSection>

          {/* Web Research */}
          <SettingsSection
            title="Web Research Enrichment"
            description="After crawling, optionally run web searches to enrich the business profile evidence."
            icon={Globe}
          >
            <ToggleRow
              label="Enable web research"
              description="Uses the web research model + web_search to gather external evidence for profile fields"
              checked={s.enableWebResearch ?? false}
              onChange={(v) => set("enableWebResearch", v)}
              comingSoon
            />
            <ToggleRow
              label="Own domain auto-trusted"
              description="Results from the client's own website domain are trusted without human review"
              checked={s.ownDomainAutoTrusted ?? true}
              onChange={(v) => set("ownDomainAutoTrusted", v)}
              comingSoon
            />
            <ToggleRow
              label="Require review for external sources"
              description="Evidence from external sites always requires human review before activation"
              checked={s.requireExternalSourceReview ?? true}
              onChange={(v) => set("requireExternalSourceReview", v)}
              comingSoon
            />
          </SettingsSection>

          {/* Chat Retrieval */}
          <SettingsSection
            title="Chat Retrieval"
            description="Tuning for how knowledge is ranked and served to the live chatbot."
            icon={MessageCircle}
          >
            <ToggleRow
              label="Facts pack enabled"
              description="Pack the top-5 knowledge chunks into every bot turn"
              checked={s.factsPackEnabled ?? true}
              onChange={(v) => set("factsPackEnabled", v)}
              comingSoon
            />
            <ToggleRow
              label="Same-language boost"
              description="Rank knowledge entries in the same language as the conversation higher"
              checked={s.sameLanguageBoost ?? true}
              onChange={(v) => set("sameLanguageBoost", v)}
              comingSoon
            />
            <ToggleRow
              label="Manual source boost"
              description="Rank manually-entered knowledge entries above crawled entries"
              checked={s.manualSourceBoost ?? true}
              onChange={(v) => set("manualSourceBoost", v)}
              comingSoon
            />
          </SettingsSection>

        </div>

        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={!dirty}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!dirty || updateMutation.isPending} className="gap-1.5">
            {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save settings
          </Button>
        </div>
      </div>
    </div>
  );
}
