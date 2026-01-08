import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Wallet as WalletIcon, Gift, Users, Tag, ArrowUpRight, ArrowDownLeft,
  ShoppingBag, Home, Wrench, UtensilsCrossed, Copy, Share2, Info
} from "lucide-react";
import { toast } from "sonner";

// Mock wallet data
const walletData = {
  cashback: 1250,
  referral: 500,
  ownerDiscount: 300,
  totalBalance: 2050,
};

const transactions = [
  { id: 1, type: "credit", category: "cashback", amount: 450, description: "2% cashback on rent", date: "Dec 15, 2024" },
  { id: 2, type: "debit", category: "services", amount: 149, description: "Tiffin service payment", date: "Dec 14, 2024" },
  { id: 3, type: "credit", category: "referral", amount: 200, description: "Friend joined using your code", date: "Dec 12, 2024" },
  { id: 4, type: "debit", category: "maintenance", amount: 299, description: "AC service", date: "Dec 10, 2024" },
  { id: 5, type: "credit", category: "cashback", amount: 450, description: "2% cashback on rent", date: "Nov 15, 2024" },
  { id: 6, type: "credit", category: "owner", amount: 300, description: "Owner discount bonus", date: "Nov 10, 2024" },
];

const useForOptions = [
  { id: "rent", label: "Rent Payment", icon: Home, color: "bg-primary" },
  { id: "maintenance", label: "Maintenance", icon: Wrench, color: "bg-accent" },
  { id: "services", label: "Daily Services", icon: UtensilsCrossed, color: "bg-success" },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag, color: "bg-warning" },
];

export default function Wallet() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "earn">("overview");
  const referralCode = "RENTPE500";

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Wallet Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="overflow-hidden">
              <div className="gradient-primary p-6 text-primary-foreground">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                      <WalletIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-primary-foreground/80 text-sm">Total Balance</p>
                      <p className="text-3xl font-bold">₹{walletData.totalBalance.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-foreground/80 text-xs">RentPe Wallet</p>
                    <p className="text-sm font-medium">Non-withdrawable</p>
                  </div>
                </div>

                {/* Three Buckets */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-primary-foreground/10 rounded-xl p-4 text-center">
                    <Gift className="w-6 h-6 mx-auto mb-2 opacity-80" />
                    <p className="text-2xl font-bold">₹{walletData.cashback}</p>
                    <p className="text-xs opacity-80">Cashback</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 opacity-80" />
                    <p className="text-2xl font-bold">₹{walletData.referral}</p>
                    <p className="text-xs opacity-80">Referral</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-xl p-4 text-center">
                    <Tag className="w-6 h-6 mx-auto mb-2 opacity-80" />
                    <p className="text-2xl font-bold">₹{walletData.ownerDiscount}</p>
                    <p className="text-xs opacity-80">Owner Discount</p>
                  </div>
                </div>
              </div>

              {/* Usage Priority */}
              <div className="p-4 bg-muted/50 flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Usage priority: <span className="text-foreground font-medium">Owner Discount → Cashback → Referral</span>
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "overview", label: "Use Wallet" },
              { id: "history", label: "History" },
              { id: "earn", label: "Earn More" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                size="sm"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Use your wallet for</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {useForOptions.map((option) => (
                  <Card 
                    key={option.id}
                    className="p-5 cursor-pointer hover:shadow-lg hover:border-accent transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <option.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{option.label}</h3>
                        <p className="text-sm text-muted-foreground">Pay using wallet balance</p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Transaction History</h2>
              <Card>
                <div className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "credit" ? "bg-success/10" : "bg-destructive/10"
                      }`}>
                        {tx.type === "credit" ? (
                          <ArrowDownLeft className={`w-5 h-5 text-success`} />
                        ) : (
                          <ArrowUpRight className={`w-5 h-5 text-destructive`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                      <p className={`font-bold ${tx.type === "credit" ? "text-success" : "text-destructive"}`}>
                        {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "earn" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Referral Card */}
              <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">Refer & Earn ₹500</h3>
                    <p className="text-muted-foreground">
                      Invite friends to RentPe. When they pay their first rent, you both get ₹500!
                    </p>
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-4 flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Your referral code</p>
                    <p className="text-2xl font-bold text-foreground tracking-wider">{referralCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={copyReferralCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">5</p>
                    <p className="text-sm text-muted-foreground">Friends Referred</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">3</p>
                    <p className="text-sm text-muted-foreground">Successful</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">₹1,500</p>
                    <p className="text-sm text-muted-foreground">Earned</p>
                  </div>
                </div>
              </Card>

              {/* Cashback Info */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                    <Gift className="w-7 h-7 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">Rent Cashback</h3>
                    <p className="text-muted-foreground mb-4">
                      Get 2% cashback on every rent payment made through RentPe. Automatically credited to your wallet.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 bg-success/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">This Month</p>
                        <p className="text-lg font-bold text-success">₹450</p>
                      </div>
                      <div className="px-4 py-2 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">All Time</p>
                        <p className="text-lg font-bold text-foreground">₹2,700</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}