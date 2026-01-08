import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Home, Users, Shield, Wallet, Wrench, UserCheck, Building2, 
  ArrowRight, CheckCircle2, Phone, Mail, MapPin, Star,
  TrendingUp, Clock, HeartHandshake, Award, Linkedin, Twitter,
  ChevronLeft, ChevronRight, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Section navigation items
const sectionNavItems = [
  { id: "our-story", label: "Our Story" },
  { id: "how-it-works", label: "How It Works" },
  { id: "our-ecosystem", label: "Our Ecosystem" },
  { id: "our-values", label: "Our Values" },
  { id: "our-team", label: "Our Team" },
  { id: "testimonials", label: "Testimonials" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const roles = [
  {
    icon: Users,
    title: "Tenants",
    description: "Find your perfect home with verified listings, schedule visits, pay rent digitally, and access maintenance services.",
    color: "from-blue-500 to-cyan-500",
    features: ["Browse Properties", "Schedule Visits", "Digital Rent Payment", "Maintenance Requests"]
  },
  {
    icon: Building2,
    title: "Property Owners",
    description: "List your properties, find verified tenants, receive rent on time, and manage everything from one dashboard.",
    color: "from-emerald-500 to-teal-500",
    features: ["List Properties", "Tenant Verification", "Rent Collection", "Property Management"]
  },
  {
    icon: UserCheck,
    title: "Agents",
    description: "Manage leads, conduct property verifications, earn commissions, and grow your real estate business.",
    color: "from-purple-500 to-pink-500",
    features: ["Lead Management", "Property Verification", "Commission Tracking", "Performance Analytics"]
  },
  {
    icon: Wrench,
    title: "Vendors & Technicians",
    description: "Receive service requests, manage jobs, build your reputation, and earn through quality service delivery.",
    color: "from-orange-500 to-red-500",
    features: ["Job Requests", "Service Management", "Ratings & Reviews", "Earnings Dashboard"]
  }
];

const howItWorks = [
  { step: 1, title: "Sign Up", description: "Create your account and select your role", icon: Users },
  { step: 2, title: "Get Verified", description: "Complete verification for trust & safety", icon: Shield },
  { step: 3, title: "Connect", description: "Find properties or tenants that match", icon: HeartHandshake },
  { step: 4, title: "Transact", description: "Secure payments through our wallet system", icon: Wallet },
  { step: 5, title: "Enjoy", description: "Move in and access all our services", icon: Home }
];

const stats = [
  { value: "10,000+", label: "Properties Listed", icon: Building2 },
  { value: "50,000+", label: "Happy Tenants", icon: Users },
  { value: "5,000+", label: "Property Owners", icon: Home },
  { value: "1,000+", label: "Service Partners", icon: Wrench }
];

const values = [
  { 
    icon: Shield, 
    title: "Trust & Safety", 
    description: "Every property and user is verified for a secure experience" 
  },
  { 
    icon: TrendingUp, 
    title: "Transparency", 
    description: "No hidden charges, clear pricing, and honest dealings" 
  },
  { 
    icon: Clock, 
    title: "Convenience", 
    description: "End-to-end digital experience saving time and effort" 
  },
  { 
    icon: Award, 
    title: "Quality Service", 
    description: "Rated professionals and premium property listings" 
  }
];

const teamMembers = [
  {
    name: "Arjun Sharma",
    role: "CEO & Co-Founder",
    bio: "Former product lead at Housing.com with 10+ years in real estate tech. Passionate about simplifying urban living.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Priya Menon",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer specializing in scalable platforms. Built systems serving millions of users daily.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Rahul Verma",
    role: "Head of Operations",
    bio: "Operations expert with experience at OYO and Zomato. Ensures seamless service delivery across cities.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Sneha Patel",
    role: "Head of Customer Success",
    bio: "Customer experience leader focused on building lasting relationships and ensuring tenant satisfaction.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
    twitter: "#"
  }
];

const testimonials = [
  {
    name: "Amit Kumar",
    role: "Tenant",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    rating: 5,
    text: "Finding a flat in Mumbai was always stressful until I discovered RentEase. The verified listings saved me from broker hassles, and paying rent through the app is so convenient!"
  },
  {
    name: "Sunita Reddy",
    role: "Property Owner",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    rating: 5,
    text: "As a working professional managing 3 properties, RentEase has been a game-changer. Rent collection is automated, tenants are verified, and I can track everything from my phone."
  },
  {
    name: "Vikram Singh",
    role: "Real Estate Agent",
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    rating: 5,
    text: "My earnings have doubled since joining RentEase. The lead management system is excellent, and commission tracking is transparent. Best platform for agents!"
  },
  {
    name: "Meera Joshi",
    role: "Tenant",
    location: "Pune",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    rating: 5,
    text: "The maintenance service booking feature is amazing! Got my AC fixed within hours. The whole experience of renting through RentEase has been smooth and hassle-free."
  },
  {
    name: "Rajesh Gupta",
    role: "Property Owner",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face",
    rating: 5,
    text: "Zero vacancy since I listed on RentEase. Their agent network is strong, verification process is thorough, and I finally have peace of mind about my rental income."
  }
];

const AUTO_PLAY_DURATION = 5000;

export default function About() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("our-story");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  };

  // Auto-play functionality with progress tracking
  useEffect(() => {
    if (isPaused) return;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentTestimonial((current) => (current + 1) % testimonials.length);
          return 0;
        }
        return prev + (100 / (AUTO_PLAY_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isPaused, currentTestimonial]);

  // Reset progress when testimonial changes manually
  useEffect(() => {
    setProgress(0);
  }, [currentTestimonial]);

  // Track active section and sticky nav visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after hero section
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyNav(heroBottom < 80);
      }

      // Find active section
      const sections = sectionNavItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionNavItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for sticky nav height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Sticky Section Navigation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: showStickyNav ? 0 : -100, 
          opacity: showStickyNav ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <nav className="flex items-center gap-1 py-3 overflow-x-auto no-scrollbar">
              {sectionNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>
      
      {/* Hero Section with Image */}
      <section ref={heroRef} className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                About RentEase
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Simplifying Rentals for
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Everyone</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
                We're building India's most trusted rental ecosystem connecting tenants, property owners, 
                agents, and service providers on a single platform.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button size="lg" asChild>
                  <Link to="/auth">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=500&fit=crop" 
                  alt="Modern apartment building" 
                  className="rounded-2xl shadow-2xl w-full object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">50,000+</p>
                      <p className="text-sm text-muted-foreground">Happy Tenants</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">10,000+</p>
                      <p className="text-sm text-muted-foreground">Properties</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 px-4 bg-muted/30 scroll-mt-32">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              We didn't find it for us,
              <span className="block text-primary">so we created it for you</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-muted-foreground mb-6">
                That's essentially our story in one sentence. Dealing with unreliable brokers, hidden charges, 
                and unverified listings - not much of a choice, is it?
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                That's why we created RentEase - a platform designed by people who've been in your shoes. 
                We understand the frustrations of finding a home in a new city, the anxiety of dealing with 
                unknown landlords, and the hassle of managing rent payments.
              </p>
              <p className="text-lg text-foreground font-medium">
                We're here to change that. Forever.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Team brainstorming" 
                className="rounded-2xl shadow-xl w-full object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-card p-3 rounded-lg shadow-lg border">
                <p className="text-sm font-medium text-foreground">Founded in 2023</p>
              </div>
            </motion.div>
          </div>

          {/* Journey Timeline */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center p-6 bg-card rounded-xl border"
              >
                <stat.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - Interactive Diagram */}
      <section id="how-it-works" className="py-20 px-4 scroll-mt-32">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simple 5-step process gets you from signup to settled in no time
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2" />
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-5 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {howItWorks.map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Card className="text-center p-6 bg-card hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roles Section - Interactive Cards */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Everyone</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking for a home or managing properties, we have the tools for you
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {roles.map((role, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${role.color}`} />
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${role.color} text-white shrink-0`}>
                        <role.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-3">{role.title}</h3>
                        <p className="text-muted-foreground mb-4">{role.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {role.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                              <span className="text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Ecosystem Diagram */}
      <section id="our-ecosystem" className="py-20 px-4 scroll-mt-32">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Ecosystem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete platform connecting all stakeholders in the rental journey
            </p>
          </motion.div>

          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Center Hub */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <Home className="h-10 w-10 mx-auto text-primary mb-1" />
                    <span className="text-sm font-bold text-foreground">RentEase</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  {[
                    { icon: Users, label: "Tenants", angle: 0, color: "bg-blue-500" },
                    { icon: Building2, label: "Owners", angle: 90, color: "bg-emerald-500" },
                    { icon: UserCheck, label: "Agents", angle: 180, color: "bg-purple-500" },
                    { icon: Wrench, label: "Services", angle: 270, color: "bg-orange-500" },
                  ].map((item, index) => {
                    const x = Math.cos((item.angle * Math.PI) / 180) * 140;
                    const y = Math.sin((item.angle * Math.PI) / 180) * 140;
                    return (
                      <motion.div
                        key={index}
                        className="absolute"
                        style={{ 
                          left: `calc(50% + ${x}px - 32px)`, 
                          top: `calc(50% + ${y}px - 32px)` 
                        }}
                        whileHover={{ scale: 1.2 }}
                        animate={{ 
                          y: [0, -5, 0],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: index * 0.3 
                        }}
                      >
                        <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center shadow-lg`}>
                          <item.icon className="h-7 w-7 text-white" />
                        </div>
                        <span className="block text-center text-xs font-medium mt-2 text-foreground">{item.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values with Image */}
      <section id="our-values" className="py-20 px-4 bg-muted/30 scroll-mt-32">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative hidden lg:block"
            >
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=500&fit=crop" 
                alt="Team collaboration" 
                className="rounded-2xl shadow-xl w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </motion.div>
            
            <div>
              <motion.div 
                className="text-center lg:text-left mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
                <p className="text-muted-foreground max-w-2xl">
                  The principles that guide everything we do
                </p>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="text-center p-6 h-full hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <value.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="our-team" className="py-20 px-4 scroll-mt-32">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind RentEase working to transform how India rents
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <Card className="text-center overflow-hidden group">
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5" />
                    <Avatar className="w-24 h-24 absolute left-1/2 -translate-x-1/2 -bottom-12 border-4 border-background shadow-lg">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardContent className="pt-16 pb-6 px-6">
                    <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{member.bio}</p>
                    <div className="flex justify-center gap-3">
                      <a 
                        href={member.linkedin} 
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a 
                        href={member.twitter}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30 scroll-mt-32">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from tenants, owners, and agents who trust RentEase
            </p>
          </motion.div>

          <div 
            className="max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 md:p-12 relative overflow-hidden">
                    <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/10" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-1 justify-center mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-lg md:text-xl text-foreground text-center mb-8 italic">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <div className="flex flex-col items-center">
                        <Avatar className="w-16 h-16 mb-4 border-2 border-primary/20">
                          <AvatarImage src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].name} />
                          <AvatarFallback>{testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].location}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-foreground" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-foreground" />
              </button>
            </div>

            {/* Progress Bar & Dots Indicator */}
            <div className="mt-8">
              {/* Progress Bar */}
              <div className="max-w-xs mx-auto mb-4">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: "linear" }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{isPaused ? "Paused" : "Auto-playing"}</span>
                  <span>{Math.ceil((100 - progress) / (100 / (AUTO_PLAY_DURATION / 1000)))}s</span>
                </div>
              </div>
              
              {/* Dots Indicator */}
              <div className="flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className="relative"
                  >
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? "bg-primary/30 w-8" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`} />
                    {index === currentTestimonial && (
                      <motion.div 
                        className="absolute inset-0 h-3 rounded-full bg-primary origin-left"
                        style={{ width: `${progress}%`, maxWidth: '2rem' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-muted-foreground mb-8">Trusted By Industry Leaders</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=40&fit=crop" alt="Partner logo" className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&h=40&fit=crop" alt="Partner logo" className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=120&h=40&fit=crop" alt="Partner logo" className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="https://images.unsplash.com/photo-1611605698335-8b1569810432?w=120&h=40&fit=crop" alt="Partner logo" className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Shield, text: "100% Verified Properties", color: "text-emerald-500" },
              { icon: Award, text: "Award Winning Platform", color: "text-amber-500" },
              { icon: Users, text: "50,000+ Happy Users", color: "text-blue-500" },
              { icon: HeartHandshake, text: "24/7 Customer Support", color: "text-rose-500" },
            ].map((badge, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center gap-3 p-4"
              >
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center`}>
                  <badge.icon className={`h-6 w-6 ${badge.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground text-center">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of happy users who have found their perfect rental match
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/properties">Browse Properties</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Phone className="h-4 w-4" /> +91 98765 43210
              </a>
              <a href="mailto:support@rentease.in" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Mail className="h-4 w-4" /> support@rentease.in
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Mumbai, India
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
