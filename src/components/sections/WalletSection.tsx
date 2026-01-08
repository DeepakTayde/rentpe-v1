import { motion } from "framer-motion";
import { Wallet, Gift, Users, Percent, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const walletFeatures = [
  {
    icon: Gift,
    title: "Cashback on Rent",
    description: "Earn up to 2% cashback every time you pay rent. More payments, more rewards.",
  },
  {
    icon: Percent,
    title: "Service Rewards",
    description: "Get cashback on laundry, tiffin, maintenance, and all RentPe services.",
  },
  {
    icon: Users,
    title: "Referral Bonus",
    description: "Invite friends and earn ₹500 for each successful referral. They earn too!",
  },
];

export const WalletSection = () => {
  return (
    <section className="py-20 md:py-28 bg-navy overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              RentPe Wallet
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy-foreground mb-5">
              Save More with
              <br />
              <span className="text-accent">Every Transaction</span>
            </h2>
            
            <p className="text-lg text-navy-foreground/70 mb-8">
              Our wallet system rewards you for every payment. Earn cashback, referral bonuses, and exclusive discounts - all stored securely and usable across the platform.
            </p>

            <div className="space-y-6 mb-8">
              {walletFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-navy-foreground/70 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="gap-2">
              Explore Wallet Benefits
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Wallet Card Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
            
            {/* Main Card */}
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-8 shadow-2xl"
              >
                {/* Card Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground rounded-full blur-3xl" />
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-primary-foreground/70 text-sm">RentPe Wallet</p>
                        <p className="text-primary-foreground font-semibold">Premium Member</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-foreground/70 text-sm">Balance</p>
                      <p className="text-2xl font-display font-bold text-primary-foreground">₹4,250</p>
                    </div>
                  </div>
                  
                  {/* Wallet Buckets */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-primary-foreground/10 rounded-xl p-4 text-center backdrop-blur-sm">
                      <p className="text-primary-foreground/70 text-xs mb-1">Cashback</p>
                      <p className="text-lg font-semibold text-primary-foreground">₹2,100</p>
                    </div>
                    <div className="bg-primary-foreground/10 rounded-xl p-4 text-center backdrop-blur-sm">
                      <p className="text-primary-foreground/70 text-xs mb-1">Referral</p>
                      <p className="text-lg font-semibold text-primary-foreground">₹1,500</p>
                    </div>
                    <div className="bg-primary-foreground/10 rounded-xl p-4 text-center backdrop-blur-sm">
                      <p className="text-primary-foreground/70 text-xs mb-1">Discounts</p>
                      <p className="text-lg font-semibold text-primary-foreground">₹650</p>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="mt-6 pt-6 border-t border-primary-foreground/10">
                    <p className="text-primary-foreground/70 text-sm mb-3">Recent Activity</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                            <Gift className="w-4 h-4 text-success" />
                          </div>
                          <span className="text-primary-foreground text-sm">Rent Cashback</span>
                        </div>
                        <span className="text-success font-medium">+₹320</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-accent" />
                          </div>
                          <span className="text-primary-foreground text-sm">Referral Bonus</span>
                        </div>
                        <span className="text-success font-medium">+₹500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
