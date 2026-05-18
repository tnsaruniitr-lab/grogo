import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListKnowledgeEntries,
  useCreateKnowledgeEntry,
  useUpdateKnowledgeEntry,
  useDeleteKnowledgeEntry,
} from "@workspace/api-client-react";
import type { KnowledgeEntry, KnowledgeCategory, KnowledgeLanguage } from "@workspace/api-client-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANG_LABELS: Record<string, string> = { en: "EN", de: "DE", tr: "TR" };
const LANG_COLORS: Record<string, string> = {
  en: "bg-blue-100 text-blue-700",
  de: "bg-green-100 text-green-700",
  tr: "bg-red-100 text-red-700",
};

export function KnowledgeDialog({ slug, onClose }: { slug: string; onClose: () => void }) {
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ category: "", question: "", answer: "", language: "" });

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

  const updateMutation = useUpdateKnowledgeEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: qk });
        setEditingId(null);
        toast({ title: "Entry saved", description: "Embedding regenerated automatically" });
      },
      onError: () => toast({ title: "Save failed", variant: "destructive" }),
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
        toast({ title: "Entry added", description: "Embedding generated automatically" });
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
      data: { category: cat as KnowledgeCategory, question: form.question.trim(), answer: form.answer.trim(), language: form.language as KnowledgeLanguage, priority: 0 },
    });
  };

  const startEdit = (entry: KnowledgeEntry) => {
    setEditingId(entry.id);
    setEditForm({ category: entry.category, question: entry.question, answer: entry.answer, language: entry.language });
    setExpandedIds((prev) => { const next = new Set(prev); next.add(entry.id); return next; });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      toast({ title: "Question and answer are required", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ slug, id: editingId, data: { ...editForm, category: editForm.category as KnowledgeCategory, language: editForm.language as KnowledgeLanguage } });
  };

  const toggleExpand = (id: number) => {
    if (editingId === id) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Knowledge Base — <span className="font-mono text-primary">{slug}</span>
          </DialogTitle>
          <DialogDescription>
            {entries.length} entries across {allCategories.length} categories. These Q&amp;A pairs are used by the AI bot to answer questions.
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
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2 min-w-0">
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
                    const isEditing = editingId === entry.id;
                    return (
                      <div key={entry.id} className="border rounded-lg bg-card overflow-hidden min-w-0 w-full">
                        {/* Header row */}
                        <div
                          className={`flex items-start gap-2 p-3 select-none ${!isEditing ? "cursor-pointer hover:bg-muted/30" : ""}`}
                          onClick={() => !isEditing && toggleExpand(entry.id)}
                        >
                          <div className="mt-0.5 text-muted-foreground shrink-0">
                            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <Input
                                className="h-7 text-sm font-medium"
                                value={editForm.question}
                                onChange={(e) => setEditForm((p) => ({ ...p, question: e.target.value }))}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="text-sm font-medium leading-snug truncate">{entry.question}</p>
                                {!expanded && <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.answer}</p>}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {!isEditing && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${LANG_COLORS[entry.language] ?? "bg-muted text-muted-foreground"}`}>
                                {LANG_LABELS[entry.language] ?? entry.language.toUpperCase()}
                              </span>
                            )}
                            {!isEditing && entry.source === "manual" && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">manual</span>
                            )}
                            {isEditing ? (
                              <>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => setEditingId(null)} title="Cancel">
                                  <X className="h-3 w-3" />
                                </Button>
                                <Button size="sm" className="h-6 px-2 text-xs gap-1" onClick={handleUpdate} disabled={updateMutation.isPending} title="Save">
                                  {updateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => startEdit(entry)} title="Edit">
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete this entry?")) deleteMutation.mutate({ slug, id: entry.id }); }} title="Delete">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Expanded / edit body */}
                        {expanded && (
                          <div className="px-9 pb-3 pt-0 space-y-2">
                            {isEditing ? (
                              <>
                                <Textarea
                                  className="text-xs resize-none"
                                  rows={4}
                                  value={editForm.answer}
                                  onChange={(e) => setEditForm((p) => ({ ...p, answer: e.target.value }))}
                                  placeholder="Answer…"
                                />
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <Label className="text-xs mb-1 block">Category</Label>
                                    <Input
                                      className="h-7 text-xs"
                                      value={editForm.category}
                                      onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs mb-1 block">Language</Label>
                                    <Select value={editForm.language} onValueChange={(v) => setEditForm((p) => ({ ...p, language: v }))}>
                                      <SelectTrigger className="h-7 text-xs w-24">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="en" className="text-xs">English</SelectItem>
                                        <SelectItem value="de" className="text-xs">German</SelectItem>
                                        <SelectItem value="tr" className="text-xs">Turkish</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">{entry.answer}</p>
                                {entry.sourceUrl && (
                                  <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1.5 flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" /> {entry.sourceUrl}
                                  </a>
                                )}
                              </>
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
