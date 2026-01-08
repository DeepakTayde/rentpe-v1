import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, UserCheck, Home, Briefcase, Phone, Mail, 
  MapPin, Calendar, MoreVertical, Eye, Ban, CheckCircle,
  Search, Filter, Loader2
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
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type UserRole = Tables<"user_roles">;

interface UserWithRole extends Profile {
  role: string;
  roleData?: {
    wallet_balance?: number;
    total_earnings?: number;
    completed_verifications?: number;
    rating?: number;
    is_available?: boolean;
  };
}

export function UserManagementWithDB() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Create a map of user_id to role
      const roleMap = new Map<string, string>();
      roles?.forEach((role) => {
        roleMap.set(role.user_id, role.role);
      });

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => ({
        ...profile,
        role: roleMap.get(profile.id) || "unknown",
      }));

      // Fetch role-specific data for each user
      for (const user of usersWithRoles) {
        if (user.role === "tenant") {
          const { data } = await supabase
            .from("tenant_profiles")
            .select("wallet_balance")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data) user.roleData = { wallet_balance: data.wallet_balance || 0 };
        } else if (user.role === "owner") {
          const { data } = await supabase
            .from("owner_profiles")
            .select("total_earnings")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data) user.roleData = { total_earnings: data.total_earnings || 0 };
        } else if (user.role === "agent") {
          const { data } = await supabase
            .from("agent_profiles")
            .select("completed_verifications, rating, is_available")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data) user.roleData = {
            completed_verifications: data.completed_verifications || 0,
            rating: Number(data.rating) || 0,
            is_available: data.is_available ?? true,
          };
        }
      }

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (isVerified: boolean | null) => {
    if (isVerified) {
      return <Badge className="bg-success/10 text-success border-success/30">Verified</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">Unverified</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      tenant: "bg-primary/10 text-primary border-primary/30",
      owner: "bg-accent/10 text-accent border-accent/30",
      agent: "bg-warning/10 text-warning border-warning/30",
      vendor: "bg-success/10 text-success border-success/30",
      technician: "bg-info/10 text-info border-info/30",
      admin: "bg-destructive/10 text-destructive border-destructive/30",
    };
    return (
      <Badge className={colors[role] || "bg-muted text-muted-foreground"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  };

  const openUserDetails = (user: UserWithRole) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const filterUsers = (role?: string) => {
    let filtered = users;
    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.full_name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.phone && u.phone.includes(query))
      );
    }
    return filtered;
  };

  const tenants = filterUsers("tenant");
  const owners = filterUsers("owner");
  const agents = filterUsers("agent");
  const allUsers = filterUsers();

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
          <Button variant="outline" size="icon" onClick={fetchUsers}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="gap-2">
              <Users className="w-4 h-4" />
              All ({allUsers.length})
            </TabsTrigger>
            <TabsTrigger value="tenants" className="gap-2">
              <Users className="w-4 h-4" />
              Tenants ({tenants.length})
            </TabsTrigger>
            <TabsTrigger value="owners" className="gap-2">
              <Home className="w-4 h-4" />
              Owners ({owners.length})
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Agents ({agents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {allUsers.length === 0 ? (
              <EmptyState icon={Users} message="No users found" />
            ) : (
              allUsers.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onView={() => openUserDetails(user)}
                  getStatusBadge={getStatusBadge}
                  getRoleBadge={getRoleBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="tenants" className="space-y-3">
            {tenants.length === 0 ? (
              <EmptyState icon={Users} message="No tenants found" />
            ) : (
              tenants.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onView={() => openUserDetails(user)}
                  getStatusBadge={getStatusBadge}
                  getRoleBadge={getRoleBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="owners" className="space-y-3">
            {owners.length === 0 ? (
              <EmptyState icon={Home} message="No owners found" />
            ) : (
              owners.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onView={() => openUserDetails(user)}
                  getStatusBadge={getStatusBadge}
                  getRoleBadge={getRoleBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="agents" className="space-y-3">
            {agents.length === 0 ? (
              <EmptyState icon={Briefcase} message="No agents found" />
            ) : (
              agents.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onView={() => openUserDetails(user)}
                  getStatusBadge={getStatusBadge}
                  getRoleBadge={getRoleBadge}
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
                  <Users className="w-5 h-5" />
                  {selectedUser.full_name}
                </DialogTitle>
                <DialogDescription>
                  User Details
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
                      {selectedUser.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedUser.address || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>

                {/* Status & Role */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Role:</span>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(selectedUser.is_verified)}
                  </div>
                </div>

                {/* Role-specific info */}
                {selectedUser.roleData && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedUser.role === "tenant" && selectedUser.roleData.wallet_balance !== undefined && (
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-lg font-bold text-foreground">
                          ₹{selectedUser.roleData.wallet_balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Wallet Balance</p>
                      </div>
                    )}
                    {selectedUser.role === "owner" && selectedUser.roleData.total_earnings !== undefined && (
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-lg font-bold text-foreground">
                          ₹{selectedUser.roleData.total_earnings.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Earnings</p>
                      </div>
                    )}
                    {selectedUser.role === "agent" && (
                      <>
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <p className="text-lg font-bold text-success">
                            {selectedUser.roleData.completed_verifications || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">Verifications</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <p className="text-lg font-bold text-foreground">
                            ⭐ {selectedUser.roleData.rating || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </>
                    )}
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

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Icon className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p>{message}</p>
    </div>
  );
}

interface UserCardProps {
  user: UserWithRole;
  onView: () => void;
  getStatusBadge: (isVerified: boolean | null) => React.ReactNode;
  getRoleBadge: (role: string) => React.ReactNode;
  formatDate: (date: string) => string;
}

function UserCard({ user, onView, getStatusBadge, getRoleBadge, formatDate }: UserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-muted/30 border border-border hover:border-accent/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-semibold">
              {user.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{user.full_name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.is_verified)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(user.created_at)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
