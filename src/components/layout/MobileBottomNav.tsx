import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Search, 
  Wrench, 
  ShoppingBag, 
  Wallet, 
  User 
} from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user, role } = useAuth();

  // Define navigation items based on authentication and role
  const getNavItems = () => {
    const baseItems = [
      { 
        icon: Home, 
        label: "Home", 
        href: "/",
        id: "home"
      },
      { 
        icon: Search, 
        label: "Find Home", 
        href: "/properties",
        id: "properties"
      },
      { 
        icon: Wrench, 
        label: "Services", 
        href: "/services",
        id: "services"
      },
      { 
        icon: ShoppingBag, 
        label: "Market", 
        href: "/marketplace",
        id: "marketplace"
      },
      { 
        icon: Wallet, 
        label: "Wallet", 
        href: "/wallet",
        id: "wallet"
      }
    ];

    // Add profile/dashboard as 6th item if authenticated
    if (user) {
      const dashboardRoutes = {
        tenant: "/tenant/dashboard",
        owner: "/owner/dashboard", 
        agent: "/agent/dashboard",
        vendor: "/vendor/dashboard",
        technician: "/technician/dashboard",
        admin: "/admin/dashboard"
      };

      baseItems.push({
        icon: User,
        label: role === "tenant" ? "Dashboard" : role === "owner" ? "Dashboard" : role === "agent" ? "Dashboard" : role === "vendor" ? "Dashboard" : role === "technician" ? "Dashboard" : role === "admin" ? "Dashboard" : "Profile",
        href: dashboardRoutes[role as keyof typeof dashboardRoutes] || "/profile",
        id: "profile"
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const isActive = (href: string, id: string) => {
    if (id === "home") {
      return location.pathname === "/";
    }
    if (id === "properties") {
      return location.pathname.startsWith("/properties");
    }
    if (id === "services") {
      return location.pathname.startsWith("/services") || location.pathname.startsWith("/home-services");
    }
    if (id === "marketplace") {
      return location.pathname.startsWith("/marketplace") || location.pathname.startsWith("/e-market");
    }
    if (id === "wallet") {
      return location.pathname.startsWith("/wallet");
    }
    if (id === "profile") {
      return location.pathname.startsWith("/profile") || 
             location.pathname.includes("/dashboard") ||
             location.pathname.startsWith("/tenant") ||
             location.pathname.startsWith("/owner") ||
             location.pathname.startsWith("/agent") ||
             location.pathname.startsWith("/vendor") ||
             location.pathname.startsWith("/technician") ||
             location.pathname.startsWith("/admin");
    }
    return location.pathname === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg lg:hidden">
      {/* Safe area padding for iOS/Android */}
      <div className="pb-safe">
        <div className="flex items-center justify-around px-2 py-3 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.id);
            
            return (
              <Link
                key={item.id}
                to={item.href}
                className="relative flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-1 touch-manipulation rounded-lg"
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Icon */}
                <div className="relative z-10 mb-1">
                  <Icon 
                    className={`w-5 h-5 transition-colors duration-200 ${
                      active ? "text-accent" : "text-muted-foreground"
                    }`} 
                  />
                </div>
                
                {/* Label */}
                <span 
                  className={`text-xs font-medium transition-colors duration-200 leading-tight text-center ${
                    active ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;