import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  X, ArrowRight, ArrowLeft, Camera, CheckCircle, AlertTriangle,
  Wrench, Zap, Droplets, Wind, Shield, Bug, Paintbrush, Tv,
  Home, Clock, Upload, Sparkles, Phone, Calendar
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MaintenanceTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (ticket: TicketData) => void;
  propertyId?: string;
  propertyTitle?: string;
}

interface TicketData {
  category: string;
  subcategory: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  photos: string[];
  preferredDate?: string;
  preferredTime?: string;
  contactPhone: string;
}

type Step = "category" | "details" | "photos" | "confirm";

const categories = [
  { id: "plumbing", label: "Plumbing", icon: Droplets, color: "text-blue-500", subcategories: ["Leaking tap", "Clogged drain", "Low water pressure", "Toilet issues", "Pipe burst", "Other"] },
  { id: "electrical", label: "Electrical", icon: Zap, color: "text-yellow-500", subcategories: ["Power outage", "Faulty switch", "Flickering lights", "Short circuit", "Wiring issue", "Other"] },
  { id: "hvac", label: "AC/Heating", icon: Wind, color: "text-cyan-500", subcategories: ["AC not cooling", "Heating not working", "Strange noise", "Gas smell", "Thermostat issue", "Other"] },
  { id: "appliances", label: "Appliances", icon: Tv, color: "text-purple-500", subcategories: ["Refrigerator", "Washing machine", "Geyser", "Microwave", "Chimney", "Other"] },
  { id: "structural", label: "Structural", icon: Home, color: "text-orange-500", subcategories: ["Wall crack", "Ceiling leak", "Door/window", "Floor damage", "Dampness", "Other"] },
  { id: "pest", label: "Pest Control", icon: Bug, color: "text-red-500", subcategories: ["Cockroaches", "Ants", "Termites", "Rodents", "Mosquitoes", "Other"] },
  { id: "painting", label: "Painting", icon: Paintbrush, color: "text-pink-500", subcategories: ["Wall paint", "Ceiling paint", "Touch-up", "Full repaint", "Other"] },
  { id: "security", label: "Security", icon: Shield, color: "text-green-500", subcategories: ["Door lock", "Window lock", "Intercom", "CCTV", "Other"] },
];

const priorities = [
  { id: "low" as const, label: "Low", desc: "Can wait a few days", color: "bg-muted text-muted-foreground" },
  { id: "medium" as const, label: "Medium", desc: "Within 48 hours", color: "bg-warning/20 text-warning" },
  { id: "high" as const, label: "High", desc: "Within 24 hours", color: "bg-orange-500/20 text-orange-500" },
  { id: "urgent" as const, label: "Urgent", desc: "Immediate attention", color: "bg-destructive/20 text-destructive" },
];

