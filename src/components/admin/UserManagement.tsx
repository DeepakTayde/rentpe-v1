import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, UserCheck, Home, Briefcase, Phone, Mail, 
  MapPin, Calendar, MoreVertical, Eye, Ban, CheckCircle,
  Search, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  joinedAt: Date;
  location: string;
}

interface Tenant extends User {
  currentProperty: string | null;
  rentDue: number;
  lastPayment: Date | null;
}

interface Owner extends User {
  totalProperties: number;
  verifiedProperties: number;
  totalEarnings: number;
}

interface Agent extends User {
  assignedArea: string;
  completedVerifications: number;
  pendingVerifications: number;
  rating: number;
}

const mockTenants: Tenant[] = [
  {
    id: "t1",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    phone: "+91 98765 43210",
    status: "active",
    joinedAt: new Date(2024, 2, 15),
    location: "Koramangala, Bangalore",
    currentProperty: "2 BHK in Koramangala",
    rentDue: 0,
    lastPayment: new Date(2025, 5, 1),
  },
  {
    id: "t2",
    name: "Sneha Sharma",
    email: "sneha.sharma@email.com",
    phone: "+91 87654 32109",
    status: "active",
    joinedAt: new Date(2024, 5, 20),
    location: "HSR Layout, Bangalore",
    currentProperty: "1 BHK Studio in HSR",
    rentDue: 15000,
    lastPayment: new Date(2025, 4, 5),
  },
  {
    id: "t3",
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 76543 21098",
    status: "inactive",
    joinedAt: new Date(2023, 8, 10),
    location: "Indiranagar, Bangalore",
    currentProperty: null,
    rentDue: 0,
    lastPayment: new Date(2025, 1, 1),
  },
  {
    id: "t4",
    name: "Priya Nair",
    email: "priya.nair@email.com",
    phone: "+91 65432 10987",
    status: "suspended",
    joinedAt: new Date(2024, 0, 5),
    location: "Whitefield, Bangalore",
    currentProperty: null,
    rentDue: 45000,
    lastPayment: new Date(2024, 11, 15),
  },
];

const mockOwners: Owner[] = [
  {
    id: "o1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 11111",
    status: "active",
    joinedAt: new Date(2023, 1, 10),
    location: "Koramangala, Bangalore",
    totalProperties: 5,
    verifiedProperties: 4,
    totalEarnings: 450000,
  },
  {
    id: "o2",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 87654 22222",
    status: "active",
    joinedAt: new Date(2023, 6, 15),
    location: "HSR Layout, Bangalore",
    totalProperties: 2,
    verifiedProperties: 1,
    totalEarnings: 120000,
  },
  {
    id: "o3",
    name: "Suresh Reddy",
    email: "suresh.reddy@email.com",
    phone: "+91 76543 33333",
    status: "active",
    joinedAt: new Date(2022, 11, 1),
    location: "Whitefield, Bangalore",
    totalProperties: 8,
    verifiedProperties: 8,
    totalEarnings: 890000,
  },
];

const mockAgents: Agent[] = [
  {
    id: "a1",
    name: "Amit Sharma",
    email: "amit.sharma@email.com",
    phone: "+91 98765 44444",
    status: "active",
    joinedAt: new Date(2023, 3, 1),
    location: "Koramangala, Bangalore",
    assignedArea: "Koramangala, HSR Layout",
    completedVerifications: 156,
    pendingVerifications: 3,
    rating: 4.8,
  },
  {
    id: "a2",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 87654 55555",
    status: "active",
    joinedAt: new Date(2023, 7, 15),
    location: "Whitefield, Bangalore",
    assignedArea: "Whitefield, Marathahalli",
    completedVerifications: 89,
    pendingVerifications: 5,
    rating: 4.5,
  },
  {
    id: "a3",
    name: "Deepak Menon",
    email: "deepak.menon@email.com",
    phone: "+91 76543 66666",
    status: "inactive",
    joinedAt: new Date(2024, 0, 10),
    location: "Indiranagar, Bangalore",
    assignedArea: "Indiranagar, MG Road",
    completedVerifications: 45,
    pendingVerifications: 0,
    rating: 4.2,
  },
];

