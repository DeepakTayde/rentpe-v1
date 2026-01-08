import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { MaintenanceTicketModal } from "@/components/maintenance/MaintenanceTicketModal";
import { 
  Home, Search, CreditCard, Wallet, Wrench, 
  ShoppingBag, ChevronRight, MapPin, LogOut
} from "lucide-react";
import { properties, dailyServices } from "@/data/mockData";

export default function TenantDashboard() {
  const { profile, wallet, signOut } = useAuth();
  const navigate = useNavigate();
  const totalWallet = wallet.cashback + wallet.referral + wallet.ownerDiscount;
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const quickActions = [
    { icon: Search, label: "Find Home", href: "/properties", color: "bg-accent" },
    { icon: CreditCard, label: "Pay Rent", href: "/tenant/pay-rent", color: "bg-success" },
    { icon: Wrench, label: "Maintenance", action: () => setShowMaintenanceModal(true), color: "bg-warning" },
    { icon: ShoppingBag, label: "Services", href: "/services", color: "bg-primary" },
  ];

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
            <NotificationCenter />
            <Link to="/profile" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold hover:ring-2 hover:ring-accent/50 transition-all">
              {profile?.full_name?.[0] || "U"}
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
            Hello, {profile?.full_name || "User"}! 👋
          </h1>
          <p className="text-muted-foreground">Welcome back to your smart living dashboard</p>
        </motion.div>

        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/tenant/wallet">
            <Card className="gradient-primary p-6 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">RentPe Wallet</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
              <p className="text-3xl font-display font-bold mb-4">₹{totalWallet.toLocaleString()}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-primary-foreground/70">Cashback</p>
                  <p className="font-semibold">₹{wallet.cashback}</p>
                </div>
                <div>
                  <p className="text-primary-foreground/70">Referral</p>
                  <p className="font-semibold">₹{wallet.referral}</p>
                </div>
                <div>
                  <p className="text-primary-foreground/70">Discount</p>
                  <p className="font-semibold">₹{wallet.ownerDiscount}</p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              action.href ? (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
                </Link>
              ) : (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
                </button>
              )
            ))}
          </div>
        </motion.div>

        {/* Current Booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">My Home</h2>
          </div>
          <Card className="p-4">
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300"
                alt="Current home"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">2BHK in Bandra West</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  Hill Road, Bandra West, Mumbai
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Monthly Rent</p>
                    <p className="font-semibold text-foreground">₹45,000</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-semibold text-warning">5th Jan</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" size="sm" asChild>
                <Link to="/tenant/agreement">View Agreement</Link>
              </Button>
              <Button className="flex-1" size="sm" asChild>
                <Link to="/tenant/pay-rent">Pay Rent</Link>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Daily Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Daily Services</h2>
            <Link to="/services" className="text-sm text-accent font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {dailyServices.slice(0, 6).map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-accent transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs font-medium text-foreground text-center">{service.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recommended Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Explore Properties</h2>
            <Link to="/properties" className="text-sm text-accent font-medium">View All</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {properties.slice(0, 2).map((property) => (
              <Link key={property.id} to={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.locality}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold text-accent">
                        ₹{property.rentAmount.toLocaleString()}/mo
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {property.propertyType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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
        </motion.div>
      </main>

      {/* Maintenance Ticket Modal */}
      <MaintenanceTicketModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        onComplete={() => setShowMaintenanceModal(false)}
        propertyTitle="2BHK in Bandra West"
      />
    </div>
  );
}
