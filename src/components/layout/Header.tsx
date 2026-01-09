import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LogOut, User, RefreshCw, ShoppingBag } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { NotificationHub } from "@/components/notifications/NotificationHub";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Find Home", href: "/properties" },
  { name: "Home Services", href: "/home-services", highlight: true },
  { name: "Marketplace", href: "/marketplace", highlight: true },
  { name: "Maintenance", href: "/maintenance" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const allRoles: { id: UserRole; label: string }[] = [
  { id: "tenant", label: "Tenant" },
  { id: "owner", label: "Owner" },
  { id: "agent", label: "Agent" },
  { id: "vendor", label: "Vendor" },
  { id: "technician", label: "Technician" },
  { id: "admin", label: "Admin" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut, profile } = useAuth();
  
  // Check if current page is landing page
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSwitchRole = async (newRole: UserRole) => {
    if (!user || !newRole || newRole === role) return;
    
    setIsSwitchingRole(true);
    try {
      // Import supabase client for direct DB update (for testing only)
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Update the role in the database
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", user.id);
      
      if (error) {
        toast.error("Failed to switch role: " + error.message);
        return;
      }
      
      toast.success(`Switched to ${newRole} role. Refreshing...`);
      
      // Force page reload to refresh auth context
      window.location.reload();
    } catch (error) {
      toast.error("Failed to switch role");
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const navigateToDashboard = () => {
    switch (role) {
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

  // Determine if header should be transparent (only on landing page and not scrolled)
  const isTransparent = isLandingPage && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent py-5"
          : "bg-card/95 backdrop-blur-lg shadow-md py-3"
      } ${
        // Mobile-only: Enhanced shadow on scroll
        isScrolled && !isTransparent ? "lg:shadow-md shadow-lg" : ""
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className={`font-display text-2xl font-bold transition-colors ${
            isTransparent ? "text-primary-foreground" : "text-primary"
          }`}>
            Rent<span className="text-accent">Pe</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all hover:bg-accent/10 ${
                isTransparent
                  ? location.pathname === link.href
                    ? "text-accent"
                    : "text-primary-foreground/90 hover:text-accent"
                  : location.pathname === link.href
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {/* E-Market Button */}
          <Link to="/e-market">
            <Button variant="hero" size="sm" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              E-Market
            </Button>
          </Link>
          
          {/* Notification Hub */}
          {user && <NotificationHub />}
          
          <Link to="/wallet">
            <Button variant={isTransparent ? "hero-outline" : "outline"} size="sm">
              Wallet
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={isTransparent ? "hero-outline" : "outline"} size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {profile?.full_name || "Account"}
                  {role && <span className="text-xs bg-accent/20 px-1.5 py-0.5 rounded capitalize">{role}</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToDashboard}>
                  <Home className="w-4 h-4 mr-2" />
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3" />
                  Switch Role (Testing)
                </DropdownMenuLabel>
                {allRoles.map((r) => (
                  <DropdownMenuItem 
                    key={r.id} 
                    onClick={() => handleSwitchRole(r.id)}
                    disabled={isSwitchingRole || role === r.id}
                    className={role === r.id ? "bg-accent/10" : ""}
                  >
                    {r.label}
                    {role === r.id && <span className="ml-auto text-xs text-accent">Current</span>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant={isTransparent ? "hero-outline" : "ghost"} size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-3 rounded-lg transition-colors touch-manipulation ${
            isTransparent ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-muted"
          }`}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-4 rounded-lg font-medium transition-colors touch-manipulation ${
                    location.pathname === link.href
                      ? "bg-accent/10 text-accent"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Link to="/e-market">
                  <Button variant="hero" className="w-full gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    E-Market
                  </Button>
                </Link>
                <Link to="/wallet">
                  <Button variant="outline" className="w-full">
                    Wallet
                  </Button>
                </Link>
                {user ? (
                  <>
                    <Button variant="outline" className="w-full" onClick={navigateToDashboard}>
                      My Dashboard ({role})
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/auth" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth" className="flex-1">
                      <Button variant="hero" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};