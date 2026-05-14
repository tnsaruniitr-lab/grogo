import { useState } from "react";
import { Nav } from "@/components/layout/nav";
import { 
  useGetDashboardStats, 
  getGetDashboardStatsQueryKey, 
  useListLeads, 
  getListLeadsQueryKey, 
  useGetLead, 
  getGetLeadQueryKey, 
  useUpdateLead 
} from "@workspace/api-client-react";
import type { LeadDetail } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Users, User, Calendar, MessageSquare, ChevronRight, X, Bot, FileText, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CLIENT_ID = 1;
const REFETCH_INTERVAL = 10000;

export default function DashboardPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  const { data: stats, isLoading: statsLoading } = useGetDashboardStats(
    { clientId: CLIENT_ID },
    { query: { refetchInterval: REFETCH_INTERVAL, queryKey: getGetDashboardStatsQueryKey({ clientId: CLIENT_ID }) } }
  );

  const { data: leadsPage, isLoading: leadsLoading } = useListLeads(
    { clientId: CLIENT_ID, limit: 50 },
    { query: { refetchInterval: REFETCH_INTERVAL, queryKey: getListLeadsQueryKey({ clientId: CLIENT_ID, limit: 50 }) } }
  );

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Nav />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-y-auto w-full">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-secondary">Bot Dashboard</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-2 font-medium">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  Live-Aktualisierung alle 10 Sek.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Gesamt-Leads" value={stats?.totalLeads} loading={statsLoading} icon={<Users className="h-6 w-6" />} />
              <StatCard title="Neu" value={stats?.newLeads} loading={statsLoading} className="border-primary/50" icon={<PhoneCall className="h-6 w-6" />} />
              <StatCard title="Ausstehende Rückrufe" value={stats?.callbackBooked} loading={statsLoading} className="border-green-500/50" icon={<Calendar className="h-6 w-6" />} />
              <StatCard title="Heute gebucht" value={stats?.bookedToday} loading={statsLoading} icon={<MessageSquare className="h-6 w-6" />} />
            </div>

            {/* Leads Table */}
            <Card className="border shadow-sm overflow-hidden rounded-xl">
              <CardHeader className="border-b bg-card pb-4">
                <CardTitle className="text-lg font-bold">Aktuelle Leads</CardTitle>
              </CardHeader>
              <div className="bg-card">
                {leadsLoading ? (
                  <div className="p-8 flex flex-col gap-4">
                    {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Kontakt</th>
                          <th className="px-6 py-4">Sprache</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Quelle</th>
                          <th className="px-6 py-4">Letzte Aktivität</th>
                          <th className="px-6 py-4 text-right">Details</th>
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
                            data-testid={`row-lead-${lead.id}`}
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-secondary text-base">{lead.name || 'Unbekannt'}</div>
                              <div className="text-muted-foreground font-medium mt-1">{maskPhone(lead.phone)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-2xl" title={lead.language || 'Unknown'}>
                                {getLanguageFlag(lead.language)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={lead.status} />
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="font-semibold text-xs bg-white">{lead.source}</Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-medium text-xs">
                              {lead.lastContactAt ? formatDistanceToNow(new Date(lead.lastContactAt), { addSuffix: true, locale: de }) : 'Nie'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 group-hover:bg-primary/20 group-hover:text-primary rounded-full" aria-label="Details anzeigen">
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
                                <span className="text-lg font-medium text-secondary">Noch keine Leads vorhanden</span>
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

        {/* Slide-over Panel */}
        <AnimatePresence>
          {selectedLeadId && (
            <>
              {/* Mobile overlay backdrop */}
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
                className="w-full sm:w-[450px] border-l bg-card shadow-2xl h-[calc(100vh-80px)] flex flex-col absolute right-0 z-40"
              >
                <LeadDetailPanel leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LeadDetailPanel({ leadId, onClose }: { leadId: number, onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: detail, isLoading } = useGetLead(
    leadId,
    { clientId: CLIENT_ID },
    { query: { enabled: !!leadId, refetchInterval: REFETCH_INTERVAL, queryKey: getGetLeadQueryKey(leadId, { clientId: CLIENT_ID }) } }
  );

  const updateLead = useUpdateLead({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData<LeadDetail>(getGetLeadQueryKey(leadId, { clientId: CLIENT_ID }), (old) =>
          old ? { ...old, lead: data } : old
        );
        queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey({ clientId: CLIENT_ID, limit: 50 }) });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey({ clientId: CLIENT_ID }) });
      }
    }
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
          {[1,2,3,4].map(i => <Skeleton key={i} className={`h-20 w-[75%] ${i%2===0 ? 'self-end' : ''} rounded-2xl`} />)}
        </div>
      </div>
    );
  }

  const { lead, conversations, appointments } = detail;

  const handleStatusChange = (newStatus: string) => {
    updateLead.mutate({
      id: leadId,
      data: { status: newStatus },
      params: { clientId: CLIENT_ID }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b bg-card z-10 sticky top-0">
        <h3 className="font-bold text-lg flex items-center gap-3 text-secondary">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
             <User className="h-5 w-5" />
          </div>
          {lead.name || 'Unbekannter Lead'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted" data-testid="button-close-panel">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 flex flex-col">
        {/* Info Header */}
        <div className="bg-card p-5 space-y-5 border-b shadow-sm z-10 relative">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground block text-xs font-bold uppercase tracking-wider mb-1.5">Telefon</span>
              <span className="font-semibold text-sm">{lead.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs font-bold uppercase tracking-wider mb-1.5">Status</span>
              <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-9 text-xs font-bold shadow-sm" data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Neu</SelectItem>
                  <SelectItem value="qualified">Qualifiziert</SelectItem>
                  <SelectItem value="callback_booked">Rückruf gebucht</SelectItem>
                  <SelectItem value="escalated">Eskaliert</SelectItem>
                  <SelectItem value="needs_human">Braucht Beratung</SelectItem>
                  <SelectItem value="converted">Gewonnen</SelectItem>
                  <SelectItem value="archived">Archiviert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {appointments.length > 0 && (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 shadow-sm">
              <h4 className="text-xs font-extrabold text-[#166534] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Rückruf geplant
              </h4>
              <div className="text-sm font-bold text-[#14532d]">
                {appointments[0].preferredTime || 'Zeitpunkt flexibel'}
              </div>
              <div className="text-xs font-medium text-[#166534]/70 mt-1">
                Ergebnis: {appointments[0].outcome}
              </div>
            </div>
          )}
          
          {lead.conversationSummary && (
            <div className="bg-muted/50 p-4 rounded-xl text-sm flex gap-3 border shadow-sm">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-secondary block mb-1">KI-Zusammenfassung</span>
                <span className="text-muted-foreground font-medium leading-relaxed">{lead.conversationSummary}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Thread */}
        <div className="flex-1 p-5 space-y-4 flex flex-col relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(241, 245, 249, 0.95)' }}>
          {conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground font-medium flex-col gap-3">
              <MessageSquare className="h-10 w-10 opacity-20" />
              Noch keine Nachrichten
            </div>
          ) : (
            conversations.map((msg) => {
              if (msg.direction === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <span className="bg-secondary text-secondary-foreground text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      {msg.body}
                    </span>
                  </div>
                );
              }

              const isInbound = msg.direction === 'inbound';
              
              return (
                <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isInbound ? "self-start" : "self-end items-end")}>
                  <div 
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium relative shadow-sm",
                      isInbound 
                        ? "bg-white border rounded-tl-sm text-slate-800" 
                        : "bg-[#dcf8c6] text-slate-900 rounded-tr-sm"
                    )}
                  >
                    {!isInbound && <Bot className="h-4 w-4 absolute -right-2 -top-2 bg-primary text-white rounded-full p-0.5 shadow-sm" />}
                    {msg.body}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-1 px-1 flex items-center gap-1.5">
                    {format(new Date(msg.createdAt), "HH:mm")}
                    {msg.intentDetected && isInbound && (
                      <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
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
  className?: string;
  icon?: React.ReactNode;
}

function StatCard({ title, value, loading, className, icon }: StatCardProps) {
  return (
    <Card className={cn("bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-5 flex flex-col gap-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className="flex items-end justify-between mt-1">
          {loading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <span className="text-3xl font-extrabold text-secondary tracking-tight">{value || 0}</span>
          )}
          {icon && <div className="text-primary/30">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string, label: string }> = {
    new: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Neu" },
    qualified: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", label: "Qualifiziert" },
    callback_booked: { color: "bg-green-100 text-green-800 border-green-300", label: "Rückruf" },
    escalated: { color: "bg-red-100 text-red-800 border-red-200", label: "Eskaliert" },
    needs_human: { color: "bg-orange-100 text-orange-800 border-orange-200", label: "Beratung" },
    converted: { color: "bg-emerald-100 text-emerald-800 border-emerald-300", label: "Gewonnen" },
    archived: { color: "bg-slate-200 text-slate-800 border-slate-300", label: "Archiviert" },
  };

  const current = config[status] || { color: "bg-gray-100 text-gray-800", label: status };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold border", current.color)}>
      {current.label}
    </span>
  );
}

function maskPhone(phone: string) {
  if (!phone || phone.length < 5) return phone;
  return `**** **** ${phone.slice(-4)}`;
}

function getLanguageFlag(lang: string | null | undefined) {
  if (!lang) return "🌐";
  if (lang.toLowerCase().startsWith('de')) return "🇩🇪";
  if (lang.toLowerCase().startsWith('tr')) return "🇹🇷";
  if (lang.toLowerCase().startsWith('ar')) return "🇸🇦";
  if (lang.toLowerCase().startsWith('en')) return "🇬🇧";
  return "🌐";
}

