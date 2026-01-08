import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Apple, Play, QrCode, Star, Download, Smartphone } from "lucide-react";

export const AppDownloadSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container">
        <div className="relative rounded-3xl gradient-primary p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
                <Download className="w-4 h-4" />
                Download Now
              </span>
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5">
                Get the RentPe App
              </h2>
              
              <p className="text-lg text-primary-foreground/80 mb-8">
                Download our app and experience the future of urban living. Available on Android. iOS coming soon!
              </p>

              {/* App Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="text-primary-foreground font-semibold">4.8</span>
                  <span className="text-primary-foreground/70 text-sm">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary-foreground" />
                  <span className="text-primary-foreground font-semibold">500K+</span>
                  <span className="text-primary-foreground/70 text-sm">Downloads</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="secondary"
                  size="xl"
                  className="gap-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Play className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-xs opacity-70">GET IT ON</p>
                    <p className="font-semibold">Google Play</p>
                  </div>
                </Button>
                
                <Button
                  variant="secondary"
                  size="xl"
                  className="gap-3 bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/30"
                  disabled
                >
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-xs opacity-70">COMING SOON</p>
                    <p className="font-semibold">App Store</p>
                  </div>
                </Button>
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Phone Frame */}
                <div className="relative w-64 md:w-72 h-[500px] md:h-[560px] bg-navy rounded-[3rem] p-3 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-8 bg-navy flex items-center justify-center">
                      <div className="w-20 h-5 bg-navy-foreground/20 rounded-full" />
                    </div>
                    
                    {/* App Content Preview */}
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Good Morning</p>
                          <p className="font-semibold text-foreground">Rahul Sharma</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-accent/20" />
                      </div>
                      
                      {/* Wallet Card */}
                      <div className="gradient-primary rounded-2xl p-4 mb-4">
                        <p className="text-xs text-primary-foreground/70">Wallet Balance</p>
                        <p className="text-2xl font-bold text-primary-foreground">₹4,250</p>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {["Pay Rent", "Services", "Maintain", "Rent Items"].map((action, i) => (
                          <div key={i} className="text-center">
                            <div className="w-10 h-10 rounded-xl bg-muted mx-auto mb-1" />
                            <p className="text-[10px] text-muted-foreground">{action}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Property Card */}
                      <div className="bg-card rounded-xl p-3 shadow-sm">
                        <div className="w-full h-20 bg-muted rounded-lg mb-2" />
                        <p className="text-sm font-medium text-foreground">2 BHK Apartment</p>
                        <p className="text-xs text-muted-foreground">Andheri West, Mumbai</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 top-1/4 bg-card rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-success fill-success" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">+₹320</p>
                      <p className="text-[10px] text-muted-foreground">Cashback</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 bottom-1/3 bg-card rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-accent" />
                    <p className="text-xs font-semibold text-foreground">Live Now!</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
