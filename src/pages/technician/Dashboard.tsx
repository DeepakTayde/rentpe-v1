import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { 
  Home, Wrench, Clock, Star, MapPin, Navigation,
  TrendingUp, DollarSign, CheckCircle, AlertCircle, LogOut
} from "lucide-react";

const stats = [
  { label: "Active Jobs", value: "2", icon: Wrench, color: "bg-accent" },
  { label: "Completed", value: "89", icon: CheckCircle, color: "bg-success" },
  { label: "Rating", value: "4.9", icon: Star, color: "bg-warning" },
  { label: "This Week", value: "₹18K", icon: DollarSign, color: "bg-primary" },
];

const activeJobs = [
  { 
    id: "1", 
    type: "Plumbing", 
    issue: "Leaking tap in bathroom",
    customer: "Amit Kumar",
    address: "123, Bandra West, Mumbai",
    time: "30 mins ago",
    priority: "high",
    status: "in_progress"
  },
  { 
    id: "2", 
    type: "Electrical", 
    issue: "Switch not working",
    customer: "Priya Singh",
    address: "45, Andheri West, Mumbai",
    time: "1 hour ago",
    priority: "medium",
    status: "assigned"
  },
];

const completedToday = [
  { id: "1", type: "AC Service", customer: "Rahul Verma", rating: 5, earnings: 800 },
  { id: "2", type: "Plumbing", customer: "Sneha Patel", rating: 5, earnings: 500 },
];

export default function TechnicianDashboard() {
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
            <Link to="/profile" className="w-9 h-9 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-semibold hover:ring-2 hover:ring-destructive/50 transition-all">
              {profile?.full_name?.[0] || "T"}
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
            Technician Dashboard
          </h1>
          <p className="text-muted-foreground">Manage maintenance jobs and track earnings</p>
        </motion.div>

        {/* Online Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-success/10 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">You're Online</h3>
                <p className="text-sm text-muted-foreground">Ready to receive new jobs</p>
              </div>
              <div className="w-12 h-6 bg-success rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        {/* Active Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Active Jobs</h2>
            <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded-full">2 Active</span>
          </div>
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <Card key={job.id} className={`p-4 ${job.priority === "high" ? "border-destructive/50" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{job.type}</h3>
                      {job.priority === "high" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{job.issue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  {job.address}
                </div>
                <div className="flex gap-3">
                  {job.status === "assigned" ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        Decline
                      </Button>
                      <Button size="sm" className="flex-1">
                        Accept & Navigate
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      <Button size="sm" className="flex-1">
                        Mark Complete
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Completed Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Completed Today</h2>
            <Link to="/technician/history" className="text-sm text-accent font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {completedToday.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{job.type}</h3>
                    <p className="text-sm text-muted-foreground">{job.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">+₹{job.earnings}</p>
                    <div className="flex items-center gap-1 text-warning">
                      {[...Array(job.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-warning" />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">This Week's Earnings</h2>
              <Link to="/technician/payouts" className="text-sm text-accent font-medium">View Payouts</Link>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-display font-bold text-foreground">₹18,200</p>
                <p className="text-sm text-success flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +22% from last week
                </p>
              </div>
            </div>
          </Card>
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
