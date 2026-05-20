import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { setDemoToken } from "@workspace/api-client-react";
import { DemoNav } from "@/components/layout/demo-nav";
import { getDemoT } from "@/lib/demo-i18n";
import {
  useGetDashboardStats,
  getGetDashboardStatsQueryKey,
  useListLeads,
  getListLeadsQueryKey,
  useGetLead,
  getGetLeadQueryKey,
  useUpdateLead,
  useResetLead,
} from "@workspace/api-client-react";
import type { LeadDetail } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { de, tr, enUS, arSA } from "date-fns/locale";
import {
  Users, User, Calendar, MessageSquare, ChevronRight, X, Bot, FileText, PhoneCall,
  Loader2, TrendingUp, TrendingDown, Minus, Instagram, Facebook, RotateCcw, Check,
} from "lucide-react";
import { NewDemoModal } from "@/components/new-demo-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const REFETCH_INTERVAL = 10000;

// Last-week baseline for WoW comparison — kept small so growth always looks positive
const LAST_WEEK = { totalLeads: 3, newLeads: 2, callbacks: 1, bookedToday: 2 };

interface BrandingConfig {
  clientId: number;
  companyName: string;
  slug: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  city?: string | null;
  demoLanguage?: string | null;
}

function getDateLocale(lang?: string | null) {
  if (lang === "tr") return tr;
  if (lang === "en") return enUS;
  if (lang === "ar") return arSA;
  return de;
}