export function MaintenanceTicketModal({ isOpen, onClose, onComplete, propertyTitle }: MaintenanceTicketModalProps) {
  const [step, setStep] = useState<Step>("category");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [ticket, setTicket] = useState<TicketData>({
    category: "",
    subcategory: "",
    priority: "medium",
    title: "",
    description: "",
    photos: [],
    contactPhone: "",
  });

  const steps: { id: Step; label: string }[] = [
    { id: "category", label: "Category" },
    { id: "details", label: "Details" },
    { id: "photos", label: "Photos" },
    { id: "confirm", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const selectedCategory = categories.find((c) => c.id === ticket.category);

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
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setTicket({ ...ticket, photos: [...ticket.photos, randomPhoto] });
    toast.success("Photo added!");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onComplete(ticket);
    toast.success("Maintenance request submitted! We'll contact you shortly.");
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case "category":
        return ticket.category && ticket.subcategory;
      case "details":
        return ticket.title && ticket.description && ticket.contactPhone;
      case "photos":
        return true;
      case "confirm":
        return true;
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="gradient-primary p-5 text-primary-foreground">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Maintenance Request
            </h2>
            <button onClick={onClose} className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {propertyTitle && (
            <p className="text-sm text-primary-foreground/70">{propertyTitle}</p>
          )}

          {/* Progress */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  i <= currentStepIndex
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary-foreground/20 text-primary-foreground/60"
                )}>
                  {i + 1}
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
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Category Selection */}
            {step === "category" && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">What needs fixing?</h3>
                
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTicket({ ...ticket, category: cat.id, subcategory: "" })}
                      className={cn(
                        "p-3 rounded-xl border-2 text-center transition-all",
                        ticket.category === cat.id
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      )}
                    >
                      <cat.icon className={cn("w-6 h-6 mx-auto mb-1", cat.color)} />
                      <span className="text-xs font-medium text-foreground">{cat.label}</span>
                    </button>
                  ))}
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <Label>Specific Issue</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setTicket({ ...ticket, subcategory: sub })}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                            ticket.subcategory === sub
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">Describe the issue</h3>

                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setTicket({ ...ticket, priority: p.id })}
                        className={cn(
                          "p-2 rounded-lg border-2 text-center transition-all",
                          ticket.priority === p.id
                            ? "border-accent"
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <Badge className={cn("mb-1", p.color)}>{p.label}</Badge>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Issue Title *</Label>
                  <Input
                    value={ticket.title}
                    onChange={(e) => setTicket({ ...ticket, title: e.target.value })}
                    placeholder={`e.g., ${ticket.subcategory || "Describe the issue briefly"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={ticket.description}
                    onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                    placeholder="Please describe the issue in detail. When did it start? How severe is it?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={ticket.contactPhone}
                      onChange={(e) => setTicket({ ...ticket, contactPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      placeholder="10-digit phone"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Input
                      type="date"
                      value={ticket.preferredDate || ""}
                      onChange={(e) => setTicket({ ...ticket, preferredDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Time</Label>
                    <Input
                      type="time"
                      value={ticket.preferredTime || ""}
                      onChange={(e) => setTicket({ ...ticket, preferredTime: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Photos */}
            {step === "photos" && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Add Photos</h3>
                  <span className="text-sm text-muted-foreground">{ticket.photos.length} photos</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Photos help our technicians understand and prepare for the issue better.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {ticket.photos.map((photo, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                      <button
                        onClick={() => setTicket({ ...ticket, photos: ticket.photos.filter((_, i) => i !== idx) })}
                        className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {ticket.photos.length < 5 && (
                    <button
                      onClick={addMockPhoto}
                      className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-accent transition-colors"
                    >
                      <Camera className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                    </button>
                  )}
                </div>

                <Card className="p-3 bg-accent/5 border-accent/20">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-accent mt-0.5" />
                    Tip: Take clear photos showing the exact problem area for faster resolution
                  </p>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">Review Request</h3>

                <Card className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {selectedCategory && (
                      <div className={cn("p-2 rounded-lg bg-muted")}>
                        <selectedCategory.icon className={cn("w-5 h-5", selectedCategory.color)} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground">{selectedCategory?.label} • {ticket.subcategory}</p>
                    </div>
                    <Badge className={cn("ml-auto", priorities.find(p => p.id === ticket.priority)?.color)}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  </div>

                  {ticket.photos.length > 0 && (
                    <div className="flex gap-2 pt-3 border-t border-border">
                      {ticket.photos.map((photo, idx) => (
                        <img key={idx} src={photo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border text-sm">
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium text-foreground">{ticket.contactPhone}</p>
                    </div>
                    {ticket.preferredDate && (
                      <div>
                        <p className="text-muted-foreground">Preferred Time</p>
                        <p className="font-medium text-foreground">
                          {ticket.preferredDate} {ticket.preferredTime && `at ${ticket.preferredTime}`}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-3 bg-success/10 border-success/20">
                  <p className="text-sm text-success flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Expected response within {ticket.priority === "urgent" ? "2 hours" : ticket.priority === "high" ? "24 hours" : "48 hours"}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
          <Button variant="outline" onClick={currentStepIndex === 0 ? onClose : prevStep}>
            {currentStepIndex === 0 ? "Cancel" : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </>
            )}
          </Button>

          {step === "confirm" ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Request
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
