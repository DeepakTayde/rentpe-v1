import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Search, Calendar, FileText, CreditCard, Home, CheckCircle } from "lucide-react";

const steps = [
  { icon: Search, title: "Search Properties", description: "Browse verified listings with detailed photos, amenities, and transparent pricing." },
  { icon: Calendar, title: "Schedule Visit", description: "Book a visit at your convenience. Our agent will show you around." },
  { icon: FileText, title: "Sign Agreement", description: "Digital rental agreement with e-signatures. No paperwork hassle." },
  { icon: CreditCard, title: "Pay Securely", description: "Pay rent online via UPI, cards, or wallet. Get cashback rewards." },
  { icon: Home, title: "Move In", description: "Get your keys and start your hassle-free living experience." },
  { icon: CheckCircle, title: "Enjoy Services", description: "Access maintenance, daily services, and 24/7 support." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">How RentPe Works</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From search to move-in, we've simplified every step of your rental journey
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 mb-12 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  {index < steps.length - 1 && <div className="w-0.5 h-16 bg-border mt-4" />}
                </div>
                <div className="flex-1 pt-2">
                  <span className="text-sm text-accent font-medium">Step {index + 1}</span>
                  <h3 className="text-2xl font-display font-semibold text-foreground mt-1 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