export function UserManagement() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [owners] = useState<Owner[]>(mockOwners);
  const [agents] = useState<Agent[]>(mockAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Tenant | Owner | Agent | null>(null);
  const [userType, setUserType] = useState<"tenant" | "owner" | "agent">("tenant");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/30">Active</Badge>;
      case "inactive":
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Suspended</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  };

  const handleStatusChange = (userId: string, newStatus: "active" | "inactive" | "suspended") => {
    setTenants(prev => prev.map(t => 
      t.id === userId ? { ...t, status: newStatus } : t
    ));
    toast.success(`User status updated to ${newStatus}`);
  };

  const openUserDetails = (user: Tenant | Owner | Agent, type: "tenant" | "owner" | "agent") => {
    setSelectedUser(user);
    setUserType(type);
    setViewDialogOpen(true);
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.includes(searchQuery)
  );

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.phone.includes(searchQuery)
  );

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.phone.includes(searchQuery)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="tenants">
          <TabsList className="mb-4">
            <TabsTrigger value="tenants" className="gap-2">
              <Users className="w-4 h-4" />
              Tenants ({filteredTenants.length})
            </TabsTrigger>
            <TabsTrigger value="owners" className="gap-2">
              <Home className="w-4 h-4" />
              Owners ({filteredOwners.length})
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Agents ({filteredAgents.length})
            </TabsTrigger>
          </TabsList>

          {/* Tenants Tab */}
          <TabsContent value="tenants" className="space-y-3">
            {filteredTenants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No tenants found</p>
              </div>
            ) : (
              filteredTenants.map((tenant) => (
                <UserCard 
                  key={tenant.id} 
                  user={tenant} 
                  type="tenant"
                  onView={() => openUserDetails(tenant, "tenant")}
                  onStatusChange={handleStatusChange}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>

          {/* Owners Tab */}
          <TabsContent value="owners" className="space-y-3">
            {filteredOwners.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Home className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No owners found</p>
              </div>
            ) : (
              filteredOwners.map((owner) => (
                <UserCard 
                  key={owner.id} 
                  user={owner} 
                  type="owner"
                  onView={() => openUserDetails(owner, "owner")}
                  onStatusChange={handleStatusChange}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-3">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No agents found</p>
              </div>
            ) : (
              filteredAgents.map((agent) => (
                <UserCard 
                  key={agent.id} 
                  user={agent} 
                  type="agent"
                  onView={() => openUserDetails(agent, "agent")}
                  onStatusChange={handleStatusChange}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* User Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {userType === "tenant" && <Users className="w-5 h-5" />}
                  {userType === "owner" && <Home className="w-5 h-5" />}
                  {userType === "agent" && <Briefcase className="w-5 h-5" />}
                  {selectedUser.name}
                </DialogTitle>
                <DialogDescription>
                  {userType.charAt(0).toUpperCase() + userType.slice(1)} Details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedUser.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedUser.joinedAt)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(selectedUser.status)}
                </div>

                {/* Type-specific info */}
                {userType === "tenant" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Current Property</p>
                      <p className="font-medium">
                        {(selectedUser as Tenant).currentProperty || "No active rental"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Rent Due</p>
                        <p className="font-medium text-lg">
                          ₹{(selectedUser as Tenant).rentDue.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Last Payment</p>
                        <p className="font-medium">
                          {(selectedUser as Tenant).lastPayment 
                            ? formatDate((selectedUser as Tenant).lastPayment!)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {userType === "owner" && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {(selectedUser as Owner).totalProperties}
                      </p>
                      <p className="text-xs text-muted-foreground">Properties</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-success">
                        {(selectedUser as Owner).verifiedProperties}
                      </p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold text-foreground">
                        ₹{((selectedUser as Owner).totalEarnings / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">Earnings</p>
                    </div>
                  </div>
                )}

                {userType === "agent" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Assigned Area</p>
                      <p className="font-medium">{(selectedUser as Agent).assignedArea}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold text-success">
                          {(selectedUser as Agent).completedVerifications}
                        </p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold text-warning">
                          {(selectedUser as Agent).pendingVerifications}
                        </p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold text-foreground">
                          ⭐ {(selectedUser as Agent).rating}
                        </p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// User Card Component
function UserCard({ 
  user, 
  type,
  onView,
  onStatusChange,
  getStatusBadge,
  formatDate
}: { 
  user: Tenant | Owner | Agent;
  type: "tenant" | "owner" | "agent";
  onView: () => void;
  onStatusChange: (userId: string, status: "active" | "inactive" | "suspended") => void;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (date: Date) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{user.name}</h4>
            {getStatusBadge(user.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {user.phone}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {user.location}
            </span>
            <span>•</span>
            <span>Joined {formatDate(user.joinedAt)}</span>
            {type === "tenant" && (user as Tenant).currentProperty && (
              <>
                <span>•</span>
                <span className="text-primary">{(user as Tenant).currentProperty}</span>
              </>
            )}
            {type === "owner" && (
              <>
                <span>•</span>
                <span>{(user as Owner).totalProperties} properties</span>
              </>
            )}
            {type === "agent" && (
              <>
                <span>•</span>
                <span>⭐ {(user as Agent).rating}</span>
                <span>•</span>
                <span>{(user as Agent).completedVerifications} verifications</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onView}>
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange(user.id, "active")}>
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                Set Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(user.id, "inactive")}>
                <UserCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                Set Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(user.id, "suspended")}>
                <Ban className="w-4 h-4 mr-2 text-destructive" />
                Suspend User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
