import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ChefHat, 
  Wrench, 
  Zap, 
  Shirt, 
  Hammer, 
  HandHelping,
  ShieldCheck,
  MessageSquare,
  UserCheck,
  BadgeCheck,
  ArrowRight
} from "lucide-react";

const serviceCategories = [
  { id: "cleaning", name: "Cleaning", nameHi: "सफाई", icon: Sparkles, color: "bg-blue-500" },
  { id: "cook", name: "Cook / Home Chef", nameHi: "रसोइया", icon: ChefHat, color: "bg-orange-500" },
  { id: "plumber", name: "Plumber", nameHi: "प्लंबर", icon: Wrench, color: "bg-cyan-500" },
  { id: "electrician", name: "Electrician", nameHi: "इलेक्ट्रीशियन", icon: Zap, color: "bg-yellow-500" },
  { id: "laundry", name: "Laundry", nameHi: "धुलाई", icon: Shirt, color: "bg-purple-500" },
  { id: "carpenter", name: "Carpenter", nameHi: "बढ़ई", icon: Hammer, color: "bg-amber-600" },
  { id: "helper", name: "Helper", nameHi: "हेल्पर", icon: HandHelping, color: "bg-green-500" },
];

const trustPoints = [
  { icon: BadgeCheck, title: "Aadhaar & PAN Verified", titleHi: "आधार और पैन वेरिफाइड", description: "सभी वर्कर्स की पूर्ण KYC वेरिफिकेशन" },
  { icon: MessageSquare, title: "Secure Chat & Booking", titleHi: "सुरक्षित चैट और बुकिंग", description: "प्लेटफॉर्म पर सुरक्षित संवाद" },
  { icon: ShieldCheck, title: "No Broker / No Scam", titleHi: "कोई ब्रोकर नहीं / कोई स्कैम नहीं", description: "सीधे वेरिफाइड वर्कर से बात करें" },
  { icon: UserCheck, title: "Supervisor Verified", titleHi: "सुपरवाइजर वेरिफाइड", description: "हर प्रोफाइल को टीम द्वारा जांचा गया" },
];

export default function HomeServicesIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              Verified Workers Only
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Verified Home Services by <span className="text-accent">RentPe</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Cleaning, Cooking, Plumbing aur ghar ke sabhi daily kaam<br />
              <span className="font-medium text-foreground">sirf verified local workers ke saath</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Find a Worker
              </Button>
              <Link to="/home-services/worker/register">
                <Button size="lg" variant="outline" className="gap-2 w-full">
                  <HandHelping className="w-5 h-5" />
                  Join as Worker
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Service Categories Grid */}
        <section className="container mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
              Service Categories
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              अपनी ज़रूरत के हिसाब से सेवा चुनें
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {serviceCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/home-services/category/${category.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-all group cursor-pointer text-center h-full">
                      <div className={`w-16 h-16 mx-auto rounded-2xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <category.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.nameHi}</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Trust Points Section */}
        <section className="bg-secondary/50 py-16 mb-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
                Why Trust RentPe?
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                आपकी सुरक्षा हमारी प्राथमिकता
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trustPoints.map((point, index) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="p-6 text-center h-full hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <point.icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{point.titleHi}</h3>
                      <p className="text-xs text-muted-foreground">{point.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
              How It Works
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              3 आसान स्टेप्स में बुक करें
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: 1, title: "सेवा चुनें", desc: "अपनी ज़रूरत के हिसाब से कैटेगरी चुनें" },
                { step: 2, title: "वर्कर देखें", desc: "वेरिफाइड प्रोफाइल और रेटिंग देखें" },
                { step: 3, title: "चैट करें और बुक करें", desc: "सुरक्षित चैट से बात करें, फिर बुक करें" },
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Join as Worker CTA */}
        <section className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 md:p-12 gradient-primary text-primary-foreground text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                क्या आप काम करते हैं?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                RentPe पर रजिस्टर करें और regular earning करें। 
                Cleaning, Cooking, Plumbing या कोई भी home service – अपनी skills से कमाई करें।
              </p>
              <Link to="/home-services/worker/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Join as Worker
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </section>

        {/* Safety Disclaimer */}
        <section className="container mt-12">
          <div className="text-center text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <ShieldCheck className="w-5 h-5 inline-block mr-2 text-accent" />
            RentPe पर सभी profiles verification के बाद live होती हैं।
            <br className="sm:hidden" />
            <span className="text-destructive font-medium"> Direct deal outside platform allowed नहीं है।</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
