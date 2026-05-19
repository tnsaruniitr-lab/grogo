import { useEffect, useState } from "react";
import { useParams } from "wouter";
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
} from "@workspace/api-client-react";
import type { LeadDetail } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { de, tr, enUS, arSA } from "date-fns/locale";
import {
  Users, User, Calendar, MessageSquare, ChevronRight, X, Bot, FileText, PhoneCall, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const REFETCH_INTERVAL = 10000;

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

function DemoDashboardContent({ branding }: { branding: BrandingConfig }) {
  const clientId = branding.clientId;
  const primary = branding.primaryColor ?? "#A8C334";
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
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

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <DemoNav branding={branding} />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col h-[calc(100vh-56px)] overflow-y-auto w-full">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: branding.secondaryColor ?? "#1a3a1a" }}>
                  {branding.companyName} — {t.nav.dashboard}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-2 font-medium">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: primary }} />
                    <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: primary }} />
                  </span>
                  {t.liveUpdate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title={t.stats.totalLeads} value={stats?.totalLeads} loading={statsLoading} icon={<Users className="h-6 w-6" />} primary={primary} />
              <StatCard title={t.stats.newLeads} value={stats?.newLeads} loading={statsLoading} icon={<PhoneCall className="h-6 w-6" />} primary={primary} highlight />
              <StatCard title={t.stats.callbacks} value={stats?.callbackBooked} loading={statsLoading} icon={<Calendar className="h-6 w-6" />} primary={primary} />
              <StatCard title={t.stats.bookedToday} value={stats?.bookedToday} loading={statsLoading} icon={<MessageSquare className="h-6 w-6" />} primary={primary} />
            </div>

            <Card className="border shadow-sm overflow-hidden rounded-xl">
              <CardHeader className="border-b bg-card pb-4">
                <CardTitle className="text-lg font-bold">{t.leads}</CardTitle>
              </CardHeader>
              <div className="bg-card">
                {leadsLoading ? (
                  <div className="p-8 flex flex-col gap-4">
                    {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">{t.table.contact}</th>
                          <th className="px-6 py-4">{t.table.language}</th>
                          <th className="px-6 py-4">{t.table.status}</th>
                          <th className="px-6 py-4">{t.table.source}</th>
                          <th className="px-6 py-4">{t.table.lastActivity}</th>
                          <th className="px-6 py-4 text-right">{t.table.details}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-t">
                        {leadsPage?.data.map((lead) => (
                          <tr
                            key={lead.id}
                            className={cn(
                              "hover:bg-muted/50 transition-colors cursor-pointer group",
                              selectedLeadId === lead.id && "bg-primary/5"
                            )}
                            onClick={() => setSelectedLeadId(lead.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-base" style={{ color: branding.secondaryColor ?? "#1a3a1a" }}>
                                {lead.name || t.detail.unknownContact}
                              </div>
                              <div className="text-muted-foreground font-medium mt-1">{maskPhone(lead.phone)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-2xl">{getLanguageFlag(lead.language)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={lead.status} labels={t.statusLabels} />
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="font-semibold text-xs bg-white">{lead.source}</Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-medium text-xs">
                              {lead.lastContactAt
                                ? formatDistanceToNow(new Date(lead.lastContactAt), { addSuffix: true, locale: dateLocale })
                                : t.table.never}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" style={{ color: primary }}>
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {(!leadsPage?.data || leadsPage.data.length === 0) && (
                          <tr>
                            <td colSpan={6} className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Users className="h-12 w-12 opacity-20 mb-4" />
                                <span className="text-lg font-medium">{t.noLeads.title}</span>
                                <p className="text-sm mt-2 max-w-xs">{t.noLeads.desc}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
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

          {appointments.length > 0 && (
            <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: primaryColor + "15", borderColor: primaryColor + "40", borderWidth: 1 }}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: primaryColor }}>
                <Calendar className="h-4 w-4" /> {t.detail.callbackPlanned}
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
  loading: boolean;
  icon?: React.ReactNode;
  primary: string;
  highlight?: boolean;
}

function StatCard({ title, value, loading, icon, primary, highlight }: StatCardProps) {
  return (
    <Card className="bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow"
      style={highlight ? { borderColor: primary + "80" } : {}}>
      <CardContent className="p-5 flex flex-col gap-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className="flex items-end justify-between mt-1">
          {loading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <span className="text-3xl font-extrabold tracking-tight" style={{ color: "#1a3a1a" }}>{value ?? 0}</span>
          )}
          {icon && <div style={{ color: primary + "50" }}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status, labels }: { status: string; labels: Record<string, string> }) {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    qualified: "bg-indigo-100 text-indigo-800 border-indigo-200",
    callback_booked: "bg-green-100 text-green-800 border-green-300",
    escalated: "bg-red-100 text-red-800 border-red-200",
    needs_human: "bg-orange-100 text-orange-800 border-orange-200",
    converted: "bg-emerald-100 text-emerald-800 border-emerald-300",
    archived: "bg-slate-200 text-slate-800 border-slate-300",
  };
  const color = colors[status] ?? "bg-gray-100 text-gray-800";
  const label = labels[status] ?? status;
  return (
    <span className={cn("px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold border", color)}>
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
