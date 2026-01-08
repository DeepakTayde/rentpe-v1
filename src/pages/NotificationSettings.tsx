import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Bell, Calendar, Home, Wrench, CreditCard, Info, 
  Users, DollarSign, Building, Settings, FileText,
  Mail, Smartphone, ArrowLeft, Loader2
} from "lucide-react";

const notificationTypes = [
  { key: "visit_enabled", label: "Visits", description: "Property visit schedules and updates", icon: Calendar },
  { key: "booking_enabled", label: "Bookings", description: "Booking requests and status changes", icon: Home },
  { key: "maintenance_enabled", label: "Maintenance", description: "Maintenance requests and updates", icon: Wrench },
  { key: "payment_enabled", label: "Payments", description: "Payment confirmations and reminders", icon: CreditCard },
  { key: "property_enabled", label: "Properties", description: "Property verification and status updates", icon: Building },
  { key: "lead_enabled", label: "Leads", description: "New lead assignments and updates", icon: Users },
  { key: "commission_enabled", label: "Commissions", description: "Commission earned notifications", icon: DollarSign },
  { key: "service_enabled", label: "Services", description: "Service booking updates", icon: Settings },
  { key: "agreement_enabled", label: "Agreements", description: "Rental agreement notifications", icon: FileText },
  { key: "system_enabled", label: "System", description: "Important system announcements", icon: Info },
] as const;

export default function NotificationSettings() {
  const { user, role } = useAuth();
  const { preferences, isLoading, isSaving, updatePreference, updateAllPreferences } = useNotificationPreferences();

  // Filter notification types based on user role
  const relevantTypes = notificationTypes.filter(type => {
    if (role === "tenant") {
      return ["visit_enabled", "booking_enabled", "maintenance_enabled", "payment_enabled", "system_enabled", "agreement_enabled"].includes(type.key);
    }
    if (role === "owner") {
      return ["visit_enabled", "booking_enabled", "property_enabled", "payment_enabled", "system_enabled", "maintenance_enabled"].includes(type.key);
    }
    if (role === "agent") {
      return ["visit_enabled", "lead_enabled", "commission_enabled", "property_enabled", "system_enabled"].includes(type.key);
    }
    if (role === "vendor" || role === "technician") {
      return ["service_enabled", "maintenance_enabled", "payment_enabled", "system_enabled"].includes(type.key);
    }
    // Admin sees all
    return true;
  });

  const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
    if (!preferences) return;
    
    const { error } = await updatePreference(key as any, value);
    if (error) {
      toast.error("Failed to update preference");
    } else {
      toast.success("Preference updated");
    }
  };

  const handleEnableAll = async () => {
    const updates: Record<string, boolean> = {};
    relevantTypes.forEach(type => {
      updates[type.key] = true;
    });
    
    const { error } = await updateAllPreferences(updates);
    if (error) {
      toast.error("Failed to enable all notifications");
    } else {
      toast.success("All notifications enabled");
    }
  };

  const handleDisableAll = async () => {
    const updates: Record<string, boolean> = {};
    relevantTypes.forEach(type => {
      updates[type.key] = false;
    });
    
    const { error } = await updateAllPreferences(updates);
    if (error) {
      toast.error("Failed to disable all notifications");
    } else {
      toast.success("All notifications disabled");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to manage your notification preferences.</p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold">Notification Settings</h1>
              <p className="text-muted-foreground">Choose which notifications you want to receive</p>
            </div>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="py-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Quick Actions */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleEnableAll}
                    disabled={isSaving}
                  >
                    Enable All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDisableAll}
                    disabled={isSaving}
                  >
                    Disable All
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Types */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Types
                  </CardTitle>
                  <CardDescription>
                    Toggle which types of in-app notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relevantTypes.map((type, index) => {
                    const Icon = type.icon;
                    const isEnabled = preferences?.[type.key as keyof typeof preferences] ?? true;
                    
                    return (
                      <div key={type.key}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <Label htmlFor={type.key} className="font-medium cursor-pointer">
                                {type.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                          <Switch
                            id={type.key}
                            checked={isEnabled as boolean}
                            onCheckedChange={(checked) => handleToggle(type.key as any, checked)}
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Delivery Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Methods</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications (coming soon)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor="email_notifications" className="font-medium cursor-pointer">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={preferences?.email_notifications ?? false}
                      onCheckedChange={(checked) => handleToggle("email_notifications" as any, checked)}
                      disabled={isSaving}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor="push_notifications" className="font-medium cursor-pointer">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={preferences?.push_notifications ?? false}
                      onCheckedChange={(checked) => handleToggle("push_notifications" as any, checked)}
                      disabled={isSaving}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
