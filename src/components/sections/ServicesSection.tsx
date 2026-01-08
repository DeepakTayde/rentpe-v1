import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Shirt, 
  UtensilsCrossed, 
  Droplets, 
  Flame, 
  Zap, 
  Wrench, 
  Wind, 
  Sparkles,
  ArrowRight 
} from "lucide-react";

const services = [
  {
    icon: Shirt,
    name: "Laundry",
    description: "Wash, dry & fold",
    price: "From ₹49/kg",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: UtensilsCrossed,
    name: "Tiffin",
    description: "Home-style meals",
    price: "From ₹70/meal",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Droplets,
    name: "Water Cans",
    description: "20L mineral water",
    price: "₹40/can",
    color: "bg-sky-500/10 text-sky-500",
  },
  {
    icon: Flame,
    name: "Ironing",
    description: "Press & fold",
    price: "From ₹5/piece",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: Zap,
    name: "Electrician",
    description: "Repairs & installations",
    price: "From ₹149",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    icon: Wrench,
    name: "Plumber",
    description: "Leaks & blockages",
    price: "From ₹199",
    color: "bg-success/10 text-success",
  },
  {
    icon: Wind,
    name: "AC Repair",
    description: "Service & repair",
    price: "From ₹299",
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    icon: Sparkles,
    name: "House Cleaning",
    description: "Deep clean services",
    price: "From ₹499",
    color: "bg-purple-500/10 text-purple-500",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Services at Your Doorstep
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Daily Services &{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Home Maintenance
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From laundry to plumbing, get all household services with verified professionals and transparent pricing.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group p-5 md:p-6 rounded-2xl bg-card shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {service.description}
              </p>
              <p className="text-sm font-semibold text-accent">
                {service.price}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="gradient" size="lg" className="gap-2">
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
