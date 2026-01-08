import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Home, ShoppingBag, Package, Star, Clock, MapPin,
  TrendingUp, DollarSign, CheckCircle, LogOut, Plus,
  Eye, Edit, Trash2, Truck, AlertCircle, Wallet,
  IndianRupee, Calendar, Phone, MessageSquare, Check
} from "lucide-react";


// Mock data
const stats = [
  { label: "Active Listings", value: "12", icon: Package, color: "bg-primary" },
  { label: "Pending Orders", value: "5", icon: ShoppingBag, color: "bg-warning" },
  { label: "Completed", value: "156", icon: CheckCircle, color: "bg-success" },
  { label: "This Month", value: "₹45K", icon: DollarSign, color: "bg-accent" },
];

const listings = [
  { 
    id: "1", 
    title: "Single Bed with Mattress", 
    titleHi: "सिंगल बेड मैट्रेस के साथ",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200",
    monthlyRent: 899, 
    deposit: 2000,
    status: "active",
    views: 234,
    inquiries: 12
  },
  { 
    id: "2", 
    title: "Study Table + Chair Set", 
    titleHi: "स्टडी टेबल + चेयर सेट",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200",
    monthlyRent: 449, 
    deposit: 1500,
    status: "active",
    views: 189,
    inquiries: 8
  },
  { 
    id: "3", 
    title: "32\" Smart LED TV", 
    titleHi: "32\" स्मार्ट LED TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200",
    monthlyRent: 799, 
    deposit: 3000,
    status: "paused",
    views: 156,
    inquiries: 5
  },
];

const orders = [
  { 
    id: "ORD001", 
    customer: "Amit Kumar", 
    product: "Single Bed with Mattress",
    address: "Koramangala, Bangalore",
    amount: 2899,
    deposit: 2000,
    status: "pending_delivery",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-18",
  },
  { 
    id: "ORD002", 
    customer: "Priya Singh", 
    product: "Study Table + Chair",
    address: "HSR Layout, Bangalore",
    amount: 1949,
    deposit: 1500,
    status: "delivered",
    orderDate: "2024-01-10",
    deliveryDate: "2024-01-12",
    deliveryOTP: "verified"
  },
  { 
    id: "ORD003", 
    customer: "Rahul Verma", 
    product: "32\" Smart LED TV",
    address: "Indiranagar, Bangalore",
    amount: 3799,
    deposit: 3000,
    status: "confirmed",
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-20",
  },
];

const earnings = [
  { month: "Jan 2024", orders: 23, revenue: 45000, payout: 40500, status: "paid" },
  { month: "Dec 2023", orders: 19, revenue: 38000, payout: 34200, status: "paid" },
  { month: "Nov 2023", orders: 21, revenue: 42000, payout: 37800, status: "paid" },
];

const weeklyData = [
  { day: "Mon", amount: 6500 },
  { day: "Tue", amount: 8000 },
  { day: "Wed", amount: 4500 },
  { day: "Thu", amount: 9000 },
  { day: "Fri", amount: 7500 },
  { day: "Sat", amount: 5500 },
  { day: "Sun", amount: 4000 },
];

