import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { 
  Home, Plus, Building2, Users, CreditCard, TrendingUp,
  ChevronRight, Eye, Clock, CheckCircle, AlertCircle, LogOut
} from "lucide-react";
import { properties } from "@/data/mockData";

const stats = [
  { label: "Total Properties", value: "5", icon: Building2, color: "bg-accent" },
  { label: "Active Tenants", value: "4", icon: Users, color: "bg-success" },
  { label: "This Month", value: "₹1.8L", icon: CreditCard, color: "bg-primary" },
  { label: "Occupancy", value: "80%", icon: TrendingUp, color: "bg-warning" },
];

const myProperties = properties.slice(0, 3).map((p, i) => ({
  ...p,
  tenantName: i === 2 ? null : `Tenant ${i + 1}`,
  rentStatus: i === 0 ? "paid" : i === 1 ? "pending" : "vacant",
  nextDue: i === 2 ? null : "5th Jan 2024",
  verificationStatus: i === 0 ? "verified" : i === 1 ? "pending" : "draft",
}));

export default function OwnerDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

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
            <Link to="/profile" className="w-9 h-9 rounded-full bg-success flex items-center justify-center text-success-foreground font-semibold hover:ring-2 hover:ring-success/50 transition-all">
              {profile?.full_name?.[0] || "O"}
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-1">
              Owner Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your properties and tenants</p>
          </div>
          <Button asChild>
            <Link to="/owner/add-property">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Rent Collection Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">This Month's Collection</h2>
              <Link to="/owner/payouts" className="text-sm text-accent font-medium">View Payouts</Link>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-3xl font-display font-bold text-foreground">₹1,80,000</p>
                <p className="text-sm text-muted-foreground">Total collected</p>
              </div>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: "80%" }} />
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">4/5</p>
                <p className="text-sm text-muted-foreground">Properties paid</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* My Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">My Properties</h2>
            <Link to="/owner/properties" className="text-sm text-accent font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {myProperties.map((property) => (
              <Card key={property.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                      <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">{property.locality}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          property.verificationStatus === "verified" 
                            ? "bg-success/10 text-success" 
                            : property.verificationStatus === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {property.verificationStatus === "verified" ? (
                            <><CheckCircle className="w-3 h-3" />Verified</>
                          ) : property.verificationStatus === "pending" ? (
                            <><Clock className="w-3 h-3" />Pending</>
                          ) : (
                            <><AlertCircle className="w-3 h-3" />Draft</>
                          )}
                        </span>
                        {property.tenantName && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            property.rentStatus === "paid" 
                              ? "bg-success/10 text-success" 
                              : "bg-warning/10 text-warning"
                          }`}>
                            {property.rentStatus === "paid" ? "Rent Paid" : "Due"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Rent</p>
                        <p className="font-semibold text-foreground">₹{property.rentAmount.toLocaleString()}</p>
                      </div>
                      {property.tenantName && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Tenant</p>
                          <p className="font-semibold text-foreground">{property.tenantName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" size="sm" asChild>
                    <Link to={`/owner/properties/${property.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  {!property.tenantName && (
                    <Button className="flex-1" size="sm" asChild>
                      <Link to={`/properties/${property.id}`}>Find Tenant</Link>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link to="/owner/tenants">
            <Card className="p-4 hover:border-accent transition-colors">
              <Users className="w-8 h-8 text-accent mb-2" />
              <h3 className="font-semibold text-foreground">Manage Tenants</h3>
              <p className="text-sm text-muted-foreground">View tenant details & agreements</p>
            </Card>
          </Link>
          <Link to="/owner/payouts">
            <Card className="p-4 hover:border-accent transition-colors">
              <CreditCard className="w-8 h-8 text-success mb-2" />
              <h3 className="font-semibold text-foreground">Payout History</h3>
              <p className="text-sm text-muted-foreground">Track your earnings</p>
            </Card>
          </Link>
        </motion.div>

        {/* Logout Button */}
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
      </main>
    </div>
  );
}
