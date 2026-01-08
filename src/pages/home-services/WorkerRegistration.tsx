import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  User, 
  MapPin, 
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles, 
  ChefHat, 
  Wrench, 
  Zap, 
  Shirt, 
  Hammer, 
  HandHelping,
  Clock,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const serviceCategories = [
  { id: "cleaning", name: "Cleaning", nameHi: "सफाई", icon: Sparkles },
  { id: "cook", name: "Cook", nameHi: "रसोइया", icon: ChefHat },
  { id: "plumber", name: "Plumber", nameHi: "प्लंबर", icon: Wrench },
  { id: "electrician", name: "Electrician", nameHi: "इलेक्ट्रीशियन", icon: Zap },
  { id: "laundry", name: "Laundry", nameHi: "धुलाई", icon: Shirt },
  { id: "carpenter", name: "Carpenter", nameHi: "बढ़ई", icon: Hammer },
  { id: "helper", name: "Helper", nameHi: "हेल्पर", icon: HandHelping },
];

const addOnsByCategory: Record<string, string[]> = {
  cleaning: ["Bathroom Cleaning", "Kitchen Deep Cleaning", "Sofa Cleaning", "Floor Mopping", "Window Cleaning", "Dusting", "Move-in Cleaning", "Move-out Cleaning"],
  cook: ["Veg", "Non-Veg", "South Indian", "North Indian", "Breakfast", "Lunch", "Dinner", "Tiffin Service", "Party Catering"],
  plumber: ["Pipe Fitting", "Tap Repair", "Toilet Repair", "Water Tank", "Drainage", "Leakage Repair", "Bathroom Fitting"],
  electrician: ["Wiring", "Fan Installation", "Switch Board", "MCB Repair", "Light Fitting", "AC Installation", "Inverter Setup"],
  laundry: ["Wash & Fold", "Wash & Iron", "Dry Cleaning", "Curtain Cleaning", "Blanket Wash", "Shoe Cleaning"],
  carpenter: ["Furniture Repair", "Door Fitting", "Cabinet Work", "Wood Polish", "Bed Repair", "Table/Chair Repair"],
  helper: ["Shifting Help", "Grocery Shopping", "Bill Payment", "Queue Standing", "Package Delivery", "General Errands"],
};

type Step = "phone" | "otp" | "category" | "details" | "success";

export default function WorkerRegistration() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    area: "",
    description: "",
  });

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    // Simulate OTP send
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success("OTP sent to +91 " + phone);
    setStep("otp");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success("Phone verified successfully!");
    setStep("category");
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedAddOns([]);
    setStep("details");
  };

  const toggleAddOn = (addon: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.experience || !formData.area) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Validate description
    const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 40) {
      toast.error("Description must be 40 words or less");
      return;
    }
    
    // Check for phone numbers in description
    const phonePattern = /\d{10}|\d{5}\s?\d{5}/;
    if (phonePattern.test(formData.description)) {
      toast.error("Phone numbers are not allowed in description");
      return;
    }
    
    setIsLoading(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep("success");
  };

  const renderStep = () => {
    switch (step) {
      case "phone":
        return (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Mobile Number दर्ज करें</h2>
                <p className="text-sm text-muted-foreground mt-1">OTP से verify करें</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">+91</span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      className="pl-12"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleSendOTP}
                  disabled={isLoading || phone.length !== 10}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Send OTP
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        );

      case "otp":
        return (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">OTP Verify करें</h2>
                <p className="text-sm text-muted-foreground mt-1">+91 {phone} पर भेजा गया</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Verify OTP
                </Button>
                
                <button 
                  className="text-sm text-accent hover:underline w-full text-center"
                  onClick={() => setStep("phone")}
                >
                  Change Number
                </button>
              </div>
            </Card>
          </motion.div>
        );

      case "category":
        return (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Primary Service Category चुनें</h2>
                <p className="text-sm text-muted-foreground mt-1">एक बार चुनने के बाद बदला नहीं जा सकता</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="p-4 rounded-xl border-2 border-border hover:border-accent transition-all text-center group"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-2 group-hover:bg-accent group-hover:scale-110 transition-all">
                      <category.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                    </div>
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.nameHi}</p>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        );

      case "details":
        const currentCategory = serviceCategories.find(c => c.id === selectedCategory);
        const addOns = addOnsByCategory[selectedCategory] || [];
        const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;
        
        return (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep("category")} className="p-2 rounded-lg hover:bg-muted">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Profile Details</h2>
                  <Badge className="mt-1">{currentCategory?.name}</Badge>
                </div>
              </div>
              
              <div className="space-y-5">
                {/* Photo Upload */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                  </div>
                </div>
                
                {/* Name */}
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="आपका पूरा नाम"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>
                
                {/* Experience */}
                <div>
                  <Label htmlFor="experience">Experience (Years) *</Label>
                  <div className="relative mt-1.5">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="experience"
                      type="number"
                      placeholder="कितने साल का अनुभव"
                      className="pl-10"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    />
                  </div>
                </div>
                
                {/* Area */}
                <div>
                  <Label htmlFor="area">Working Area *</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="area"
                      placeholder="जैसे: Koramangala, Bangalore"
                      className="pl-10"
                      value={formData.area}
                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    />
                  </div>
                </div>
                
                {/* Add-on Services */}
                <div>
                  <Label>Add-on Services (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {addOns.map((addon) => (
                      <button
                        key={addon}
                        onClick={() => toggleAddOn(addon)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          selectedAddOns.includes(addon)
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-border hover:border-accent"
                        }`}
                      >
                        {addon}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <Label htmlFor="description">
                    अनुभव और कौशल (Max 40 words)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="अपने अनुभव और skills के बारे में लिखें..."
                    className="mt-1.5"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <p className={`text-xs mt-1 ${wordCount > 40 ? "text-destructive" : "text-muted-foreground"}`}>
                    {wordCount}/40 words
                  </p>
                </div>
                
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Submit for Verification
                </Button>
              </div>
            </Card>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 max-w-md mx-auto text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Registration Submitted!
              </h2>
              <p className="text-muted-foreground mb-6">
                आपकी profile verification के लिए submit हो गई है। 
                KYC complete करने के बाद profile live होगी।
              </p>
              
              <Badge variant="outline" className="gap-2 text-warning border-warning/30 mb-6">
                <Clock className="w-4 h-4" />
                Verification Pending
              </Badge>
              
              <Link to="/home-services/worker/kyc">
                <Button size="lg" className="w-full gap-2">
                  Complete KYC
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Join as Worker
            </h1>
            <p className="text-muted-foreground">
              RentPe पर register करें और regular earning करें
            </p>
          </motion.div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
