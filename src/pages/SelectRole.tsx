import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Home, User, Building2, Users, Truck, Wrench, Shield } from "lucide-react";
import { toast } from "sonner";

const roles = [
  {
    id: "tenant" as UserRole,
    title: "Tenant",
    description: "Find and rent your perfect home",
    icon: User,
    color: "bg-accent",
    features: ["Search verified properties", "Digital rent payments", "Maintenance requests"],
  },
  {
    id: "owner" as UserRole,
    title: "Property Owner",
    description: "List and manage your properties",
    icon: Building2,
    color: "bg-success",
    features: ["List properties", "Collect rent online", "Tenant management"],
  },
  {
    id: "agent" as UserRole,
    title: "Agent",
    description: "Help tenants find homes & earn commission",
    icon: Users,
    color: "bg-primary",
    features: ["Property verification", "Schedule visits", "Earn commissions"],
  },
  {
    id: "vendor" as UserRole,
    title: "Vendor",
    description: "Provide daily services to residents",
    icon: Truck,
    color: "bg-warning",
    features: ["Laundry, Tiffin, Maid services", "Get regular orders", "Weekly payouts"],
  },
  {
    id: "technician" as UserRole,
    title: "Technician",
    description: "Fix maintenance issues & earn",
    icon: Wrench,
    color: "bg-destructive",
    features: ["Plumbing, Electrical, AC repair", "Skill-based jobs", "Performance bonuses"],
  },
];

export default function SelectRole() {
  const { selectRole, user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
    // If user already has a role, redirect to their dashboard
    if (!isLoading && user && role) {
      navigateToDashboard(role);
    }
  }, [user, role, isLoading, navigate]);

  const navigateToDashboard = (userRole: string) => {
    switch (userRole) {
      case "tenant":
        navigate("/tenant/dashboard");
        break;
      case "owner":
        navigate("/owner/dashboard");
        break;
      case "agent":
        navigate("/agent/dashboard");
        break;
      case "vendor":
        navigate("/vendor/dashboard");
        break;
      case "technician":
        navigate("/technician/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleRoleSelect = async (selectedRole: UserRole) => {
    if (!selectedRole) return;

    const { error } = await selectRole(selectedRole);
    
    if (error) {
      toast.error("Failed to set role. Please try again.");
      console.error("Role selection error:", error);
      return;
    }

    toast.success(`Welcome to RentPe as ${roles.find((r) => r.id === selectedRole)?.title}!`);
    navigateToDashboard(selectedRole);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Rent<span className="text-accent">Pe</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            How do you want to use RentPe?
          </h1>
          <p className="text-muted-foreground">
            Select your role to personalize your experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((roleItem, index) => (
            <motion.button
              key={roleItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleRoleSelect(roleItem.id)}
              className="bg-card rounded-2xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all text-left group"
            >
              <div className={`w-14 h-14 rounded-xl ${roleItem.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <roleItem.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                {roleItem.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {roleItem.description}
              </p>
              <ul className="space-y-2">
                {roleItem.features.map((feature) => (
                  <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
