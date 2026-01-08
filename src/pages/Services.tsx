import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, UtensilsCrossed, Droplets, SprayCan, Flame, ChefHat, Star, ArrowRight } from "lucide-react";
import { dailyServices } from "@/data/mockData";
import { ServiceBookingFlow } from "@/components/services/ServiceBookingFlow";

const iconMap: { [key: string]: any } = { Shirt, UtensilsCrossed, Droplets, SprayCan, Flame, ChefHat };

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof dailyServices[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Daily Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From laundry to home-cooked meals, get everything delivered to your doorstep
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Shirt;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                      <Icon className="w-7 h-7 text-accent group-hover:text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">{service.name}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-accent">From ₹{service.priceFrom}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span>{service.rating}</span>
                          <span>({service.reviews.toLocaleString()} reviews)</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="group-hover:bg-accent group-hover:text-accent-foreground"
                        onClick={() => setSelectedService(service)}
                      >
                        Book <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />

      {/* Booking Flow Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceBookingFlow
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}