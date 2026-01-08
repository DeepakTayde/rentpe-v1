import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock, Users, Award, Lock } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Verified Properties",
    description: "Every property is physically verified by our agents before listing.",
  },
  {
    icon: CheckCircle,
    title: "Background Checked",
    description: "All vendors and technicians undergo thorough background verification.",
  },
  {
    icon: Clock,
    title: "SLA Guarantee",
    description: "Guaranteed response times for maintenance and service requests.",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join 2 lakh+ happy tenants and property owners across India.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Strict quality standards for all services and vendor partners.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Bank-grade security for all transactions. Your money is safe.",
  },
];

export const TrustSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            Trust & Safety
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Built on{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Trust & Transparency
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Your safety is our priority. Every aspect of RentPe is designed with trust, verification, and security at its core.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4 p-6 rounded-2xl bg-card shadow-card hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground">ISO 27001</p>
            <p className="text-xs text-muted-foreground">Certified</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">PCI DSS</p>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">SSL</p>
            <p className="text-xs text-muted-foreground">Encrypted</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">GDPR</p>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
