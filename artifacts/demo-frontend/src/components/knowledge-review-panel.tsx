import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetKnowledgeReview,
  useApproveKnowledgeEntries,
  useUpdateKnowledgeEntry,
  useDeleteKnowledgeEntry,
} from "@workspace/api-client-react";
import type { KnowledgeEntry } from "@workspace/api-client-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCheck,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANG_COLORS: Record<string, string> = {
  en: "bg-blue-100 text-blue-700",
  de: "bg-green-100 text-green-700",
  tr: "bg-red-100 text-red-700",
};

const SOURCE_COLORS: Record<string, string> = {
  manual: "bg-violet-100 text-violet-700",
  crawl: "bg-amber-100 text-amber-700",
  website: "bg-sky-100 text-sky-700",
};

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

function CriticalFactCard({
  factKey,
  label,
  value,
  entryId,
  sourceUrl,
  source,
  slug,
  onSaved,
}: {
  factKey: string;
  label: string;
  value: string;
  entryId: number | null;
  sourceUrl: string | null;
  source: string | null;
  slug: string;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const updateMutation = useUpdateKnowledgeEntry({
    mutation: {
      onSuccess: () => {
        setEditing(false);
        onSaved();
        toast({ title: "Fact saved", description: "Embedding regenerated automatically" });
      },
      onError: () => toast({ title: "Save failed", variant: "destructive" }),
    },
  });

  const handleSave = () => {
    if (!entryId) return;
    updateMutation.mutate({ slug, id: entryId, data: { answer: draft } });
  };

  const isEmpty = !value.trim();

  return (
    <div className={`rounded-lg border p-3 bg-card ${isEmpty ? "border-dashed border-muted-foreground/30" : ""}`}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</p>
      {editing ? (
        <div className="space-y-2">
          <Textarea
            className="text-sm resize-none"
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <div className="flex gap-1.5 justify-end">
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => { setEditing(false); setDraft(value); }}>
              <X className="h-3 w-3 mr-1" /> Cancel
            </Button>
            <Button size="sm" className="h-6 text-xs px-2 gap-1" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 group">
          <p className={`text-sm flex-1 leading-relaxed ${isEmpty ? "text-muted-foreground italic" : ""}`}>
            {isEmpty ? "No data found — add a KB entry for this" : value}
          </p>
          {entryId && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
              onClick={() => { setDraft(value); setEditing(true); }}
              title="Edit"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
      {factKey !== "business_name" && (
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          {entryId ? (
            <>
              <span className="text-[10px] text-muted-foreground">KB #{entryId}</span>
              {source && (
                <span className={`text-[10px] font-medium px-1 py-0 rounded ${SOURCE_COLORS[source] ?? "bg-muted text-muted-foreground"}`}>
                  {source}
                </span>
              )}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-blue-500 hover:underline truncate max-w-[220px]"
                  title={sourceUrl}
                >
                  {(() => { try { return new URL(sourceUrl).pathname || sourceUrl; } catch { return sourceUrl; } })()}
                </a>
              )}
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground">Not found in knowledge base</span>
          )}
        </div>
      )}
    </div>
  );
}

function EntryRow({
  entry,
  slug,
  onChanged,
}: {
  entry: KnowledgeEntry & { approvalStatus: string };
  slug: string;
  onChanged: () => void;
}) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.answer);

  const updateMutation = useUpdateKnowledgeEntry({
    mutation: {
      onSuccess: () => { setEditing(false); onChanged(); toast({ title: "Saved" }); },
      onError: () => toast({ title: "Save failed", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteKnowledgeEntry({
    mutation: {
      onSuccess: () => { onChanged(); toast({ title: "Deleted" }); },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    },
  });

  const approveMutation = useUpdateKnowledgeEntry({
    mutation: {
      onSuccess: () => onChanged(),
      onError: () => toast({ title: "Update failed", variant: "destructive" }),
    },
  });

  const isPending = entry.approvalStatus === "pending";
  const isRejected = entry.approvalStatus === "rejected";

  return (
    <div className={`border rounded-lg bg-card overflow-hidden ${isRejected ? "opacity-50" : ""}`}>
      <div
        className="flex items-start gap-2 p-3 cursor-pointer hover:bg-muted/30 select-none"
        onClick={() => !editing && setExpanded((v) => !v)}
      >
        <div className="mt-0.5 text-muted-foreground shrink-0">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug truncate">{entry.question}</p>
          {!expanded && <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.answer}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${LANG_COLORS[entry.language] ?? "bg-muted text-muted-foreground"}`}>
            {entry.language.toUpperCase()}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${SOURCE_COLORS[entry.source] ?? "bg-muted text-muted-foreground"}`}>
            {entry.source}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${STATUS_COLORS[entry.approvalStatus] ?? "bg-muted text-muted-foreground"}`}>
            {entry.approvalStatus}
          </span>
          {isPending && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              title="Approve"
              onClick={() => approveMutation.mutate({ slug, id: entry.id, data: { approvalStatus: "approved" } })}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3 w-3" />}
            </Button>
          )}
          {!isRejected && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              title="Edit"
              onClick={() => { setDraft(entry.answer); setEditing(true); setExpanded(true); }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete"
            onClick={() => { if (confirm("Delete this entry?")) deleteMutation.mutate({ slug, id: entry.id }); }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-8 pb-3 pt-0">
          {editing ? (
            <div className="space-y-2">
              <Textarea
                className="text-xs resize-none"
                rows={4}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
              <div className="flex gap-1.5 justify-end">
                <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setEditing(false)}>
                  <X className="h-3 w-3 mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-6 text-xs px-2 gap-1"
                  onClick={() => updateMutation.mutate({ slug, id: entry.id, data: { answer: draft } })}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.answer}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function KnowledgeReviewPanel({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const qk = ["knowledge-review", slug];

  const { data, isLoading } = useGetKnowledgeReview<{
    criticalFacts: Array<{ key: string; label: string; value: string; entryId: number | null; sourceUrl: string | null; source: string | null }>;
    groups: Array<{ category: string; entries: Array<KnowledgeEntry & { approvalStatus: string }> }>;
    pendingCount: number;
    approvedCount: number;
  }>(slug, {
    query: {
      queryKey: qk,
      select: (d) => d as never,
    },
  });

  const [criticalOpen, setCriticalOpen] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const approveMutation = useApproveKnowledgeEntries({
    mutation: {
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: qk });
        toast({ title: "All pending entries approved", description: `${result.updated} entries updated` });
      },
      onError: () => toast({ title: "Approve failed", variant: "destructive" }),
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: qk });

  const toggleGroup = (cat: string) =>
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const pendingCount = data?.pendingCount ?? 0;
  const approvedCount = data?.approvedCount ?? 0;
  const totalCount = pendingCount + approvedCount + (data?.groups.flatMap((g) => g.entries).filter((e) => e.approvalStatus === "rejected").length ?? 0);

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg">
              Knowledge Review — <span className="font-mono text-primary">{slug}</span>
            </DialogTitle>
            <div className="flex gap-2 ml-auto">
              {pendingCount > 0 && (
                <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-700 font-semibold">
                  {pendingCount} pending
                </Badge>
              )}
              {pendingCount === 0 && !isLoading && (
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold">
                  <CheckCheck className="h-3 w-3 mr-1" /> All approved
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription className="mt-1">
            {totalCount} entries total — {approvedCount} approved, {pendingCount} pending review. Confirm the facts your AI will use before going live.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 space-y-4">

            {/* Critical Facts */}
            <div className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
                onClick={() => setCriticalOpen((v) => !v)}
              >
                <div className="flex items-center gap-2">
                  {criticalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="font-semibold text-sm">Critical Facts</span>
                  <span className="text-xs text-muted-foreground">Key information your AI must get right</span>
                </div>
                <Badge variant="secondary" className="text-xs">Required</Badge>
              </button>

              {criticalOpen && (
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(data?.criticalFacts ?? []).map((fact) => (
                        <CriticalFactCard
                          key={fact.key}
                          factKey={fact.key}
                          label={fact.label}
                          value={fact.value}
                          entryId={fact.entryId}
                          sourceUrl={fact.sourceUrl}
                          source={fact.source}
                          slug={slug}
                          onSaved={refresh}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detailed Knowledge */}
            <div className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
                onClick={() => setDetailOpen((v) => !v)}
              >
                <div className="flex items-center gap-2">
                  {detailOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="font-semibold text-sm">Detailed Knowledge</span>
                  <span className="text-xs text-muted-foreground">All Q&amp;A entries by category</span>
                </div>
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </button>

              {detailOpen && (
                <div className="p-4 space-y-3">
                  {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : (data?.groups ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No knowledge entries yet</p>
                  ) : (
                    (data?.groups ?? []).map((group) => {
                      const collapsed = collapsedGroups.has(group.category);
                      const groupPending = group.entries.filter((e) => e.approvalStatus === "pending").length;
                      return (
                        <div key={group.category} className="border rounded-lg overflow-hidden">
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2.5 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                            onClick={() => toggleGroup(group.category)}
                          >
                            {collapsed ? <ChevronRight className="h-3.5 w-3.5 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0" />}
                            <span className="text-sm font-semibold capitalize">{group.category}</span>
                            <span className="text-xs text-muted-foreground">{group.entries.length} entries</span>
                            {groupPending > 0 && (
                              <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                {groupPending} pending
                              </span>
                            )}
                          </button>
                          {!collapsed && (
                            <div className="p-2 space-y-1.5">
                              {group.entries.map((entry) => (
                                <EntryRow
                                  key={entry.id}
                                  entry={entry}
                                  slug={slug}
                                  onChanged={refresh}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between bg-muted/20 shrink-0">
          <div className="text-sm text-muted-foreground">
            {pendingCount > 0
              ? `${pendingCount} entr${pendingCount === 1 ? "y" : "ies"} waiting for approval`
              : "All entries are approved"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            {pendingCount > 0 && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => approveMutation.mutate({ slug, data: { approveAll: true } })}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
                Approve All Pending
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
