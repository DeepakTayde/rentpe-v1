import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, FileText, CreditCard, CheckCircle2, ArrowRight, ArrowLeft,
  Download, User, MapPin, Phone, Mail, X
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
}

interface BookingFlowProps {
  property: Property;
  onClose: () => void;
  onComplete: () => void;
}

type Step = "details" | "agreement" | "payment" | "success";

export function BookingFlowWithDB({ property, onClose, onComplete }: BookingFlowProps) {
  const { user, profile } = useAuth();
  const { createBooking } = useBookings();
  const [step, setStep] = useState<Step>("details");
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [tenantDetails, setTenantDetails] = useState({
    name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    occupation: "",
    emergencyContact: "",
  });
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDetailsSubmit = () => {
    if (!tenantDetails.name || !tenantDetails.email || !tenantDetails.phone || !moveInDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("agreement");
  };

  const handleAgreementAccept = () => {
    if (!agreementAccepted) {
      toast.error("Please accept the rental agreement to continue");
      return;
    }
    setStep("payment");
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
    toast.success("Booking confirmed! The owner will review your request.");
  };

  const totalPayable = property.rentAmount + property.depositAmount;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl my-8"
      >
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="gradient-primary p-6 text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">Book Property</h2>
              <button onClick={onClose} className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-primary-foreground/80">{property.title}</p>
            <p className="text-sm text-primary-foreground/60 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {property.address}
            </p>

            {/* Steps Indicator */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { id: "details", label: "Details", icon: User },
                { id: "agreement", label: "Agreement", icon: FileText },
                { id: "payment", label: "Payment", icon: CreditCard },
                { id: "success", label: "Done", icon: CheckCircle2 },
              ].map((s, i) => (
                <div key={s.id} className="flex-1 flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s.id || ["details", "agreement", "payment", "success"].indexOf(step) > i
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary-foreground/20 text-primary-foreground/60"
                  )}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  {i < 3 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-2",
                      ["details", "agreement", "payment", "success"].indexOf(step) > i
                        ? "bg-primary-foreground"
                        : "bg-primary-foreground/20"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Details */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">Your Details</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
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
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="10-digit phone number"
                          value={tenantDetails.phone}
                          onChange={(e) => setTenantDetails({ ...tenantDetails, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
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
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Occupation</label>
                      <Input
                        placeholder="e.g., Software Engineer"
                        value={tenantDetails.occupation}
                        onChange={(e) => setTenantDetails({ ...tenantDetails, occupation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Move-in Date *</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !moveInDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {moveInDate ? format(moveInDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={moveInDate}
                            onSelect={setMoveInDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Emergency Contact</label>
                    <Input
                      placeholder="Name and phone number"
                      value={tenantDetails.emergencyContact}
                      onChange={(e) => setTenantDetails({ ...tenantDetails, emergencyContact: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleDetailsSubmit}>
                      Continue to Agreement
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Agreement */}
              {step === "agreement" && (
                <motion.div
                  key="agreement"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Rental Agreement</h3>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  <div className="bg-muted rounded-xl p-4 mb-6 max-h-[400px] overflow-y-auto text-sm">
                    <div className="space-y-4 text-muted-foreground">
                      <div className="text-center pb-4 border-b border-border">
                        <h4 className="text-lg font-bold text-foreground">RESIDENTIAL RENTAL AGREEMENT</h4>
                        <p className="text-xs">Generated on {format(new Date(), "PPP")}</p>
                      </div>

                      <p><strong className="text-foreground">PARTIES:</strong></p>
                      <p>This Rental Agreement is entered between:</p>
                      <p><strong>Landlord:</strong> Property Owner (via RentPe Platform)</p>
                      <p><strong>Tenant:</strong> {tenantDetails.name || "[Tenant Name]"}</p>
                      <p><strong>Contact:</strong> {tenantDetails.phone || "[Phone]"} | {tenantDetails.email || "[Email]"}</p>

                      <p><strong className="text-foreground">PROPERTY DETAILS:</strong></p>
                      <p><strong>Address:</strong> {property.address}</p>
                      <p><strong>Property Type:</strong> {property.bedrooms} BHK, {property.furnishing.replace("_", " ")}</p>

                      <p><strong className="text-foreground">FINANCIAL TERMS:</strong></p>
                      <p><strong>Monthly Rent:</strong> ₹{property.rentAmount.toLocaleString()}</p>
                      <p><strong>Security Deposit:</strong> ₹{property.depositAmount.toLocaleString()}</p>
                      <p><strong>Lease Start:</strong> {moveInDate ? format(moveInDate, "PPP") : "[Move-in Date]"}</p>
                      <p><strong>Lease Duration:</strong> 11 Months (Standard)</p>

                      <p><strong className="text-foreground">TERMS & CONDITIONS:</strong></p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Rent is due on or before the 5th of each month.</li>
                        <li>A late fee of ₹100 per day will be charged after the grace period of 5 days.</li>
                        <li>The security deposit will be refunded within 30 days of lease termination.</li>
                        <li>Tenant shall not sublet the property without written consent.</li>
                        <li>Tenant is responsible for utility payments unless otherwise specified.</li>
                        <li>Major repairs are the landlord's responsibility.</li>
                        <li>Either party may terminate with 30 days written notice.</li>
                        <li>The property shall be used for residential purposes only.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-xl mb-6">
                    <Checkbox
                      id="agreement"
                      checked={agreementAccepted}
                      onCheckedChange={(checked) => setAgreementAccepted(checked as boolean)}
                    />
                    <label htmlFor="agreement" className="text-sm text-foreground cursor-pointer">
                      I have read and agree to the Rental Agreement terms. I understand this is a legally binding document.
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("details")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleAgreementAccept} disabled={!agreementAccepted}>
                      Accept & Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">Payment</h3>

                  {/* Payment Summary */}
                  <Card className="p-4 mb-6 bg-muted/50">
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
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="text-success">₹0 (Waived)</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border font-semibold">
                        <span className="text-foreground">Total Payable</span>
                        <span className="text-accent text-lg">₹{totalPayable.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Payment Method Selection */}
                  <h4 className="font-medium text-foreground mb-3">Select Payment Method</h4>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: "upi" as const, label: "UPI", icon: "📱" },
                      { id: "card" as const, label: "Card", icon: "💳" },
                      { id: "netbanking" as const, label: "Net Banking", icon: "🏦" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all text-center",
                          paymentMethod === method.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <span className="text-2xl block mb-1">{method.icon}</span>
                        <span className="text-sm font-medium text-foreground">{method.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("agreement")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          Pay ₹{totalPayable.toLocaleString()}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    Booking Request Sent!
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Your booking request has been sent to the property owner. 
                    They will review and respond within 24-48 hours.
                  </p>
                  <Button onClick={onComplete} size="lg">
                    Go to Dashboard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
