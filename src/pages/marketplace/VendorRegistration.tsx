import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, User, MapPin, Package, ArrowRight, ArrowLeft,
  Phone, Mail, Building, Camera, Check, Shield, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

const vendorCategories = [
  { id: "furniture", name: "Furniture", nameHi: "फर्नीचर" },
  { id: "electronics", name: "Electronics", nameHi: "इलेक्ट्रॉनिक्स" },
  { id: "appliances", name: "Appliances", nameHi: "अप्लायंसेस" },
  { id: "mobility", name: "Mobility", nameHi: "मोबिलिटी" },
  { id: "tools", name: "Tools & Equipment", nameHi: "टूल्स" },
  { id: "delivery", name: "Delivery & Install", nameHi: "डिलीवरी" },
  { id: "repair", name: "Repair Services", nameHi: "रिपेयर" },
  { id: "cleaning", name: "Cleaning Services", nameHi: "क्लीनिंग" },
  { id: "relocation", name: "Relocation", nameHi: "रिलोकेशन" },
];

const steps = [
  { id: 1, title: "Mobile Verification", titleHi: "मोबाइल वेरिफिकेशन" },
  { id: 2, title: "Business Details", titleHi: "बिज़नेस डिटेल्स" },
  { id: 3, title: "Categories & Areas", titleHi: "कैटेगरी और एरिया" },
  { id: 4, title: "Review & Submit", titleHi: "रिव्यू और सबमिट" },
];

export default function VendorRegistration() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    businessName: "",
    ownerName: "",
    email: "",
    description: "",
    categories: [] as string[],
    serviceAreas: "",
    logo: null as File | null,
    agreeTerms: false,
  });

  const handleSendOTP = () => {
    if (formData.phone.length !== 10) {
      toast.error("कृपया valid 10-digit mobile number दर्ज करें");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast.success("OTP भेज दिया गया है");
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (formData.otp.length !== 6) {
      toast.error("कृपया 6-digit OTP दर्ज करें");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setOtpVerified(true);
      setIsLoading(false);
      toast.success("Mobile verified successfully!");
      setCurrentStep(2);
    }, 1500);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Registration submitted! KYC pending.");
      navigate("/marketplace/vendor/kyc");
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return otpVerified;
      case 2:
        return formData.businessName && formData.ownerName && formData.email;
      case 3:
        return formData.categories.length > 0 && formData.serviceAreas;
      case 4:
        return formData.agreeTerms;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Store className="w-3 h-3 mr-1" />
              Vendor Registration
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Become a RentPe Vendor
            </h1>
            <p className="text-muted-foreground mt-2">
              अपने प्रोडक्ट्स और सर्विसेज को लाखों customers तक पहुंचाएं
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep > step.id
                        ? "bg-green-600 text-white"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground hidden md:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-8 md:w-16 mx-2 rounded ${
                      currentStep > step.id ? "bg-green-600" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Step 1: Mobile Verification */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-primary" />
                      Mobile Verification
                    </CardTitle>
                    <CardDescription>मोबाइल नंबर से लॉगिन करें</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Mobile Number</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-muted rounded-lg">
                          <span className="text-sm">+91</span>
                        </div>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                          }
                          disabled={otpSent}
                          className="flex-1"
                        />
                        {!otpSent && (
                          <Button onClick={handleSendOTP} disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send OTP"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {otpSent && !otpVerified && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Enter OTP</Label>
                          <InputOTP
                            maxLength={6}
                            value={formData.otp}
                            onChange={(value) => setFormData({ ...formData, otp: value })}
                          >
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
                        <Button onClick={handleVerifyOTP} disabled={isLoading} className="w-full">
                          {isLoading ? "Verifying..." : "Verify OTP"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setOtpSent(false)}>
                          Change Number
                        </Button>
                      </div>
                    )}

                    {otpVerified && (
                      <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-700">Mobile verified successfully!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Business Details */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      Business Details
                    </CardTitle>
                    <CardDescription>अपने business की जानकारी दें</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Business / Store Name *</Label>
                      <Input
                        placeholder="e.g., Sharma Furniture House"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Owner Name *</Label>
                      <Input
                        placeholder="Enter your full name"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="business@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Business Description</Label>
                      <Textarea
                        placeholder="अपने business के बारे में बताएं (max 100 words)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Business Logo (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload logo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Categories & Areas */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Categories & Service Areas
                    </CardTitle>
                    <CardDescription>अपनी categories और service areas चुनें</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Select Categories (Multiple allowed)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {vendorCategories.map((category) => (
                          <div
                            key={category.id}
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                              formData.categories.includes(category.id)
                                ? "border-primary bg-primary/5"
                                : "border-muted hover:border-primary/50"
                            }`}
                          >
                            <p className="font-medium text-sm">{category.name}</p>
                            <p className="text-xs text-muted-foreground">{category.nameHi}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Areas *</Label>
                      <Textarea
                        placeholder="Enter localities/areas you serve (comma separated)&#10;e.g., Koramangala, HSR Layout, BTM Layout"
                        value={formData.serviceAreas}
                        onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Review & Submit
                    </CardTitle>
                    <CardDescription>अपनी details verify करें</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Business Name</span>
                        <span className="font-medium">{formData.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Owner Name</span>
                        <span className="font-medium">{formData.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mobile</span>
                        <span className="font-medium">+91 {formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categories</span>
                        <span className="font-medium">{formData.categories.length} selected</span>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">KYC Required</h4>
                          <p className="text-sm text-yellow-700">
                            Registration के बाद आपको Aadhaar, PAN और Bank details submit करने होंगे।
                            Profile KYC approval के बाद ही live होगी।
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreeTerms: checked as boolean })
                        }
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        मैं RentPe की{" "}
                        <Link to="#" className="text-primary underline">Terms & Conditions</Link>{" "}
                        और{" "}
                        <Link to="#" className="text-primary underline">Vendor Policy</Link>{" "}
                        से सहमत हूं। मैं समझता/समझती हूं कि platform के बाहर direct deal allowed नहीं है।
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed()}
                className="rounded-full ml-auto"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="rounded-full ml-auto"
              >
                {isLoading ? "Submitting..." : "Submit Registration"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