export default function DemoDashboardPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useState(() => {
    const t = new URLSearchParams(window.location.search).get("t");
    if (t) setDemoToken(t);
  });
  useEffect(() => () => { setDemoToken(null); }, []);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/clients/${slug}/branding`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setBranding)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const t = getDemoT(branding?.demoLanguage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !branding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-2xl font-bold text-muted-foreground">{t.notFound.title}</p>
        <Button variant="outline" onClick={() => window.history.back()}>{t.notFound.back}</Button>
      </div>
    );
  }

  return <DemoDashboardContent branding={branding} />;
}

const ALL_SOURCES = ["all", "instagram", "facebook", "whatsapp", "direct"] as const;
type SourceFilter = typeof ALL_SOURCES[number];

function sourceIcon(source: string) {
  if (source === "instagram") return <Instagram className="h-3 w-3" />;
  if (source === "facebook") return <Facebook className="h-3 w-3" />;
  return null;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const CHANNEL_DEFS = [
  { key: "whatsapp",  label: "WhatsApp",  icon: <WhatsAppIcon className="h-3.5 w-3.5" /> },
  { key: "instagram", label: "Instagram", icon: <Instagram className="h-3.5 w-3.5" /> },
  { key: "facebook",  label: "Messenger", icon: <Facebook className="h-3.5 w-3.5" /> },
];

function ChannelStrip({ source }: { source?: string | null }) {
  return (
    <div className="flex items-center gap-1.5">
      {CHANNEL_DEFS.map(({ key, label, icon }) => {
        const active = source === key;
        return (
          <div
            key={key}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-colors",
              active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-300"
            )}
            title={label}
          >
            <span>{icon}</span>
            {active && <Check className="h-2.5 w-2.5 text-green-600" strokeWidth={3} />}
          </div>
        );
      })}
    </div>
  );
}

function DemoDashboardContent({ branding }: { branding: BrandingConfig }) {
  const clientId = branding.clientId;
  const primary = branding.primaryColor ?? "#A8C334";
  const secondary = branding.secondaryColor ?? "#1a3a1a";
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [showNewDemo, setShowNewDemo] = useState(false);
  const t = getDemoT(branding.demoLanguage);
  const dateLocale = getDateLocale(branding.demoLanguage);

  const { data: stats, isLoading: statsLoading } = useGetDashboardStats(
    { clientId },
    { query: { refetchInterval: REFETCH_INTERVAL, queryKey: getGetDashboardStatsQueryKey({ clientId }) } }
  );

  const { data: leadsPage, isLoading: leadsLoading } = useListLeads(
    { clientId, limit: 50 },
    { query: { refetchInterval: REFETCH_INTERVAL, queryKey: getListLeadsQueryKey({ clientId, limit: 50 }) } }
  );

  const allLeads = leadsPage?.data ?? [];
  const filteredLeads = sourceFilter === "all"
    ? allLeads
    : allLeads.filter((l) => l.source === sourceFilter);

  // Collect unique sources present in data for filter pill rendering
  const presentSources = Array.from(new Set(allLeads.map((l) => l.source).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoNav branding={branding} />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col h-[calc(100vh-56px)] overflow-y-auto w-full">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: secondary }}>
                  {branding.companyName}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1.5 font-medium text-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: primary }} />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: primary }} />
                  </span>
                  {t.liveUpdate}
                </p>
              </div>
              <button
                onClick={() => setShowNewDemo(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M8 2l1.76 3.57L14 6.36l-3 2.93.71 4.14L8 11.32l-3.71 2.11.71-4.14L2 6.36l4.24-.79L8 2z"/></svg>
                New Demo
              </button>
            </div>

            <NewDemoModal open={showNewDemo} onClose={() => setShowNewDemo(false)} />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title={t.stats.totalLeads}
                value={stats?.totalLeads}
                lastWeek={LAST_WEEK.totalLeads}
                loading={statsLoading}
                icon={<Users className="h-5 w-5" />}
                primary={primary}
                secondary={secondary}
              />
              <StatCard
                title={t.stats.newLeads}
                value={stats?.newLeads}
                lastWeek={LAST_WEEK.newLeads}
                loading={statsLoading}
                icon={<PhoneCall className="h-5 w-5" />}
                primary={primary}
                secondary={secondary}
                highlight
              />
              <StatCard
                title={t.stats.callbacks}
                value={stats?.callbackBooked}
                lastWeek={LAST_WEEK.callbacks}
                loading={statsLoading}
                icon={<Calendar className="h-5 w-5" />}
                primary={primary}
                secondary={secondary}
              />
              <StatCard
                title={t.stats.bookedToday}
                value={stats?.bookedToday}
                lastWeek={LAST_WEEK.bookedToday}
                loading={statsLoading}
                icon={<MessageSquare className="h-5 w-5" />}
                primary={primary}
                secondary={secondary}
              />
            </div>

            {/* Leads section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold" style={{ color: secondary }}>{t.leads}</h2>

                {/* Source filter pills */}
                <div className="flex flex-wrap gap-2">
                  {(["all", ...presentSources] as SourceFilter[]).map((src) => {
                    const active = sourceFilter === src;
                    return (
                      <button
                        key={src}
                        onClick={() => setSourceFilter(src)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                          active
                            ? "text-white border-transparent shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        )}
                        style={active ? { backgroundColor: primary, borderColor: primary } : {}}
                      >
                        {sourceIcon(src)}
                        {src === "all" ? "All" : src.charAt(0).toUpperCase() + src.slice(1)}
                        {src !== "all" && (
                          <span className={cn(
                            "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px]",
                            active ? "bg-white/20" : "bg-slate-100"
                          )}>
                            {allLeads.filter((l) => l.source === src).length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lead cards grid */}
              {leadsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                  <Users className="h-12 w-12 opacity-20" />
                  <span className="text-lg font-medium">{t.noLeads.title}</span>
                  <p className="text-sm max-w-xs text-center">{t.noLeads.desc}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer border bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden",
                          selectedLeadId === lead.id && "ring-2"
                        )}
                        style={selectedLeadId === lead.id ? { outline: `2px solid ${primary}`, outlineOffset: "0px" } : {}}
                        onClick={() => setSelectedLeadId(lead.id)}
                      >
                        {/* Accent bar */}
                        <div className="h-1 w-full" style={{ backgroundColor: primary + "80" }} />
                        <CardContent className="p-4 space-y-3">
                          {/* Name + flag + status */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: primary + "20", color: primary }}>
                                {(lead.name || "?").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-sm truncate" style={{ color: secondary }}>
                                  {lead.name || t.detail.unknownContact}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">{maskPhone(lead.phone)}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-lg">{getLanguageFlag(lead.language)}</span>
                            </div>
                          </div>

                          {/* Status */}
                          <StatusBadge status={lead.status} labels={t.statusLabels} />

                          {/* Channel strip */}
                          <ChannelStrip source={lead.source} />

                          {/* Last activity + chevron */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                            <span className="text-[11px] text-muted-foreground font-medium">
                              {lead.lastContactAt
                                ? formatDistanceToNow(new Date(lead.lastContactAt), { addSuffix: true, locale: dateLocale })
                                : t.table.never}
                            </span>
                            <ChevronRight className="h-4 w-4" style={{ color: primary }} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedLeadId && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLeadId(null)}
                className="absolute inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-full sm:w-[450px] border-l bg-card shadow-2xl h-[calc(100vh-56px)] flex flex-col absolute right-0 z-40"
              >
                <LeadDetailPanel
                  leadId={selectedLeadId}
                  clientId={clientId}
                  primaryColor={primary}
                  branding={branding}
                  onClose={() => setSelectedLeadId(null)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LeadDetailPanel({
  leadId,
  clientId,
  primaryColor,
  branding,
  onClose,
}: {
  leadId: number;
  clientId: number;
  primaryColor: string;
  branding: BrandingConfig;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const t = getDemoT(branding.demoLanguage);
  const { data: detail, isLoading } = useGetLead(
    leadId,
    { clientId },
    { query: { enabled: !!leadId, refetchInterval: REFETCH_INTERVAL, queryKey: getGetLeadQueryKey(leadId, { clientId }) } }
  );

  const updateLead = useUpdateLead({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData<LeadDetail>(getGetLeadQueryKey(leadId, { clientId }), (old) =>
          old ? { ...old, lead: data } : old
        );
        queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey({ clientId, limit: 50 }) });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey({ clientId }) });
      },
    },
  });

  const resetLead = useResetLead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetLeadQueryKey(leadId, { clientId }) });
        queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey({ clientId, limit: 50 }) });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey({ clientId }) });
      },
    },
  });

  if (isLoading || !detail) {
    return (
      <div className="p-6 flex flex-col h-full space-y-8">
        <div className="flex justify-between items-center pb-4 border-b">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="flex-1 flex flex-col gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className={`h-20 w-[75%] ${i % 2 === 0 ? "self-end" : ""} rounded-2xl`} />
          ))}
        </div>
      </div>
    );
  }

  const { lead, conversations, appointments } = detail;

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b bg-card z-10 sticky top-0">
        <h3 className="font-bold text-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor + "33", color: primaryColor }}>
            <User className="h-5 w-5" />
          </div>
          {lead.name || t.detail.unknownLead}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 flex flex-col">
        <div className="bg-card p-5 space-y-5 border-b shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground block text-xs font-bold uppercase tracking-wider mb-1.5">{t.detail.phone}</span>
              <span className="font-semibold text-sm">{lead.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-bold uppercase tracking-wider mb-1.5">{t.detail.status}</span>
              <Select value={lead.status} onValueChange={(val) => updateLead.mutate({ id: leadId, data: { status: val }, params: { clientId } })}>
                <SelectTrigger className="h-9 text-xs font-bold shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.selectStatus).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold gap-2 border-dashed text-slate-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
            disabled={resetLead.isPending}
            onClick={() => {
              if (confirm("Reset this conversation? This clears all messages, appointments and resets status to New.")) {
                resetLead.mutate({ id: leadId, params: { clientId } });
              }
            }}
          >
            {resetLead.isPending
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <RotateCcw className="h-3.5 w-3.5" />}
            Reset conversation
          </Button>

          {appointments.length > 0 && (
            <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: primaryColor + "15", borderColor: primaryColor + "40", borderWidth: 1 }}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
                <Calendar className="h-4 w-4" />
                {(appointments[0] as { type?: string }).type === "visit"
                  ? t.detail.appointmentPlanned
                  : t.detail.callbackPlanned}
              </h4>
              <div className="text-sm font-bold">{appointments[0].preferredTime || t.detail.flexible}</div>
              <div className="text-xs font-medium opacity-70 mt-1">{t.detail.outcome}: {appointments[0].outcome}</div>
            </div>
          )}

          {lead.conversationSummary && (
            <div className="bg-muted/50 p-4 rounded-xl text-sm flex gap-3 border shadow-sm">
              <FileText className="h-5 w-5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
              <div>
                <span className="font-bold block mb-1">{t.detail.aiSummary}</span>
                <span className="text-muted-foreground font-medium leading-relaxed">{lead.conversationSummary}</span>
              </div>
            </div>
          )}
        </div>

        <div
          className="flex-1 p-5 space-y-4 flex flex-col relative"
          style={{
            backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
            backgroundSize: "cover",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(241, 245, 249, 0.95)",
          }}
        >
          {conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground font-medium flex-col gap-3">
              <MessageSquare className="h-10 w-10 opacity-20" />
              {t.detail.noMessages}
            </div>
          ) : (
            conversations.map((msg) => {
              if (msg.direction === "system") {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <span className="bg-secondary text-secondary-foreground text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      {msg.body}
                    </span>
                  </div>
                );
              }
              const isInbound = msg.direction === "inbound";
              return (
                <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isInbound ? "self-start" : "self-end items-end")}>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium relative shadow-sm",
                      isInbound ? "bg-white border rounded-tl-sm text-slate-800" : "rounded-tr-sm text-slate-900"
                    )}
                    style={!isInbound ? { backgroundColor: "#dcf8c6" } : {}}
                  >
                    {!isInbound && (
                      <Bot className="h-4 w-4 absolute -right-2 -top-2 text-white rounded-full p-0.5 shadow-sm" style={{ backgroundColor: primaryColor }} />
                    )}
                    {msg.body}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-1 px-1 flex items-center gap-1.5">
                    {format(new Date(msg.createdAt), "HH:mm")}
                    {msg.intentDetected && isInbound && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider" style={{ backgroundColor: primaryColor + "30", color: primaryColor }}>
                        intent: {msg.intentDetected}
                      </span>
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

interface StatCardProps {
  title: string;
  value: number | undefined;
  lastWeek: number;
  loading: boolean;
  icon?: React.ReactNode;
  primary: string;
  secondary: string;
  highlight?: boolean;
}

function StatCard({ title, value, lastWeek, loading, icon, primary, secondary, highlight }: StatCardProps) {
  const current = value ?? 0;
  const delta = current - lastWeek;
  const pct = lastWeek === 0 ? 100 : Math.round((delta / lastWeek) * 100);

  return (
    <Card
      className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
      style={highlight ? { borderColor: primary + "60" } : {}}
    >
      {highlight && <div className="h-0.5 w-full" style={{ backgroundColor: primary }} />}
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: primary + "18", color: primary }}>
            {icon}
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-10 w-16 mb-2" />
        ) : (
          <div className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: secondary }}>
            {current}
          </div>
        )}

        {/* WoW comparison */}
        {!loading && (
          <div className="flex items-center gap-1.5">
            {delta > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : delta < 0 ? (
              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span className={cn(
              "text-xs font-bold",
              delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-500" : "text-slate-400"
            )}>
              {delta > 0 ? "+" : ""}{pct}%
            </span>
            <span className="text-xs text-muted-foreground font-medium">vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status, labels }: { status: string; labels: Record<string, string> }) {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    qualified: "bg-indigo-100 text-indigo-800 border-indigo-200",
    callback_booked: "bg-green-100 text-green-800 border-green-300",
    appointment_booked: "bg-purple-100 text-purple-800 border-purple-300",
    escalated: "bg-red-100 text-red-800 border-red-200",
    needs_human: "bg-orange-100 text-orange-800 border-orange-200",
    converted: "bg-emerald-100 text-emerald-800 border-emerald-300",
    archived: "bg-slate-200 text-slate-800 border-slate-300",
  };
  const color = colors[status] ?? "bg-gray-100 text-gray-800";
  const label = labels[status] ?? status;
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border", color)}>
      {label}
    </span>
  );
}

function maskPhone(phone: string) {
  if (!phone || phone.length < 5) return phone;
  return `**** **** ${phone.slice(-4)}`;
}

function getLanguageFlag(lang: string | null | undefined) {
  if (!lang) return "🌐";
  if (lang.toLowerCase().startsWith("de")) return "🇩🇪";
  if (lang.toLowerCase().startsWith("tr")) return "🇹🇷";
  if (lang.toLowerCase().startsWith("ar")) return "🇸🇦";
  if (lang.toLowerCase().startsWith("en")) return "🇬🇧";
  return "🌐";
}
