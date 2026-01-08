import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building, Users, CheckCircle, XCircle, Clock, Eye, 
  FileText, Image, MapPin, Calendar, AlertTriangle,
  TrendingUp, Home, UserCheck, Wrench, LayoutDashboard
} from "lucide-react";
import { UserManagementWithDB } from "@/components/admin/UserManagementWithDB";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

import { toast } from "sonner";

interface VerificationReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  ownerName: string;
  ownerPhone: string;
  agentName: string;
  agentId: string;
  submittedAt: Date;
  status: "pending_review" | "approved" | "rejected";
  checklist: {
    item: string;
    verified: boolean;
  }[];
  livePhotos: string[];
  agentNotes: string;
  ownerImages: string[];
  rentAmount: number;
  propertyType: string;
}

const mockVerificationReports: VerificationReport[] = [
  {
    id: "vr1",
    propertyId: "p1",
    propertyTitle: "2 BHK in Koramangala",
    propertyAddress: "123 Main St, Koramangala, Bangalore",
    ownerName: "Rajesh Kumar",
    ownerPhone: "+91 98765 43210",
    agentName: "Amit Sharma",
    agentId: "a1",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "pending_review",
    checklist: [
      { item: "Address matches listing", verified: true },
      { item: "Ownership documents verified", verified: true },
      { item: "Property condition matches photos", verified: true },
      { item: "Amenities as listed", verified: true },
      { item: "No unauthorized subletting", verified: true },
    ],
    livePhotos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    agentNotes: "Property is well-maintained. Owner was cooperative. All documents verified. Recommended for approval.",
    ownerImages: ["/placeholder.svg", "/placeholder.svg"],
    rentAmount: 25000,
    propertyType: "2 BHK",
  },
  {
    id: "vr2",
    propertyId: "p2",
    propertyTitle: "1 BHK Studio in HSR Layout",
    propertyAddress: "45 Sector 2, HSR Layout, Bangalore",
    ownerName: "Priya Patel",
    ownerPhone: "+91 87654 32109",
    agentName: "Vikram Singh",
    agentId: "a2",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "pending_review",
    checklist: [
      { item: "Address matches listing", verified: true },
      { item: "Ownership documents verified", verified: false },
      { item: "Property condition matches photos", verified: true },
      { item: "Amenities as listed", verified: false },
      { item: "No unauthorized subletting", verified: true },
    ],
    livePhotos: ["/placeholder.svg", "/placeholder.svg"],
    agentNotes: "Some amenities missing (AC not working). Ownership docs need clarification - tenant subletting situation.",
    ownerImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    rentAmount: 15000,
    propertyType: "1 BHK",
  },
  {
    id: "vr3",
    propertyId: "p3",
    propertyTitle: "3 BHK Villa in Whitefield",
    propertyAddress: "Villa 12, Palm Meadows, Whitefield",
    ownerName: "Suresh Reddy",
    ownerPhone: "+91 76543 21098",
    agentName: "Amit Sharma",
    agentId: "a1",
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "approved",
    checklist: [
      { item: "Address matches listing", verified: true },
      { item: "Ownership documents verified", verified: true },
      { item: "Property condition matches photos", verified: true },
      { item: "Amenities as listed", verified: true },
      { item: "No unauthorized subletting", verified: true },
    ],
    livePhotos: ["/placeholder.svg"],
    agentNotes: "Excellent property. All checks passed.",
    ownerImages: ["/placeholder.svg"],
    rentAmount: 45000,
    propertyType: "3 BHK Villa",
  },
];

const stats = [
  { label: "Total Properties", value: "156", icon: Building, color: "bg-primary/10 text-primary" },
  { label: "Pending Review", value: "12", icon: Clock, color: "bg-warning/10 text-warning" },
  { label: "Verified Today", value: "8", icon: CheckCircle, color: "bg-success/10 text-success" },
  { label: "Active Agents", value: "24", icon: UserCheck, color: "bg-accent/10 text-accent" },
];

const systemStats = [
  { label: "Active Tenants", value: "1,234", icon: Users },
  { label: "Property Owners", value: "456", icon: Home },
  { label: "Maintenance Jobs", value: "89", icon: Wrench },
  { label: "Monthly Revenue", value: "₹12.5L", icon: TrendingUp },
];

