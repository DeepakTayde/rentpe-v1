import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  X, ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, Building2,
  Calendar as CalendarIcon, CreditCard, CheckCircle, FileText, 
  Download, Shield, Sparkles, IndianRupee, Home, Clock, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";

interface Property {
  id: string;
  title: string;
  address: string;
  locality: string;
  rentAmount: number;
  depositAmount: number;
  furnishing: string;
  bedrooms: number;
  bathrooms: number;
  ownerId: string;
  images?: string[];
  amenities?: string[];
  availableFrom?: string;
}

interface PropertyBookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type Step = "verify" | "details" | "agreement" | "payment" | "success";

export function PropertyBookingModal({ property, isOpen, onClose, onComplete }: PropertyBookingModalProps) {
  const { user, profile } = useAuth();
  const { createBooking } = useBookings();
  const [step, setStep] = useState<Step>("verify");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Verification step
  const [propertyVerified, setPropertyVerified] = useState(false);
  const [verificationChecks, setVerificationChecks] = useState({
    visitedProperty: false,
    verifiedAmenities: false,
    checkedLocality: false,
    agreedRent: false,
  });

  // Details step
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [tenantDetails, setTenantDetails] = useState({
    name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    occupation: "",
    emergencyContact: "",
    currentAddress: "",
    aadharLast4: "",
  });

  // Agreement step
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Payment step
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: "verify", label: "Verify", icon: Shield },
    { id: "details", label: "Details", icon: User },
    { id: "agreement", label: "Agreement", icon: FileText },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "success", label: "Done", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  const allVerificationsPassed = Object.values(verificationChecks).every(Boolean);
  const totalPayable = property.rentAmount + property.depositAmount;

  const nextStep = () => {
    const idx = currentStepIndex;
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1].id);
    }
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    if (idx > 0) {
      setStep(steps[idx - 1].id);
    }
  };

  const handleVerificationSubmit = () => {
    if (!allVerificationsPassed) {
      toast.error("Please complete all verification checks");
      return;
    }
    setPropertyVerified(true);
    nextStep();
  };

  const handleDetailsSubmit = () => {
    if (!tenantDetails.name || !tenantDetails.email || !tenantDetails.phone || !moveInDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (tenantDetails.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    nextStep();
  };

  const handleAgreementSubmit = () => {
    if (!agreementAccepted || !termsAccepted) {
      toast.error("Please accept the rental agreement and terms");
      return;
    }
    nextStep();
  };

  const handlePayment = async () => {
    if (!moveInDate || !user) {
      toast.error("Missing required information");
      return;
    }

    setIsProcessing(true);
    
    const { error } = await createBooking({
      property_id: property.id,
      owner_id: property.ownerId,
      move_in_date: format(moveInDate, "yyyy-MM-dd"),
      rent_amount: property.rentAmount,
      deposit_amount: property.depositAmount,
      tenant_name: tenantDetails.name,
      tenant_email: tenantDetails.email,
      tenant_phone: tenantDetails.phone,
      tenant_occupation: tenantDetails.occupation || undefined,
      emergency_contact: tenantDetails.emergencyContact || undefined,
    });

    setIsProcessing(false);

    if (error) {
      toast.error("Booking failed. Please try again.");
      return;
    }

    setStep("success");
    toast.success("Booking request submitted successfully!");
  };

  const canProceed = () => {
    switch (step) {
      case "verify":
        return allVerificationsPassed;
      case "details":
        return tenantDetails.name && tenantDetails.email && tenantDetails.phone && moveInDate;
      case "agreement":
        return agreementAccepted && termsAccepted;
      case "payment":
        return true;
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="gradient-primary p-5 text-primary-foreground">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-semibold">Book Property</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Property Summary */}
          <div className="flex gap-3 p-3 bg-primary-foreground/10 rounded-lg">
            {property.images?.[0] && (
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{property.title}</p>
              <p className="text-sm text-primary-foreground/70 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.locality}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm">₹{property.rentAmount.toLocaleString()}/mo</span>
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                  {property.bedrooms} BHK
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-1 mt-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all",
                  i <= currentStepIndex
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary-foreground/20 text-primary-foreground/60"
                )}>
                  <s.icon className="w-3.5 h-3.5" />
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-1",
                    i < currentStepIndex ? "bg-primary-foreground" : "bg-primary-foreground/20"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-240px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Property Verification */}
            {step === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-foreground">Property Verification</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Please confirm these checks before proceeding with your booking. This ensures a safe rental experience.
                </p>

                <div className="space-y-3">
                  {[
                    { key: "visitedProperty", label: "I have visited or scheduled a visit to this property", desc: "In-person verification is recommended" },
                    { key: "verifiedAmenities", label: "I have verified the listed amenities and condition", desc: "Ensure all amenities match the listing" },
                    { key: "checkedLocality", label: "I have checked the locality and surroundings", desc: "Including transport, markets, and safety" },
                    { key: "agreedRent", label: "I agree to the rent and deposit amounts", desc: `Rent: ₹${property.rentAmount.toLocaleString()} | Deposit: ₹${property.depositAmount.toLocaleString()}` },
                  ].map((item) => (
                    <Card 
                      key={item.key} 
                      className={cn(
                        "p-4 border-2 transition-all cursor-pointer",
                        verificationChecks[item.key as keyof typeof verificationChecks]
                          ? "border-success/50 bg-success/5"
                          : "border-border hover:border-accent/30"
                      )}
                      onClick={() => setVerificationChecks({
                        ...verificationChecks,
                        [item.key]: !verificationChecks[item.key as keyof typeof verificationChecks]
                      })}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                          checked={verificationChecks[item.key as keyof typeof verificationChecks]}
                          onCheckedChange={(checked) => setVerificationChecks({
                            ...verificationChecks,
                            [item.key]: !!checked
                          })}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </label>
                    </Card>
                  ))}
                </div>

                {!allVerificationsPassed && (
                  <div className="p-3 bg-warning/10 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                    <p className="text-sm text-warning">Complete all verification checks to proceed</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Tenant Details */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Your Details</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your full name"
                        value={tenantDetails.name}
                        onChange={(e) => setTenantDetails({ ...tenantDetails, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="10-digit phone"
                        value={tenantDetails.phone}
                        onChange={(e) => setTenantDetails({ ...tenantDetails, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={tenantDetails.email}
                      onChange={(e) => setTenantDetails({ ...tenantDetails, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Occupation</Label>
                    <Input
                      placeholder="e.g., Software Engineer"
                      value={tenantDetails.occupation}
                      onChange={(e) => setTenantDetails({ ...tenantDetails, occupation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Move-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start", !moveInDate && "text-muted-foreground")}>
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {moveInDate ? format(moveInDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={moveInDate}
                          onSelect={setMoveInDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact</Label>
                    <Input
                      placeholder="Name and phone number"
                      value={tenantDetails.emergencyContact}
                      onChange={(e) => setTenantDetails({ ...tenantDetails, emergencyContact: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Aadhaar (Last 4 digits)</Label>
                    <Input
                      placeholder="XXXX"
                      value={tenantDetails.aadharLast4}
                      onChange={(e) => setTenantDetails({ ...tenantDetails, aadharLast4: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      maxLength={4}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Agreement */}
            {step === "agreement" && (
              <motion.div
                key="agreement"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Rental Agreement</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                <div className="bg-muted rounded-xl p-4 max-h-64 overflow-y-auto text-sm">
                  <div className="space-y-3 text-muted-foreground">
                    <div className="text-center pb-3 border-b border-border">
                      <h4 className="text-base font-bold text-foreground">RESIDENTIAL RENTAL AGREEMENT</h4>
                      <p className="text-xs">Generated on {format(new Date(), "PPP")}</p>
                    </div>

                    <p><strong className="text-foreground">PARTIES:</strong></p>
                    <p><strong>Tenant:</strong> {tenantDetails.name || "[Tenant Name]"}</p>
                    <p><strong>Contact:</strong> {tenantDetails.phone || "[Phone]"} | {tenantDetails.email || "[Email]"}</p>

                    <p><strong className="text-foreground">PROPERTY:</strong></p>
                    <p><strong>Address:</strong> {property.address}</p>
                    <p><strong>Type:</strong> {property.bedrooms} BHK, {property.furnishing.replace("_", " ")}</p>

                    <p><strong className="text-foreground">FINANCIAL TERMS:</strong></p>
                    <p><strong>Monthly Rent:</strong> ₹{property.rentAmount.toLocaleString()}</p>
                    <p><strong>Security Deposit:</strong> ₹{property.depositAmount.toLocaleString()}</p>
                    <p><strong>Lease Start:</strong> {moveInDate ? format(moveInDate, "PPP") : "[Move-in Date]"}</p>
                    <p><strong>Lease Duration:</strong> 11 Months (Standard)</p>

                    <p><strong className="text-foreground">TERMS & CONDITIONS:</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Rent is due on or before the 5th of each month.</li>
                      <li>Late fee of ₹100/day after 5-day grace period.</li>
                      <li>Security deposit refunded within 30 days of termination.</li>
                      <li>No subletting without written consent.</li>
                      <li>Tenant responsible for utilities unless specified.</li>
                      <li>30 days written notice required for termination.</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-3">
                  <Card 
                    className={cn(
                      "p-4 border-2 transition-all cursor-pointer",
                      agreementAccepted ? "border-success/50 bg-success/5" : "border-border"
                    )}
                    onClick={() => setAgreementAccepted(!agreementAccepted)}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox checked={agreementAccepted} onCheckedChange={(c) => setAgreementAccepted(!!c)} className="mt-0.5" />
                      <p className="text-sm text-foreground">
                        I have read and agree to the <strong>Rental Agreement</strong> terms. I understand this is a legally binding document.
                      </p>
                    </label>
                  </Card>

                  <Card 
                    className={cn(
                      "p-4 border-2 transition-all cursor-pointer",
                      termsAccepted ? "border-success/50 bg-success/5" : "border-border"
                    )}
                    onClick={() => setTermsAccepted(!termsAccepted)}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(!!c)} className="mt-0.5" />
                      <p className="text-sm text-foreground">
                        I agree to RentPe's <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                      </p>
                    </label>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Payment</h3>

                <Card className="p-4 bg-accent/5 border-accent/20">
                  <h4 className="font-medium text-foreground mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Month Rent</span>
                      <span className="text-foreground">₹{property.rentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="text-foreground">₹{property.depositAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="text-success">₹0 (Waived)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-semibold">
                      <span className="text-foreground">Total Payable</span>
                      <span className="text-accent text-lg">₹{totalPayable.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "upi" as const, label: "UPI", icon: "📱" },
                      { id: "card" as const, label: "Card", icon: "💳" },
                      { id: "netbanking" as const, label: "Netbanking", icon: "🏦" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-center transition-all",
                          paymentMethod === method.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <span className="text-2xl block mb-1">{method.icon}</span>
                        <span className="text-sm font-medium text-foreground">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg flex items-start gap-2">
                  <Shield className="w-4 h-4 text-accent mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Your payment is secured with 256-bit SSL encryption. Money will be held safely until owner approves your booking.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">Booking Submitted!</h3>
                  <p className="text-muted-foreground mt-2">
                    Your booking request has been sent to the property owner. You'll receive a confirmation within 24-48 hours.
                  </p>
                </div>

                <Card className="p-4 bg-muted/50 text-left">
                  <h4 className="font-medium text-foreground mb-2">What's Next?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      Owner will review your application
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" />
                      You'll receive email updates on status
                    </li>
                    <li className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-accent" />
                      Once approved, prepare for move-in!
                    </li>
                  </ul>
                </Card>

                <div className="flex gap-3 justify-center pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Browse More Properties
                  </Button>
                  <Button onClick={onComplete}>
                    View My Bookings
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step !== "success" && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
            <Button variant="outline" onClick={currentStepIndex === 0 ? onClose : prevStep}>
              {currentStepIndex === 0 ? "Cancel" : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </>
              )}
            </Button>

            {step === "verify" && (
              <Button onClick={handleVerificationSubmit} disabled={!canProceed()}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {step === "details" && (
              <Button onClick={handleDetailsSubmit} disabled={!canProceed()}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {step === "agreement" && (
              <Button onClick={handleAgreementSubmit} disabled={!canProceed()}>
                Accept & Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {step === "payment" && (
              <Button onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? "Processing..." : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ₹{totalPayable.toLocaleString()}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
