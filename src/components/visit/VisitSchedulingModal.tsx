import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  X, ArrowRight, ArrowLeft, CheckCircle, MapPin, Clock,
  User, Phone, Mail, CalendarDays, Star, Building2, Home
} from "lucide-react";
import { toast } from "sonner";
import { format, addDays, isSameDay, isWeekend } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Property {
  id: string;
  title: string;
  locality: string;
  address: string;
  rentAmount: number;
  bedrooms: number;
  images?: string[];
}

interface Agent {
  id: string;
  name: string;
  phone: string;
  rating: number;
  completedVisits: number;
  avatar?: string;
  availableSlots: { date: Date; times: string[] }[];
}

interface VisitSchedulingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (visit: VisitData) => void;
}

interface VisitData {
  propertyId: string;
  date: Date;
  time: string;
  agentId: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail: string;
  notes: string;
}

type Step = "date" | "time" | "agent" | "details" | "confirm";

// Mock agents data
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phone: "9876543210",
    rating: 4.8,
    completedVisits: 156,
    availableSlots: [],
  },
  {
    id: "2",
    name: "Priya Sharma",
    phone: "9876543211",
    rating: 4.9,
    completedVisits: 203,
    availableSlots: [],
  },
  {
    id: "3",
    name: "Amit Patel",
    phone: "9876543212",
    rating: 4.7,
    completedVisits: 98,
    availableSlots: [],
  },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

export function VisitSchedulingModal({ property, isOpen, onClose, onComplete }: VisitSchedulingModalProps) {
  const { profile } = useAuth();
  const [step, setStep] = useState<Step>("date");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [visit, setVisit] = useState<Partial<VisitData>>({
    propertyId: property.id,
    visitorName: profile?.full_name || "",
    visitorPhone: profile?.phone || "",
    visitorEmail: profile?.email || "",
    notes: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedAgent, setSelectedAgent] = useState<Agent>();

  const steps: { id: Step; label: string }[] = [
    { id: "date", label: "Date" },
    { id: "time", label: "Time" },
    { id: "agent", label: "Agent" },
    { id: "details", label: "Details" },
    { id: "confirm", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  // Generate available dates (next 14 days, excluding past dates)
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Get available times based on selected date
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    // Simulate some slots being unavailable
    const dayOfWeek = selectedDate.getDay();
    if (isWeekend(selectedDate)) {
      return timeSlots.filter((_, i) => i >= 2 && i <= 6); // Limited weekend hours
    }
    return timeSlots;
  }, [selectedDate]);

  // Assign available agents based on date/time
  const availableAgents = useMemo(() => {
    return mockAgents.map((agent) => ({
      ...agent,
      isAvailable: Math.random() > 0.2, // 80% availability
    }));
  }, [selectedDate, selectedTime]);

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

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedAgent) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    const visitData: VisitData = {
      propertyId: property.id,
      date: selectedDate,
      time: selectedTime,
      agentId: selectedAgent.id,
      visitorName: visit.visitorName || "",
      visitorPhone: visit.visitorPhone || "",
      visitorEmail: visit.visitorEmail || "",
      notes: visit.notes || "",
    };

    onComplete(visitData);
    toast.success(`Visit scheduled for ${format(selectedDate, "PPP")} at ${selectedTime}`);
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case "date":
        return !!selectedDate;
      case "time":
        return !!selectedTime;
      case "agent":
        return !!selectedAgent;
      case "details":
        return visit.visitorName && visit.visitorPhone;
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
              <CalendarDays className="w-5 h-5" />
              Schedule Visit
            </h2>
            <button onClick={onClose} className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Property Summary */}
          <div className="flex gap-3 p-3 bg-primary-foreground/10 rounded-lg">
            {property.images?.[0] && (
              <img src={property.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{property.title}</p>
              <p className="text-sm text-primary-foreground/70 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.locality}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-1 mt-4">
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
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-220px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Date Selection */}
            {step === "date" && (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">Select a Date</h3>
                
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date > addDays(today, 14);
                  }}
                  className="rounded-lg border mx-auto pointer-events-auto"
                />

                {selectedDate && (
                  <Card className="p-3 bg-accent/5 border-accent/20">
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-accent" />
                      Selected: <strong>{format(selectedDate, "EEEE, MMMM d, yyyy")}</strong>
                    </p>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Step 2: Time Selection */}
            {step === "time" && (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">Select a Time Slot</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d")}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "p-3 rounded-lg border-2 text-center transition-all",
                        selectedTime === time
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent/50 text-foreground"
                      )}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-sm font-medium">{time}</span>
                    </button>
                  ))}
                </div>

                {availableTimes.length === 0 && (
                  <Card className="p-4 bg-warning/10 border-warning/20 text-center">
                    <p className="text-sm text-warning">No available slots for this date. Please select another date.</p>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Step 3: Agent Selection */}
            {step === "agent" && (
              <motion.div
                key="agent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">Choose an Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Select an agent to accompany you during the property visit
                </p>

                <div className="space-y-3">
                  {availableAgents.map((agent) => (
                    <Card
                      key={agent.id}
                      onClick={() => agent.isAvailable && setSelectedAgent(agent)}
                      className={cn(
                        "p-4 cursor-pointer transition-all",
                        !agent.isAvailable && "opacity-50 cursor-not-allowed",
                        selectedAgent?.id === agent.id
                          ? "border-2 border-accent bg-accent/5"
                          : "border hover:border-accent/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground font-semibold">
                          {agent.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{agent.name}</p>
                            {!agent.isAvailable && (
                              <Badge variant="outline" className="text-xs">Unavailable</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-warning fill-warning" />
                              {agent.rating}
                            </span>
                            <span>{agent.completedVisits} visits</span>
                          </div>
                        </div>
                        {selectedAgent?.id === agent.id && (
                          <CheckCircle className="w-5 h-5 text-accent" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Visitor Details */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">Your Details</h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={visit.visitorName}
                        onChange={(e) => setVisit({ ...visit, visitorName: e.target.value })}
                        placeholder="Enter your name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={visit.visitorPhone}
                        onChange={(e) => setVisit({ ...visit, visitorPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        placeholder="10-digit phone"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={visit.visitorEmail}
                        onChange={(e) => setVisit({ ...visit, visitorEmail: e.target.value })}
                        placeholder="your@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Special Requests (Optional)</Label>
                    <Textarea
                      value={visit.notes}
                      onChange={(e) => setVisit({ ...visit, notes: e.target.value })}
                      placeholder="Any specific areas you want to check, questions for the agent, etc."
                      rows={2}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-foreground">Confirm Visit</h3>

                <Card className="p-4 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <Building2 className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">
                        {selectedDate && format(selectedDate, "EEE, MMM d")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-medium text-foreground">{selectedTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Agent</p>
                      <p className="font-medium text-foreground">{selectedAgent?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Your Phone</p>
                      <p className="font-medium text-foreground">{visit.visitorPhone}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-3 bg-success/10 border-success/20">
                  <p className="text-sm text-success flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Free property visit • No charges
                  </p>
                </Card>

                <Card className="p-3 bg-muted">
                  <p className="text-xs text-muted-foreground">
                    By scheduling this visit, you agree to our terms. The agent will call you 30 minutes before the scheduled time.
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
              {isSubmitting ? "Scheduling..." : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Visit
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