export default function VendorDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [otpModal, setOtpModal] = useState<{ open: boolean; orderId: string | null }>({ open: false, orderId: null });
  const [otp, setOtp] = useState("");

  const maxAmount = Math.max(...weeklyData.map(d => d.amount));
  const totalWeekly = weeklyData.reduce((sum, d) => sum + d.amount, 0);

  const handleVerifyOTP = () => {
    if (otp.length === 4) {
      toast.success("OTP Verified! Payment released to your wallet.");
      setOtpModal({ open: false, orderId: null });
      setOtp("");
    } else {
      toast.error("Please enter valid 4-digit OTP");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_delivery":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending Delivery</Badge>;
      case "confirmed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Confirmed</Badge>;
      case "delivered":
        return <Badge className="bg-success/10 text-success border-success/20">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
              Rent<span className="text-accent">Pe</span> Vendor
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link to="/profile" className="w-9 h-9 rounded-full bg-warning flex items-center justify-center text-warning-foreground font-semibold hover:ring-2 hover:ring-warning/50 transition-all">
              {profile?.full_name?.[0] || "V"}
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            नमस्ते, {profile?.full_name || "Vendor"} 👋
          </h1>
          <p className="text-muted-foreground">अपने स्टोर और ऑर्डर्स को मैनेज करें</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
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

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Pending Actions */}
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">2 Orders awaiting delivery</p>
                    <p className="text-sm text-muted-foreground">Confirm delivery with OTP</p>
                  </div>
                  <Button size="sm" onClick={() => setActiveTab("orders")}>View</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">3 New inquiries</p>
                    <p className="text-sm text-muted-foreground">Respond to customer queries</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Weekly Earnings</span>
                  <span className="text-2xl font-bold text-primary">₹{totalWeekly.toLocaleString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-32">
                  {weeklyData.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-primary/20 rounded-t-md relative overflow-hidden"
                        style={{ height: `${(d.amount / maxAmount) * 100}%` }}
                      >
                        <div 
                          className="absolute bottom-0 w-full bg-primary transition-all"
                          style={{ height: '100%' }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Recent Orders</span>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{order.product}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-sm font-semibold text-foreground mt-1">₹{order.amount}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Listings</h2>
              <Button className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </div>

            <div className="space-y-4">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="flex">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-24 h-24 object-cover"
                    />
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">{listing.titleHi}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {listing.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {listing.inquiries}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={listing.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                            {listing.status === "active" ? "Active" : "Paused"}
                          </Badge>
                          <p className="text-lg font-bold text-primary mt-1">₹{listing.monthlyRent}/mo</p>
                          <p className="text-xs text-muted-foreground">Deposit: ₹{listing.deposit}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Orders</h2>
              <Badge variant="outline">{orders.length} total</Badge>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">#{order.id}</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <h3 className="font-medium text-foreground mt-1">{order.product}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{order.amount}</p>
                        <p className="text-xs text-muted-foreground">+ ₹{order.deposit} deposit</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium text-foreground">{order.customer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {order.address}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Delivery: {order.deliveryDate}
                      </div>
                    </div>

                    {order.status === "pending_delivery" && (
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium text-foreground mb-2">
                          🚚 Ready for delivery? Verify with customer OTP
                        </p>
                        <Button 
                          className="w-full"
                          onClick={() => setOtpModal({ open: true, orderId: order.id })}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Delivery with OTP
                        </Button>
                      </div>
                    )}

                    {order.status === "confirmed" && (
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button className="flex-1">
                          <Truck className="w-4 h-4 mr-2" />
                          Mark Shipped
                        </Button>
                      </div>
                    )}

                    {order.status === "delivered" && (
                      <div className="mt-3 flex items-center gap-2 text-success">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Delivered & Payment Released</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            {/* Wallet Balance */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Available Balance</p>
                    <p className="text-3xl font-bold text-foreground">₹12,450</p>
                    <p className="text-sm text-success flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4" />
                      +15% from last month
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <IndianRupee className="w-4 h-4 mr-2" />
                  Withdraw to Bank
                </Button>
              </CardContent>
            </Card>

            {/* Pending Payouts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">₹8,500</p>
                    <p className="text-sm text-muted-foreground">2 orders awaiting delivery confirmation</p>
                  </div>
                  <Badge className="bg-warning/20 text-warning">Pending</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Earnings History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payout History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {earnings.map((earning, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{earning.month}</p>
                      <p className="text-sm text-muted-foreground">{earning.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{earning.payout.toLocaleString()}</p>
                      <Badge className="bg-success/10 text-success">Paid</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mt-6"
        >
          <Link to="/marketplace/vendor/kyc">
            <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
              <Package className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">KYC & Bank</h3>
              <p className="text-sm text-muted-foreground">Manage verification</p>
            </Card>
          </Link>
          <Link to="/vendor/area">
            <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
              <MapPin className="w-8 h-8 text-success mb-2" />
              <h3 className="font-semibold text-foreground">Service Area</h3>
              <p className="text-sm text-muted-foreground">Update coverage</p>
            </Card>
          </Link>
        </motion.div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={async () => {
            await signOut();
            navigate("/auth");
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </main>

      {/* OTP Verification Modal */}
      <Dialog open={otpModal.open} onOpenChange={(open) => setOtpModal({ open, orderId: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Delivery OTP</DialogTitle>
            <DialogDescription>
              Customer को delivery के time जो OTP मिला है, वो enter करें
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="text-center text-2xl tracking-widest w-40"
                maxLength={4}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              OTP verify होने के बाद payment आपके wallet में release हो जाएगा
            </p>
            <Button className="w-full" onClick={handleVerifyOTP} disabled={otp.length !== 4}>
              <Check className="w-4 h-4 mr-2" />
              Verify & Release Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
