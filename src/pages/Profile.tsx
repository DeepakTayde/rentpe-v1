import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Home, User, Phone, Mail, MapPin, Save, ArrowLeft,
  Building2, Wallet, Shield, Wrench, Truck, Users
} from "lucide-react";
import { toast } from "sonner";

interface TenantProfile {
  emergency_contact: string | null;
  wallet_balance: number;
}

interface OwnerProfile {
  bank_account_number: string | null;
  bank_ifsc: string | null;
  pan_number: string | null;
  total_earnings: number;
}

interface AgentProfile {
  assigned_areas: string[] | null;
  completed_verifications: number;
  rating: number;
  is_available: boolean;
}

interface VendorProfile {
  business_name: string | null;
  service_types: string[] | null;
  service_areas: string[] | null;
  rating: number;
  total_jobs: number;
  is_available: boolean;
}

interface TechnicianProfile {
  specializations: string[] | null;
  service_areas: string[] | null;
  rating: number;
  completed_jobs: number;
  is_available: boolean;
}

export default function Profile() {
  const { user, profile, role, refreshProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Basic profile state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Role-specific state
  const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [technicianProfile, setTechnicianProfile] = useState<TechnicianProfile | null>(null);
  
  // Role-specific form fields
  const [emergencyContact, setEmergencyContact] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [assignedAreas, setAssignedAreas] = useState("");
  const [serviceTypes, setServiceTypes] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }

    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile, user, isLoading, navigate]);

  useEffect(() => {
    if (!user || !role) return;
    
    const fetchRoleProfile = async () => {
      try {
        switch (role) {
          case "tenant":
            const { data: tenantData } = await supabase
              .from("tenant_profiles")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            if (tenantData) {
              setTenantProfile(tenantData);
              setEmergencyContact(tenantData.emergency_contact || "");
            }
            break;
          case "owner":
            const { data: ownerData } = await supabase
              .from("owner_profiles")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            if (ownerData) {
              setOwnerProfile(ownerData);
              setBankAccount(ownerData.bank_account_number || "");
              setBankIfsc(ownerData.bank_ifsc || "");
              setPanNumber(ownerData.pan_number || "");
            }
            break;
          case "agent":
            const { data: agentData } = await supabase
              .from("agent_profiles")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            if (agentData) {
              setAgentProfile(agentData);
              setAssignedAreas(agentData.assigned_areas?.join(", ") || "");
            }
            break;
          case "vendor":
            const { data: vendorData } = await supabase
              .from("vendor_profiles")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            if (vendorData) {
              setVendorProfile(vendorData);
              setBusinessName(vendorData.business_name || "");
              setServiceTypes(vendorData.service_types?.join(", ") || "");
              setServiceAreas(vendorData.service_areas?.join(", ") || "");
            }
            break;
          case "technician":
            const { data: techData } = await supabase
              .from("technician_profiles")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();
            if (techData) {
              setTechnicianProfile(techData);
              setSpecializations(techData.specializations?.join(", ") || "");
              setServiceAreas(techData.service_areas?.join(", ") || "");
            }
            break;
        }
      } catch (error) {
        console.error("Error fetching role profile:", error);
      }
    };

    fetchRoleProfile();
  }, [user, role]);

  const handleSaveBasicProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          address: address || null,
        })
        .eq("id", user.id);

      if (error) throw error;
      
      await refreshProfile();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRoleProfile = async () => {
    if (!user || !role) return;
    setIsSaving(true);

    try {
      switch (role) {
        case "tenant":
          await supabase
            .from("tenant_profiles")
            .update({ emergency_contact: emergencyContact || null })
            .eq("user_id", user.id);
          break;
        case "owner":
          await supabase
            .from("owner_profiles")
            .update({
              bank_account_number: bankAccount || null,
              bank_ifsc: bankIfsc || null,
              pan_number: panNumber || null,
            })
            .eq("user_id", user.id);
          break;
        case "agent":
          await supabase
            .from("agent_profiles")
            .update({
              assigned_areas: assignedAreas ? assignedAreas.split(",").map(s => s.trim()) : null,
            })
            .eq("user_id", user.id);
          break;
        case "vendor":
          await supabase
            .from("vendor_profiles")
            .update({
              business_name: businessName || null,
              service_types: serviceTypes ? serviceTypes.split(",").map(s => s.trim()) : null,
              service_areas: serviceAreas ? serviceAreas.split(",").map(s => s.trim()) : null,
            })
            .eq("user_id", user.id);
          break;
        case "technician":
          await supabase
            .from("technician_profiles")
            .update({
              specializations: specializations ? specializations.split(",").map(s => s.trim()) : null,
              service_areas: serviceAreas ? serviceAreas.split(",").map(s => s.trim()) : null,
            })
            .eq("user_id", user.id);
          break;
      }
      
      toast.success("Role profile updated successfully!");
    } catch (error) {
      console.error("Error updating role profile:", error);
      toast.error("Failed to update role profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "tenant": return User;
      case "owner": return Building2;
      case "agent": return Users;
      case "vendor": return Truck;
      case "technician": return Wrench;
      case "admin": return Shield;
      default: return User;
    }
  };

  const getRoleDashboardPath = () => {
    switch (role) {
      case "tenant": return "/tenant/dashboard";
      case "owner": return "/owner/dashboard";
      case "agent": return "/agent/dashboard";
      case "vendor": return "/vendor/dashboard";
      case "technician": return "/technician/dashboard";
      case "admin": return "/admin/dashboard";
      default: return "/";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const RoleIcon = getRoleIcon();

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
          <Button variant="ghost" size="sm" asChild>
            <Link to={getRoleDashboardPath()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <RoleIcon className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {profile?.full_name || "User"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {role}
                </Badge>
                {profile?.is_verified && (
                  <Badge className="bg-success/10 text-success border-success/30">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
              <TabsTrigger value="role" className="flex-1">
                {role === "tenant" && "Tenant Details"}
                {role === "owner" && "Bank & Tax"}
                {role === "agent" && "Agent Details"}
                {role === "vendor" && "Business Details"}
                {role === "technician" && "Skills & Areas"}
                {role === "admin" && "Admin Settings"}
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full address"
                        className="pl-10 min-h-[80px]"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveBasicProfile} 
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Role-Specific Tab */}
            <TabsContent value="role">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RoleIcon className="w-5 h-5" />
                    {role === "tenant" && "Tenant Details"}
                    {role === "owner" && "Bank & Tax Details"}
                    {role === "agent" && "Agent Details"}
                    {role === "vendor" && "Business Details"}
                    {role === "technician" && "Skills & Service Areas"}
                    {role === "admin" && "Admin Settings"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tenant Fields */}
                  {role === "tenant" && (
                    <>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-accent" />
                            <span className="font-medium">Wallet Balance</span>
                          </div>
                          <span className="text-xl font-bold">₹{tenantProfile?.wallet_balance || 0}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                          placeholder="Emergency contact number"
                        />
                      </div>
                    </>
                  )}

                  {/* Owner Fields */}
                  {role === "owner" && (
                    <>
                      <div className="p-4 rounded-lg bg-success/10">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-success">Total Earnings</span>
                          <span className="text-xl font-bold text-success">₹{ownerProfile?.total_earnings?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Bank Account Number</Label>
                        <Input
                          id="bankAccount"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          placeholder="Enter bank account number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankIfsc">IFSC Code</Label>
                        <Input
                          id="bankIfsc"
                          value={bankIfsc}
                          onChange={(e) => setBankIfsc(e.target.value)}
                          placeholder="Enter IFSC code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <Input
                          id="panNumber"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                          placeholder="Enter PAN number"
                          maxLength={10}
                        />
                      </div>
                    </>
                  )}

                  {/* Agent Fields */}
                  {role === "agent" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold">{agentProfile?.completed_verifications || 0}</p>
                          <p className="text-sm text-muted-foreground">Verifications</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold">⭐ {agentProfile?.rating || 0}</p>
                          <p className="text-sm text-muted-foreground">Rating</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedAreas">Assigned Areas</Label>
                        <Textarea
                          id="assignedAreas"
                          value={assignedAreas}
                          onChange={(e) => setAssignedAreas(e.target.value)}
                          placeholder="Koramangala, HSR Layout, Indiranagar (comma-separated)"
                        />
                        <p className="text-xs text-muted-foreground">Enter areas separated by commas</p>
                      </div>
                    </>
                  )}

                  {/* Vendor Fields */}
                  {role === "vendor" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold">{vendorProfile?.total_jobs || 0}</p>
                          <p className="text-sm text-muted-foreground">Total Jobs</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold">⭐ {vendorProfile?.rating || 0}</p>
                          <p className="text-sm text-muted-foreground">Rating</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Your business name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceTypes">Service Types</Label>
                        <Textarea
                          id="serviceTypes"
                          value={serviceTypes}
                          onChange={(e) => setServiceTypes(e.target.value)}
                          placeholder="Laundry, Tiffin, Cleaning (comma-separated)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendorServiceAreas">Service Areas</Label>
                        <Textarea
                          id="vendorServiceAreas"
                          value={serviceAreas}
                          onChange={(e) => setServiceAreas(e.target.value)}
                          placeholder="Koramangala, HSR Layout (comma-separated)"
                        />
                      </div>
                    </>
                  )}

                  {/* Technician Fields */}
                  {role === "technician" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold">{technicianProfile?.completed_jobs || 0}</p>
                          <p className="text-sm text-muted-foreground">Jobs Done</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold">⭐ {technicianProfile?.rating || 0}</p>
                          <p className="text-sm text-muted-foreground">Rating</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specializations">Specializations</Label>
                        <Textarea
                          id="specializations"
                          value={specializations}
                          onChange={(e) => setSpecializations(e.target.value)}
                          placeholder="Plumbing, Electrical, AC Repair (comma-separated)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="techServiceAreas">Service Areas</Label>
                        <Textarea
                          id="techServiceAreas"
                          value={serviceAreas}
                          onChange={(e) => setServiceAreas(e.target.value)}
                          placeholder="Koramangala, HSR Layout (comma-separated)"
                        />
                      </div>
                    </>
                  )}

                  {/* Admin - No editable fields */}
                  {role === "admin" && (
                    <div className="p-4 rounded-lg bg-primary/10 text-center">
                      <Shield className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <p className="font-medium text-foreground">Administrator Account</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You have full access to the admin dashboard
                      </p>
                    </div>
                  )}

                  {role !== "admin" && (
                    <Button 
                      onClick={handleSaveRoleProfile} 
                      disabled={isSaving}
                      className="w-full"
                    >
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Role Details
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
