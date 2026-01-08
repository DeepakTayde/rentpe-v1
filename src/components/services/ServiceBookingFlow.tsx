import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, MapPin, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  rating: number;
  reviews: number;
}

interface ServiceBookingFlowProps {
  service: Service;
  onClose: () => void;
}

type Step = "details" | "schedule" | "confirm" | "success";

const timeSlots = [
  "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

const frequencyOptions = [
  { value: "once", label: "One Time", description: "Single service" },
  { value: "daily", label: "Daily", description: "Every day" },
  { value: "weekly", label: "Weekly", description: "Once a week" },
  { value: "monthly", label: "Monthly", description: "Once a month" },
];

export function ServiceBookingFlow({ service, onClose }: ServiceBookingFlowProps) {
  const [step, setStep] = useState<Step>("details");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    frequency: "once",
    date: undefined as Date | undefined,
    timeSlot: "",
    notes: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    setProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessing(false);
    setStep("success");
    toast.success("Service booked successfully!");
  };

  const canProceedToSchedule = formData.name && formData.phone && formData.address;
  const canProceedToConfirm = formData.date && formData.timeSlot;

  const calculatePrice = () => {
    const basePrice = service.priceFrom;
    switch (formData.frequency) {
      case "daily": return basePrice * 30;
      case "weekly": return basePrice * 4;
      case "monthly": return basePrice;
      default: return basePrice;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">Book {service.name}</h2>
            <p className="text-sm text-muted-foreground">Starting from ₹{service.priceFrom}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress */}
        {step !== "success" && (
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            {["details", "schedule", "confirm"].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step === s ? "bg-primary text-primary-foreground" :
                  ["details", "schedule", "confirm"].indexOf(step) > i ? "bg-accent text-accent-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                {i < 2 && <div className={cn(
                  "flex-1 h-1 mx-2 rounded-full",
                  ["details", "schedule", "confirm"].indexOf(step) > i ? "bg-accent" : "bg-muted"
                )} />}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" /> Your Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" /> Service Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Frequency</Label>
                  <RadioGroup
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                    className="grid grid-cols-2 gap-3"
                  >
                    {frequencyOptions.map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          formData.frequency === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        )}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <div>
                          <p className="font-medium text-foreground text-sm">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setStep("schedule")}
                  disabled={!canProceedToSchedule}
                >
                  Continue to Schedule
                </Button>
              </motion.div>
            )}

            {step === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="w-4 h-4" /> Select Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" /> Select Time Slot
                  </Label>
                  <Select
                    value={formData.timeSlot}
                    onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes" className="mb-2 block">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("details")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep("confirm")}
                    disabled={!canProceedToConfirm}
                    className="flex-1"
                  >
                    Review Booking
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="p-4 space-y-3">
                  <h3 className="font-semibold text-foreground">Booking Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium text-foreground">{service.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="text-foreground">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground">{formData.date && format(formData.date, "PPP")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground">{formData.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="text-foreground capitalize">{formData.frequency}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total Amount</span>
                      <span className="text-xl font-bold text-accent">₹{calculatePrice()}</span>
                    </div>
                    {formData.frequency !== "once" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed {formData.frequency === "daily" ? "monthly" : formData.frequency}
                      </p>
                    )}
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("schedule")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="flex-1"
                  >
                    {processing ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </motion.div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your {service.name} service has been scheduled for {formData.date && format(formData.date, "PPP")} at {formData.timeSlot}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  You will receive a confirmation SMS shortly.
                </p>
                <Button onClick={onClose} className="w-full">
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
