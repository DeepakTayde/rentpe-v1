import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Star,
  MessageSquare,
  BadgeCheck,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
  Briefcase,
  CheckCircle2
} from "lucide-react";

// Mock worker data
const mockWorkerDetails: Record<string, any> = {
  w1: {
    id: "w1",
    name: "Ramesh Kumar",
    category: "Cleaning",
    categoryHi: "सफाई",
    rating: 4.8,
    reviews: 156,
    isAvailable: true,
    experience: 5,
    addOns: ["Bathroom Cleaning", "Kitchen Deep Cleaning", "Sofa Cleaning", "Floor Mopping", "Window Cleaning"],
    area: "Koramangala, Bangalore",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: true,
    aadhaarVerified: true,
    panVerified: true,
    supervisorVerified: true,
    description: "मैं 5 साल से घर की सफाई का काम करता हूं। Bathroom, Kitchen और पूरे घर की deep cleaning में expert हूं। समय पर काम और quality guaranteed।",
    availability: [
      { day: "Monday", time: "9 AM - 6 PM" },
      { day: "Tuesday", time: "9 AM - 6 PM" },
      { day: "Wednesday", time: "9 AM - 6 PM" },
      { day: "Thursday", time: "9 AM - 6 PM" },
      { day: "Friday", time: "9 AM - 6 PM" },
      { day: "Saturday", time: "10 AM - 4 PM" },
    ],
    experienceCards: [
      { title: "Residential Cleaning", years: "5 years" },
      { title: "Deep Cleaning Specialist", years: "3 years" },
      { title: "Commercial Cleaning", years: "2 years" },
    ],
  },
  w4: {
    id: "w4",
    name: "Lakshmi Amma",
    category: "Cook / Home Chef",
    categoryHi: "रसोइया",
    rating: 4.9,
    reviews: 312,
    isAvailable: true,
    experience: 15,
    addOns: ["Veg", "South Indian", "Breakfast", "Lunch", "Dinner", "North Indian", "Tiffin Service"],
    area: "BTM Layout, Bangalore",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    verified: true,
    aadhaarVerified: true,
    panVerified: true,
    supervisorVerified: true,
    description: "15 साल का अनुभव South Indian और North Indian खाना बनाने में। शुद्ध शाकाहारी भोजन। घर जैसा स्वाद और स्वच्छता की पूर्ण गारंटी।",
    availability: [
      { day: "Monday", time: "7 AM - 8 PM" },
      { day: "Tuesday", time: "7 AM - 8 PM" },
      { day: "Wednesday", time: "7 AM - 8 PM" },
      { day: "Thursday", time: "7 AM - 8 PM" },
      { day: "Friday", time: "7 AM - 8 PM" },
      { day: "Saturday", time: "7 AM - 2 PM" },
    ],
    experienceCards: [
      { title: "Home Cooking", years: "15 years" },
      { title: "South Indian Cuisine", years: "15 years" },
      { title: "Tiffin Service", years: "8 years" },
    ],
  },
};

export default function WorkerProfile() {
  const { workerId } = useParams<{ workerId: string }>();
  
  const worker = mockWorkerDetails[workerId || "w1"] || mockWorkerDetails.w1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo */}
                <div className="relative mx-auto md:mx-0">
                  <img 
                    src={worker.photo} 
                    alt={worker.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover"
                  />
                  {worker.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <h1 className="text-2xl font-display font-bold text-foreground">{worker.name}</h1>
                      <Badge className="mt-1">{worker.category}</Badge>
                    </div>
                    <Badge 
                      variant={worker.isAvailable ? "default" : "secondary"}
                      className={`w-fit mx-auto md:mx-0 ${worker.isAvailable ? "bg-success text-success-foreground" : ""}`}
                    >
                      {worker.isAvailable ? "🟢 Available" : "🔴 Busy"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold text-lg text-foreground">{worker.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({worker.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{worker.experience} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{worker.area}</span>
                    </div>
                  </div>
                  
                  {/* Verification Badges */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                    {worker.aadhaarVerified && (
                      <Badge variant="outline" className="gap-1 text-success border-success/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aadhaar Verified
                      </Badge>
                    )}
                    {worker.panVerified && (
                      <Badge variant="outline" className="gap-1 text-success border-success/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PAN Verified
                      </Badge>
                    )}
                    {worker.supervisorVerified && (
                      <Badge variant="outline" className="gap-1 text-accent border-accent/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Supervisor Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button size="lg" className="flex-1 gap-2" disabled={!worker.isAvailable}>
                  <MessageSquare className="w-5 h-5" />
                  Chat करें – ₹49
                </Button>
                <Button size="lg" variant="outline" className="flex-1 gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Service
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" />
                अनुभव और कौशल
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {worker.description}
              </p>
            </Card>
          </motion.div>

          {/* Experience Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Experience</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {worker.experienceCards.map((exp: any, index: number) => (
                  <div key={index} className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="font-medium text-foreground">{exp.title}</p>
                    <p className="text-sm text-accent font-semibold mt-1">{exp.years}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Add-on Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {worker.addOns.map((addon: string) => (
                  <Badge key={addon} variant="secondary" className="text-sm py-1.5 px-3">
                    {addon}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Availability</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {worker.availability.map((slot: any) => (
                  <div key={slot.day} className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="font-medium text-foreground text-sm">{slot.day}</p>
                    <p className="text-xs text-muted-foreground mt-1">{slot.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Safety Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center text-sm text-muted-foreground bg-destructive/5 border border-destructive/20 p-4 rounded-lg">
              <ShieldCheck className="w-5 h-5 inline-block mr-2 text-destructive" />
              <span className="font-medium text-destructive">Direct deal outside platform allowed नहीं है।</span>
              <br />
              <span className="text-xs">सभी payments और communications RentPe platform के through ही करें।</span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
