import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 text-accent mb-8"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Join the Smart Living Revolution</span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Living Experience?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of happy users who are already enjoying the benefits of RentPe. Get started today and experience the future of urban living.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="xl" className="gap-2 min-w-[200px]">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]">
              Contact Sales
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • Free forever for tenants • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};