export default function AdminDashboard() {
  const [reports, setReports] = useState<VerificationReport[]>(mockVerificationReports);
  const [selectedReport, setSelectedReport] = useState<VerificationReport | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  

  const pendingReports = reports.filter(r => r.status === "pending_review");
  const approvedReports = reports.filter(r => r.status === "approved");
  const rejectedReports = reports.filter(r => r.status === "rejected");

  const handleApprove = () => {
    if (!selectedReport) return;
    
    setReports(prev => prev.map(r => 
      r.id === selectedReport.id ? { ...r, status: "approved" as const } : r
    ));
    
    // Note: Notifications are now created via database triggers
    toast.success("Property approved and now visible to tenants!");
    setReviewDialogOpen(false);
    setSelectedReport(null);
    setAdminNotes("");
  };

  const handleReject = () => {
    if (!selectedReport || !adminNotes.trim()) {
      toast.error("Please provide rejection reason");
      return;
    }
    
    setReports(prev => prev.map(r => 
      r.id === selectedReport.id ? { ...r, status: "rejected" as const } : r
    ));
    
    // Note: Notifications are now created via database triggers
    toast.success("Property rejected. Owner will be notified.");
    setReviewDialogOpen(false);
    setSelectedReport(null);
    setAdminNotes("");
  };

  const openReview = (report: VerificationReport) => {
    setSelectedReport(report);
    setReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pending Review</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage verifications, users, and system operations</p>
          </div>
          <NotificationCenter />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* System Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {systemStats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/50">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs for Dashboard Sections */}
        <Tabs defaultValue="verifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="verifications" className="gap-2">
              <FileText className="w-4 h-4" />
              Verifications
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Property Verification Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Pending ({pendingReports.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved ({approvedReports.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejected ({rejectedReports.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No pending verifications</p>
                  </div>
                ) : (
                  pendingReports.map((report) => (
                    <VerificationCard key={report.id} report={report} onReview={openReview} formatTimeAgo={formatTimeAgo} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedReports.map((report) => (
                  <VerificationCard key={report.id} report={report} onReview={openReview} formatTimeAgo={formatTimeAgo} />
                ))}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <XCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No rejected properties</p>
                  </div>
                ) : (
                  rejectedReports.map((report) => (
                    <VerificationCard key={report.id} report={report} onReview={openReview} formatTimeAgo={formatTimeAgo} />
                  ))
                )}
              </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <UserManagementWithDB />
          </TabsContent>
        </Tabs>
      </main>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Review: {selectedReport.propertyTitle}
                </DialogTitle>
                <DialogDescription>
                  Agent verification report submitted by {selectedReport.agentName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Property Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{selectedReport.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rent Amount</p>
                    <p className="font-medium">₹{selectedReport.rentAmount.toLocaleString()}/mo</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedReport.propertyAddress}
                    </p>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-2">Owner Details</p>
                  <p className="text-sm">{selectedReport.ownerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.ownerPhone}</p>
                </div>

                {/* Verification Checklist */}
                <div>
                  <p className="text-sm font-medium mb-3">Verification Checklist</p>
                  <div className="space-y-2">
                    {selectedReport.checklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {item.verified ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        )}
                        <span className={item.verified ? "text-foreground" : "text-warning"}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images Comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      Owner Uploaded ({selectedReport.ownerImages.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedReport.ownerImages.map((img, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Image className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      Agent Live Photos ({selectedReport.livePhotos.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedReport.livePhotos.map((img, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Image className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Agent Notes */}
                <div>
                  <p className="text-sm font-medium mb-2">Agent Notes</p>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    {selectedReport.agentNotes}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedReport.status === "pending_review" && (
                  <div>
                    <p className="text-sm font-medium mb-2">Admin Notes (required for rejection)</p>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes or rejection reason..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {selectedReport.status === "pending_review" && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReject}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button onClick={handleApprove}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

// Verification Card Component
function VerificationCard({ 
  report, 
  onReview, 
  formatTimeAgo 
}: { 
  report: VerificationReport; 
  onReview: (report: VerificationReport) => void;
  formatTimeAgo: (date: Date) => string;
}) {
  const passedChecks = report.checklist.filter(c => c.verified).length;
  const totalChecks = report.checklist.length;
  const allPassed = passedChecks === totalChecks;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{report.propertyTitle}</h4>
            {report.status === "pending_review" && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
                Pending Review
              </Badge>
            )}
            {report.status === "approved" && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                Approved
              </Badge>
            )}
            {report.status === "rejected" && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                Rejected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {report.propertyAddress}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Agent: {report.agentName}</span>
            <span>•</span>
            <span>{formatTimeAgo(report.submittedAt)}</span>
            <span>•</span>
            <span className={allPassed ? "text-success" : "text-warning"}>
              {passedChecks}/{totalChecks} checks passed
            </span>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => onReview(report)}>
          <Eye className="w-4 h-4 mr-1" />
          Review
        </Button>
      </div>
    </motion.div>
  );
}
