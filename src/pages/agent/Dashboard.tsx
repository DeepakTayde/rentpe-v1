import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { PropertyVerificationFlow } from "@/components/verification/PropertyVerificationFlow";
import { LeadManagement } from "@/components/agent/LeadManagement";
import { CommissionDashboard } from "@/components/agent/CommissionDashboard";
import { AgentOnboardingModal } from "@/components/agent/AgentOnboardingModal";
import { useAgentNotifications, useOwnerLeads } from "@/hooks/useOwnerLeads";
import { useAgentCommissions } from "@/hooks/useAgentCommissions";
import { toast } from "sonner";
import { 
  Home, Building2, Calendar, CheckCircle, Clock, MapPin,
  Star, LogOut, Users, Bell, FileCheck, IndianRupee, Sparkles
} from "lucide-react";
import { properties } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const baseStats = [
  { label: "Assigned Properties", value: "12", icon: Building2, color: "bg-accent" },
  { label: "Visits Today", value: "3", icon: Calendar, color: "bg-warning" },
  { label: "Completed", value: "45", icon: CheckCircle, color: "bg-success" },
];

const todayVisits = [
  { id: "1", property: "2BHK in Bandra West", time: "10:00 AM", tenant: "Amit Kumar", status: "confirmed" },
  { id: "2", property: "1BHK in Andheri", time: "2:00 PM", tenant: "Priya Singh", status: "confirmed" },
  { id: "3", property: "3BHK in Powai", time: "5:00 PM", tenant: "Rahul Verma", status: "pending" },
];

const pendingVerifications = properties.slice(0, 2).map((p) => ({
  ...p,
  submittedDate: "Jan 15, 2024",
}));

export default function AgentDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { notifications: contextNotifications } = useNotificationContext();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAgentNotifications();
  const { summary: commissionSummary } = useAgentCommissions();
  const { leads, updateLeadStatus } = useOwnerLeads();
  const [verifyingProperty, setVerifyingProperty] = useState<typeof pendingVerifications[0] | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [onboardingLead, setOnboardingLead] = useState<typeof leads[0] | null>(null);

  const stats = [
    ...baseStats,
    { 
      label: "Total Earnings", 
      value: `₹${(commissionSummary.totalEarnings / 1000).toFixed(1)}K`, 
      icon: IndianRupee, 
      color: "bg-primary" 
    },
  ];

  const handleVerificationComplete = (approved: boolean, _data: unknown) => {
    toast.success(`Property ${approved ? "approved" : "rejected"} successfully!`);
    setVerifyingProperty(null);
  };

  const handleOnboardingComplete = async (data: unknown) => {
    if (onboardingLead) {
      await updateLeadStatus(onboardingLead.id, "onboarded");
      toast.success("Owner onboarded! Commission pending approval.");
    }
    setOnboardingLead(null);
  };

  // Get leads that are ready for onboarding
  const onboardableLeads = leads.filter(l => l.status === "visit_completed");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Rent<span className="text-accent">Pe</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Agent Notifications */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationCenter />
            <Link to="/profile" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold hover:ring-2 hover:ring-primary/50 transition-all">
              {profile?.full_name?.[0] || "A"}
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            Agent Dashboard
          </h1>
          <p className="text-muted-foreground">Manage leads, verify properties, and schedule visits</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads" className="gap-2">
              <Users className="w-4 h-4" />
              Owner Leads
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Quick Onboard
              {onboardableLeads.length > 0 && (
                <Badge className="ml-1 bg-success text-success-foreground text-xs px-1.5">{onboardableLeads.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="commissions" className="gap-2">
              <IndianRupee className="w-4 h-4" />
              Commissions
            </TabsTrigger>
            <TabsTrigger value="visits" className="gap-2">
              <Calendar className="w-4 h-4" />
              Today's Visits
            </TabsTrigger>
            <TabsTrigger value="verifications" className="gap-2">
              <FileCheck className="w-4 h-4" />
              Verifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <LeadManagement />
          </TabsContent>

          {/* Quick Onboarding Tab */}
          <TabsContent value="onboarding">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-foreground">Ready for Onboarding</h2>
                <Badge variant="outline" className="border-success text-success">{onboardableLeads.length} Ready</Badge>
              </div>
              {onboardableLeads.length === 0 ? (
                <Card className="p-8 text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No leads ready for onboarding yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Complete property visits to unlock quick onboarding</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {onboardableLeads.map((lead) => (
                    <Card key={lead.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{lead.owner_name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.property_locality}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Expected: ₹{(lead.expected_rent || 0).toLocaleString()}/mo
                          </p>
                        </div>
                        <Button onClick={() => setOnboardingLead(lead)}>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Quick Onboard
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions">
            <CommissionDashboard />
          </TabsContent>

          {/* Today's Visits Tab */}
          <TabsContent value="visits">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-3">
                {todayVisits.map((visit) => (
                  <Card key={visit.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{visit.property}</h3>
                        <p className="text-sm text-muted-foreground">Tenant: {visit.tenant}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-accent font-semibold">
                          <Clock className="w-4 h-4" />
                          {visit.time}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          visit.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}>
                          {visit.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        Reschedule
                      </Button>
                      <Button size="sm" className="flex-1">
                        Start Visit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-foreground">Pending Verifications</h2>
                <span className="text-sm bg-warning/10 text-warning px-2 py-1 rounded-full">2 Pending</span>
              </div>
              <div className="space-y-4">
                {pendingVerifications.map((property) => (
                  <Card key={property.id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.locality}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted: {property.submittedDate}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full mt-3" size="sm" onClick={() => setVerifyingProperty(property)}>
                      Start Verification
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">Your Performance</h2>
              <div className="flex items-center gap-1 text-warning">
                <Star className="w-5 h-5 fill-warning" />
                <span className="font-bold">4.8</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verification Speed</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "90%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">90%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Visit Completion</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "95%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lead Conversion</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: "75%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">75%</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            await signOut();
            navigate("/auth");
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </main>

      {/* Verification Dialog */}
      <Dialog open={!!verifyingProperty} onOpenChange={() => setVerifyingProperty(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Property Verification</DialogTitle>
          </DialogHeader>
          {verifyingProperty && (
            <PropertyVerificationFlow
              property={{
                id: verifyingProperty.id,
                title: verifyingProperty.title,
                address: verifyingProperty.locality,
                locality: verifyingProperty.locality,
                images: verifyingProperty.images,
              }}
              onComplete={handleVerificationComplete}
              onClose={() => setVerifyingProperty(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Agent Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Lead Notifications</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No notifications yet</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    notif.is_read ? "bg-muted/30 border-border" : "bg-accent/5 border-accent/30"
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                    </div>
                    {!notif.is_read && (
                      <Badge className="bg-accent text-accent-foreground text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Agent Onboarding Modal */}
      {onboardingLead && (
        <AgentOnboardingModal
          lead={{
            id: onboardingLead.id,
            owner_name: onboardingLead.owner_name,
            owner_phone: onboardingLead.owner_phone,
            owner_email: onboardingLead.owner_email || undefined,
            property_locality: onboardingLead.property_locality,
            property_address: onboardingLead.property_address,
            property_type: onboardingLead.property_type || undefined,
            expected_rent: onboardingLead.expected_rent || undefined,
            bedrooms: onboardingLead.bedrooms || undefined,
          }}
          isOpen={!!onboardingLead}
          onClose={() => setOnboardingLead(null)}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}
