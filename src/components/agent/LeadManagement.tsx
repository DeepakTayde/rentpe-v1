import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Phone, Mail, MapPin, Calendar, Clock, CheckCircle,
  XCircle, MessageSquare, Eye, ChevronRight, Building, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useOwnerLeads, type OwnerLead, type LeadStatus } from "@/hooks/useOwnerLeads";
import { Loader2 } from "lucide-react";

export function LeadManagement() {
  const { leads, isLoading, stats, updateLeadStatus, addAgentNotes } = useOwnerLeads();
  const [selectedLead, setSelectedLead] = useState<OwnerLead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [visitDate, setVisitDate] = useState<Date>();
  const [agentNotes, setAgentNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const getStatusBadge = (status: LeadStatus) => {
    const styles: Record<LeadStatus, string> = {
      new: "bg-primary/10 text-primary border-primary/30",
      contacted: "bg-accent/10 text-accent border-accent/30",
      visit_scheduled: "bg-warning/10 text-warning border-warning/30",
      visit_completed: "bg-info/10 text-info border-info/30",
      onboarded: "bg-success/10 text-success border-success/30",
      rejected: "bg-destructive/10 text-destructive border-destructive/30",
      lost: "bg-muted text-muted-foreground border-muted",
    };
    const labels: Record<LeadStatus, string> = {
      new: "New",
      contacted: "Contacted",
      visit_scheduled: "Visit Scheduled",
      visit_completed: "Visit Done",
      onboarded: "Onboarded",
      rejected: "Rejected",
      lost: "Lost",
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
  };

  const openLeadDetails = (lead: OwnerLead) => {
    setSelectedLead(lead);
    setAgentNotes(lead.agent_notes || "");
    setDetailsOpen(true);
  };

  const handleScheduleVisit = async () => {
    if (!selectedLead || !visitDate) return;
    await updateLeadStatus(selectedLead.id, "visit_scheduled", {
      visit_scheduled_at: visitDate.toISOString(),
    });
    setScheduleOpen(false);
    setVisitDate(undefined);
    setDetailsOpen(false);
  };

  const handleMarkContacted = async () => {
    if (!selectedLead) return;
    await updateLeadStatus(selectedLead.id, "contacted");
    setDetailsOpen(false);
  };

  const handleVisitComplete = async () => {
    if (!selectedLead) return;
    await updateLeadStatus(selectedLead.id, "visit_completed");
    setDetailsOpen(false);
  };

  const handleOnboard = async () => {
    if (!selectedLead) return;
    await updateLeadStatus(selectedLead.id, "onboarded");
    setDetailsOpen(false);
  };

  const handleReject = async () => {
    if (!selectedLead || !rejectionReason) return;
    await updateLeadStatus(selectedLead.id, "rejected", {
      rejection_reason: rejectionReason,
    });
    setRejectionReason("");
    setDetailsOpen(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    await addAgentNotes(selectedLead.id, agentNotes);
  };

  const filterLeads = (status?: LeadStatus | LeadStatus[]) => {
    if (!status) return leads;
    if (Array.isArray(status)) {
      return leads.filter(l => status.includes(l.status));
    }
    return leads.filter(l => l.status === status);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="New Leads" value={stats.new} icon={Users} color="text-primary" />
        <StatCard label="Visit Scheduled" value={stats.visitScheduled} icon={Calendar} color="text-warning" />
        <StatCard label="Onboarded" value={stats.onboarded} icon={CheckCircle} color="text-success" />
        <StatCard label="Total Leads" value={stats.total} icon={Building} color="text-accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Owner Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="gap-2">
                <Clock className="w-4 h-4" />
                Active ({stats.new + stats.contacted + stats.visitScheduled + stats.visitCompleted})
              </TabsTrigger>
              <TabsTrigger value="onboarded" className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Onboarded ({stats.onboarded})
              </TabsTrigger>
              <TabsTrigger value="closed" className="gap-2">
                <XCircle className="w-4 h-4" />
                Closed ({stats.rejected + stats.lost})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-3">
              {filterLeads(["new", "contacted", "visit_scheduled", "visit_completed"]).length === 0 ? (
                <EmptyState message="No active leads" />
              ) : (
                filterLeads(["new", "contacted", "visit_scheduled", "visit_completed"]).map(lead => (
                  <LeadCard key={lead.id} lead={lead} onView={openLeadDetails} getStatusBadge={getStatusBadge} />
                ))
              )}
            </TabsContent>

            <TabsContent value="onboarded" className="space-y-3">
              {filterLeads("onboarded").length === 0 ? (
                <EmptyState message="No onboarded leads yet" />
              ) : (
                filterLeads("onboarded").map(lead => (
                  <LeadCard key={lead.id} lead={lead} onView={openLeadDetails} getStatusBadge={getStatusBadge} />
                ))
              )}
            </TabsContent>

            <TabsContent value="closed" className="space-y-3">
              {filterLeads(["rejected", "lost"]).length === 0 ? (
                <EmptyState message="No closed leads" />
              ) : (
                filterLeads(["rejected", "lost"]).map(lead => (
                  <LeadCard key={lead.id} lead={lead} onView={openLeadDetails} getStatusBadge={getStatusBadge} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lead Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Lead Details
                </DialogTitle>
                <DialogDescription>
                  {selectedLead.property_locality}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Owner Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Owner Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {selectedLead.owner_name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedLead.owner_phone}`} className="text-accent hover:underline">
                        {selectedLead.owner_phone}
                      </a>
                    </p>
                    {selectedLead.owner_email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${selectedLead.owner_email}`} className="text-accent hover:underline">
                          {selectedLead.owner_email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Property Details</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {selectedLead.property_address}
                    </p>
                    <div className="flex gap-4">
                      <span>Type: <strong>{selectedLead.property_type?.toUpperCase() || "N/A"}</strong></span>
                      <span>Bedrooms: <strong>{selectedLead.bedrooms || "N/A"}</strong></span>
                    </div>
                    {selectedLead.expected_rent && (
                      <p>Expected Rent: <strong>₹{selectedLead.expected_rent.toLocaleString()}/mo</strong></p>
                    )}
                  </div>
                </div>

                {/* Status & Timeline */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(selectedLead.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selectedLead.created_at)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">Contact Attempts</p>
                    <p className="font-medium">{selectedLead.contact_attempts}</p>
                  </div>
                  {selectedLead.visit_scheduled_at && (
                    <div className="p-3 rounded-lg bg-muted/50 col-span-2">
                      <p className="text-muted-foreground">Visit Scheduled</p>
                      <p className="font-medium">{formatDate(selectedLead.visit_scheduled_at)}</p>
                    </div>
                  )}
                </div>

                {/* Agent Notes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Agent Notes</label>
                  <Textarea
                    value={agentNotes}
                    onChange={(e) => setAgentNotes(e.target.value)}
                    placeholder="Add notes about this lead..."
                    rows={3}
                  />
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleSaveNotes}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Save Notes
                  </Button>
                </div>

                {/* Rejection Reason (if applicable) */}
                {["new", "contacted", "visit_scheduled", "visit_completed"].includes(selectedLead.status) && (
                  <div>
                    <label className="text-sm font-medium mb-2 block text-destructive">Rejection Reason (if rejecting)</label>
                    <Input
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reason for rejection..."
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                {selectedLead.status === "new" && (
                  <Button onClick={handleMarkContacted}>
                    <Phone className="w-4 h-4 mr-2" />
                    Mark Contacted
                  </Button>
                )}
                {selectedLead.status === "contacted" && (
                  <Button onClick={() => setScheduleOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Visit
                  </Button>
                )}
                {selectedLead.status === "visit_scheduled" && (
                  <Button onClick={handleVisitComplete}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Visit Complete
                  </Button>
                )}
                {selectedLead.status === "visit_completed" && (
                  <Button onClick={handleOnboard} className="bg-success hover:bg-success/90">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Onboard Owner
                  </Button>
                )}
                {["new", "contacted", "visit_scheduled", "visit_completed"].includes(selectedLead.status) && (
                  <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Visit Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Property Visit</DialogTitle>
            <DialogDescription>
              Select a date and time for the property visit
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !visitDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {visitDate ? format(visitDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={visitDate}
                  onSelect={setVisitDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleVisit} disabled={!visitDate}>
              Schedule Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-muted", color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p>{message}</p>
    </div>
  );
}

interface LeadCardProps {
  lead: OwnerLead;
  onView: (lead: OwnerLead) => void;
  getStatusBadge: (status: LeadStatus) => React.ReactNode;
}

function LeadCard({ lead, onView, getStatusBadge }: LeadCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-muted/30 border border-border hover:border-accent/30 transition-colors cursor-pointer"
      onClick={() => onView(lead)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{lead.owner_name}</h4>
            {getStatusBadge(lead.status)}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {lead.property_locality}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Phone className="w-3 h-3" />
              {lead.owner_phone}
            </span>
            {lead.expected_rent && (
              <span className="text-accent font-medium">
                ₹{lead.expected_rent.toLocaleString()}/mo
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </motion.div>
  );
}
