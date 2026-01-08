import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, Building2,
  Camera, CheckCircle, Calendar as CalendarIcon, Clock, FileCheck,
  AlertTriangle, IndianRupee, Home, Upload, Sparkles, Users
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  property_locality: string;
  property_address: string;
  property_type?: string;
  expected_rent?: number;
  bedrooms?: number;
}

interface AgentOnboardingModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  // Step 1: Owner Verification
  ownerVerified: boolean;
  idType: string;
  idNumber: string;
  ownershipProof: string;
  
  // Step 2: Property Details
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  rentAmount: number;
  depositAmount: number;
  amenities: string[];
  
  // Step 3: Visit & Photos
  visitDate?: Date;
  visitTime: string;
  livePhotos: string[];
  propertyCondition: string;
  
  // Step 4: Final Checklist
  checklist: { item: string; checked: boolean }[];
  notes: string;
}

type Step = "owner" | "property" | "visit" | "review";

const propertyAmenities = [
  "Power Backup", "Lift", "Security", "Parking", "Gym", 
  "Swimming Pool", "Garden", "Clubhouse", "CCTV", "Water Supply 24x7"
];

const verificationChecklist = [
  "Owner identity verified with valid ID",
  "Property ownership documents verified",
  "All rooms and amenities inspected",
  "Photos match actual property condition",
  "No pending legal issues with property",
  "Rent and deposit agreed with owner",
  "Move-in date flexibility confirmed",
  "Emergency contact collected",
];

