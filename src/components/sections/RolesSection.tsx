import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Building2, Briefcase, Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: Home,
    title: "For Tenants",
    description: "Find your dream home, pay rent digitally, order daily services, and enjoy cashback rewards.",
    features: ["Verified Properties", "Digital Rent Payments", "Instant Cashback", "Daily Services"],
    cta: "Find a Home",
    href: "/properties",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Building2,
    title: "For Owners",
    description: "List your property, get verified tenants, receive guaranteed rent, and manage hassle-free.",
    features: ["Free Listing", "Verified Tenants", "Guaranteed Payouts", "Maintenance Handled"],
    cta: "List Property",
    href: "/owner/add-property",
    gradient: "from-accent to-accent/70",
  },
  {
    icon: Briefcase,
    title: "For Agents",
    description: "Access quality leads, conduct verified visits, earn commissions, and grow your business.",
    features: ["Quality Leads", "Field Verification", "Commission Tracking", "Performance Incentives"],
    cta: "Join as Agent",
    href: "/select-role?role=agent",
    gradient: "from-success to-success/70",
  },
  {
    icon: Truck,
    title: "For Vendors",
    description: "Receive daily orders, deliver services, earn consistently, and build your reputation.",
    features: ["Daily Orders", "Route Optimization", "Weekly Payouts", "Rating System"],
    cta: "Become a Vendor",
    href: "/select-role?role=vendor",
    gradient: "from-warning to-warning/60",
  },
];

export const RolesSection = () => {
  const navigate = useNavigate();

  const handleRoleClick = (href: string) => {
    navigate(href);
  };

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Built for Everyone
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            One Ecosystem,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Multiple Roles
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're renting, owning, serving, or earning - RentPe has a place for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative m-[2px] bg-card rounded-[14px] p-6 md:p-8">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-5 shadow-md`}>
                  <role.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                <h3 className="font-display text-2xl font-semibold text-card-foreground mb-3">
                  {role.title}
                </h3>
                <p className="text-muted-foreground mb-5">
                  {role.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {role.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="group/btn gap-2"
                  onClick={() => handleRoleClick(role.href)}
                >
                  {role.cta}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
