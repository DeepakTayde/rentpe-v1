import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  IndianRupee, 
  Clock, 
  Users, 
  CheckCircle, 
  Building, 
  Wallet,
  Headphones,
  ArrowRight,
  TrendingUp,
  Home,
  FileCheck
} from "lucide-react";
import { OwnerMobileVerification } from "@/components/owner/OwnerMobileVerification";

const benefits = [
  {
    icon: IndianRupee,
    title: "Guaranteed Rent",
    description: "Get rent on 1st of every month, even if property is vacant",
  },
  {
    icon: Shield,
    title: "Zero Hassle",
    description: "We handle tenant finding, verification & agreement",
  },
  {
    icon: Clock,
    title: "Quick Onboarding",
    description: "List your property in under 5 minutes",
  },
  {
    icon: Users,
    title: "Verified Tenants",
    description: "All tenants are background verified by our team",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Register Property",
    description: "Share your property details and photos with us",
    icon: Home,
  },
  {
    step: 2,
    title: "Verification Visit",
    description: "Our agent visits and verifies your property",
    icon: FileCheck,
  },
  {
    step: 3,
    title: "Find Tenants",
    description: "We find verified tenants for your property",
    icon: Users,
  },
  {
    step: 4,
    title: "Start Earning",
    description: "Receive rent directly to your bank account",
    icon: Wallet,
  },
];

const stats = [
  { value: "10,000+", label: "Happy Owners" },
  { value: "₹50Cr+", label: "Rent Disbursed" },
  { value: "99%", label: "On-time Payments" },
  { value: "15+", label: "Cities" },
];

const faqs = [
  {
    question: "How does guaranteed rent work?",
    answer: "RentPe guarantees your rent on the 1st of every month. Even if your property is vacant, we pay you. Once a tenant moves in, we collect rent from them and handle all the hassle.",
  },
  {
    question: "What are your charges?",
    answer: "We charge a small commission (5-10%) from the monthly rent. You get the rest directly in your bank account. No hidden fees, no surprise deductions.",
  },
  {
    question: "How do you verify tenants?",
    answer: "We do complete background verification including Aadhaar, employment, previous landlord reference, and police verification for all tenants.",
  },
  {
    question: "What if tenant damages the property?",
    answer: "We maintain a security deposit and handle any damage claims. Our agreement protects you against all major issues.",
  },
];

export default function ListProperty() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  <TrendingUp className="w-4 h-4" />
                  Earn up to ₹1 Lakh/month
                </span>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Earn <span className="text-accent">Guaranteed Rent</span>
                  <br />Every Month
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-xl mb-8">
                  Join 10,000+ property owners who earn hassle-free rental income. 
                  We handle tenants, maintenance & everything in between.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="gap-2"
                    onClick={() => setShowRegistration(true)}
                  >
                    List Your Property
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Talk to Expert
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-muted-foreground">100% Safe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-muted-foreground">No Hidden Fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-muted-foreground">24/7 Support</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {showRegistration ? (
                  <OwnerMobileVerification />
                ) : (
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <Building className="w-12 h-12 text-accent mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Start Earning Today
                        </h3>
                        <p className="text-muted-foreground">
                          Register your property in 2 minutes
                        </p>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <benefit.icon className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground text-sm">{benefit.title}</h4>
                              <p className="text-xs text-muted-foreground">{benefit.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full gap-2" 
                        size="lg"
                        onClick={() => setShowRegistration(true)}
                      >
                        Register Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-display font-bold text-accent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                How RentPe Works for Owners
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple 4-step process to start earning guaranteed rent
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="bg-card h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-8 h-8 text-accent" />
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                  
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8">
                      <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Owners Love RentPe
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                More than just a rental platform - we're your property management partner
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: IndianRupee,
                  title: "Guaranteed Monthly Income",
                  description: "Get rent credited to your account on the 1st of every month, without fail",
                },
                {
                  icon: Shield,
                  title: "Complete Protection",
                  description: "Insurance coverage for damages, legal support for disputes",
                },
                {
                  icon: Headphones,
                  title: "24/7 Support",
                  description: "Dedicated relationship manager for all your queries",
                },
                {
                  icon: FileCheck,
                  title: "Legal Compliance",
                  description: "We handle all agreements, police verification & documentation",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Join thousands of property owners who earn hassle-free rental income with RentPe
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2"
                onClick={() => {
                  setShowRegistration(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                List Your Property Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