export function AgentOnboardingModal({ lead, isOpen, onClose, onComplete }: AgentOnboardingModalProps) {
  const [step, setStep] = useState<Step>("owner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [data, setData] = useState<OnboardingData>({
    ownerVerified: false,
    idType: "",
    idNumber: "",
    ownershipProof: "",
    propertyType: lead.property_type || "2bhk",
    bedrooms: lead.bedrooms || 2,
    bathrooms: 1,
    furnishing: "semi_furnished",
    rentAmount: lead.expected_rent || 15000,
    depositAmount: (lead.expected_rent || 15000) * 2,
    amenities: [],
    visitTime: "10:00",
    livePhotos: [],
    propertyCondition: "good",
    checklist: verificationChecklist.map((item) => ({ item, checked: false })),
    notes: "",
  });

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: "owner", label: "Owner", icon: User },
    { id: "property", label: "Property", icon: Building2 },
    { id: "visit", label: "Visit", icon: Camera },
    { id: "review", label: "Review", icon: FileCheck },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const checkedCount = data.checklist.filter((c) => c.checked).length;

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

  const addMockPhoto = () => {
    const mockPhotos = [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400",
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setData({ ...data, livePhotos: [...data.livePhotos, randomPhoto] });
    toast.success("Photo captured!");
  };

  const toggleAmenity = (amenity: string) => {
    const amenities = data.amenities.includes(amenity)
      ? data.amenities.filter((a) => a !== amenity)
      : [...data.amenities, amenity];
    setData({ ...data, amenities });
  };

  const toggleChecklist = (index: number) => {
    const checklist = [...data.checklist];
    checklist[index].checked = !checklist[index].checked;
    setData({ ...data, checklist });
  };

  const handleSubmit = async () => {
    if (checkedCount < 6) {
      toast.error("Please complete at least 6 verification items");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    onComplete(data);
    toast.success("Owner onboarded successfully! Commission pending approval.");
  };

  const canProceed = () => {
    switch (step) {
      case "owner":
        return data.ownerVerified && data.idType && data.idNumber;
      case "property":
        return data.rentAmount > 0 && data.depositAmount > 0;
      case "visit":
        return data.livePhotos.length >= 2;
      case "review":
        return checkedCount >= 6;
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
            <DialogTitle className="text-lg font-display font-semibold">
              Quick Owner Onboarding
            </DialogTitle>
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              10% Commission
            </Badge>
          </div>
          
          {/* Lead Info */}
          <div className="flex items-center gap-3 p-3 bg-primary-foreground/10 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{lead.owner_name}</p>
              <p className="text-sm text-primary-foreground/70 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {lead.property_locality}
              </p>
            </div>
            <a href={`tel:${lead.owner_phone}`} className="p-2 bg-primary-foreground/20 rounded-lg hover:bg-primary-foreground/30 transition-colors">
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-1 mt-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <button
                  onClick={() => i <= currentStepIndex && setStep(s.id)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    i <= currentStepIndex
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary-foreground/20 text-primary-foreground/60"
                  )}
                >
                  <s.icon className="w-4 h-4" />
                </button>
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
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-220px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Owner Verification */}
            {step === "owner" && (
              <motion.div
                key="owner"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Owner Verification</h3>
                
                <Card className="p-4 bg-accent/5 border-accent/20">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={data.ownerVerified}
                      onCheckedChange={(checked) => setData({ ...data, ownerVerified: !!checked })}
                    />
                    <div>
                      <p className="font-medium text-foreground">Owner Identity Verified</p>
                      <p className="text-sm text-muted-foreground">I have physically met and verified the owner</p>
                    </div>
                  </label>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID Type</Label>
                    <Select value={data.idType} onValueChange={(v) => setData({ ...data, idType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving">Driving License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ID Number (Last 4 digits)</Label>
                    <Input
                      value={data.idNumber}
                      onChange={(e) => setData({ ...data, idNumber: e.target.value.slice(0, 4) })}
                      placeholder="XXXX"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ownership Proof</Label>
                  <Select value={data.ownershipProof} onValueChange={(v) => setData({ ...data, ownershipProof: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select proof type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registry">Property Registry</SelectItem>
                      <SelectItem value="agreement">Sale Agreement</SelectItem>
                      <SelectItem value="society">Society NOC</SelectItem>
                      <SelectItem value="tax">Property Tax Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Property Details */}
            {step === "property" && (
              <motion.div
                key="property"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Property Details</h3>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={data.propertyType} onValueChange={(v) => setData({ ...data, propertyType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1rk">1 RK</SelectItem>
                        <SelectItem value="1bhk">1 BHK</SelectItem>
                        <SelectItem value="2bhk">2 BHK</SelectItem>
                        <SelectItem value="3bhk">3 BHK</SelectItem>
                        <SelectItem value="4bhk">4 BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select value={String(data.bedrooms)} onValueChange={(v) => setData({ ...data, bedrooms: Number(v) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Select value={String(data.bathrooms)} onValueChange={(v) => setData({ ...data, bathrooms: Number(v) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Furnishing</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "fully_furnished", label: "Fully" },
                      { value: "semi_furnished", label: "Semi" },
                      { value: "unfurnished", label: "Unfurnished" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setData({ ...data, furnishing: opt.value })}
                        className={cn(
                          "p-3 rounded-lg border text-sm font-medium transition-all",
                          data.furnishing === opt.value
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border text-muted-foreground hover:border-accent/50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={data.rentAmount}
                        onChange={(e) => setData({ ...data, rentAmount: Number(e.target.value) })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Security Deposit (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={data.depositAmount}
                        onChange={(e) => setData({ ...data, depositAmount: Number(e.target.value) })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {propertyAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          data.amenities.includes(amenity)
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Visit & Photos */}
            {step === "visit" && (
              <motion.div
                key="visit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Property Visit & Photos</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Visit Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {data.visitDate ? format(data.visitDate, "PP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={data.visitDate}
                          onSelect={(date) => setData({ ...data, visitDate: date })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Visit Time</Label>
                    <Select value={data.visitTime} onValueChange={(v) => setData({ ...data, visitTime: v })}>
                      <SelectTrigger>
                        <Clock className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Live Photos (min. 2)</Label>
                    <span className="text-sm text-muted-foreground">{data.livePhotos.length} photos</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {data.livePhotos.map((photo, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                          onClick={() => setData({ ...data, livePhotos: data.livePhotos.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addMockPhoto}
                      className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-accent transition-colors"
                    >
                      <Camera className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Capture</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Property Condition</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "excellent", label: "Excellent", color: "text-success" },
                      { value: "good", label: "Good", color: "text-accent" },
                      { value: "fair", label: "Fair", color: "text-warning" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setData({ ...data, propertyCondition: opt.value })}
                        className={cn(
                          "p-3 rounded-lg border text-sm font-medium transition-all",
                          data.propertyCondition === opt.value
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border text-muted-foreground hover:border-accent/50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {data.livePhotos.length < 2 && (
                  <div className="p-3 bg-warning/10 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                    <p className="text-sm text-warning">Upload at least 2 live photos to proceed</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Final Review */}
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Final Verification</h3>
                  <Badge variant="outline" className={cn(
                    checkedCount >= 6 ? "border-success text-success" : "border-warning text-warning"
                  )}>
                    {checkedCount}/{data.checklist.length} Verified
                  </Badge>
                </div>

                <Card className="p-4 bg-accent/5 border-accent/20">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Property</p>
                      <p className="font-medium text-foreground">{data.propertyType.toUpperCase()}, {data.bedrooms}BR</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rent</p>
                      <p className="font-medium text-foreground">₹{data.rentAmount.toLocaleString()}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deposit</p>
                      <p className="font-medium text-foreground">₹{data.depositAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Your Commission</p>
                      <p className="font-medium text-success">₹{Math.round(data.rentAmount * 0.1).toLocaleString()}</p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {data.checklist.map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleChecklist(idx)}
                      />
                      <span className="text-sm text-foreground">{item.item}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={data.notes}
                    onChange={(e) => setData({ ...data, notes: e.target.value })}
                    placeholder="Any observations or special conditions..."
                    rows={2}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
          <Button variant="outline" onClick={currentStepIndex === 0 ? onClose : prevStep}>
            {currentStepIndex === 0 ? (
              "Cancel"
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </>
            )}
          </Button>

          {step === "review" ? (
            <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Onboarding
                </>
              )}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
