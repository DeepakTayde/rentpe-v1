import { motion } from "framer-motion";
import { Home, CreditCard, Wallet, Wrench, ShoppingBag, Users } from "lucide-react";

const features = [
  {
    icon: Home,
    title: "Smart Renting",
    description: "Find verified properties, book visits, and sign digital agreements - all in one place.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CreditCard,
    title: "Rent Payments",
    description: "Pay rent via UPI, cards, or wallet. Get instant cashback and auto-generated invoices.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Wallet,
    title: "RentPe Wallet",
    description: "Earn cashback on every transaction. Use wallet money for rent, services, and more.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description: "Raise issues, track technicians in real-time, and get SLA-guaranteed service.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: ShoppingBag,
    title: "Daily Services",
    description: "Laundry, tiffin, water cans, maid services - all your daily needs at your doorstep.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Users,
    title: "Trusted Network",
    description: "Verified agents, background-checked vendors, and trained technicians.",
    color: "bg-primary/10 text-primary",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            One Platform, Endless Possibilities
          </span>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 md:mb-5 leading-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Live Smarter
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            RentPe digitizes your entire living experience. From finding a home to managing daily services, we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-5 md:p-6 lg:p-8 rounded-2xl bg-card shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 touch-manipulation"
            >
              <div className={`w-12 md:w-14 h-12 md:h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 md:w-7 h-6 md:h-7" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-semibold text-card-foreground mb-2 md:mb-3 leading-tight">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
