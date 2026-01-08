import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { maintenanceCategories } from "@/data/mockData";
import { 
  Wrench, Zap, Hammer, Paintbrush, Wind, Bug, SprayCan, Clock,
  Camera, X, CheckCircle2, MapPin, Phone
} from "lucide-react";
import { toast } from "sonner";

const iconMap: { [key: string]: any } = { 
  Wrench, Zap, Hammer, Paintbrush, Wind, Bug, SprayCan,
  Refrigerator: Wind // fallback
};

export default function Maintenance() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "describe" | "confirm" | "tracking">("select");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const selectedCat = maintenanceCategories.find(c => c.id === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep("describe");
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error("Please describe your issue");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    toast.success("Maintenance request submitted! Technician on the way.");
    setStep("tracking");
  };

  const handleReset = () => {
    setStep("select");
    setSelectedCategory(null);
    setDescription("");
    setAddress("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Maintenance Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get help from verified technicians. Fast response, transparent pricing.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step 1: Select Category */}
            {step === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                  What do you need help with?
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {maintenanceCategories.map((category, index) => {
                    const Icon = iconMap[category.icon] || Wrench;
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          onClick={() => handleCategorySelect(category.id)}
                          className="p-6 cursor-pointer hover:shadow-lg hover:border-accent transition-all group text-center"
                        >
                          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                            <Icon className="w-7 h-7 text-accent group-hover:text-accent-foreground" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" />
                            {category.avgTime}
                          </p>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Describe Issue */}
            {step === "describe" && selectedCat && (
              <motion.div
                key="describe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg mx-auto"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = iconMap[selectedCat.icon] || Wrench;
                        return (
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-accent" />
                          </div>
                        );
                      })()}
                      <div>
                        <h3 className="font-semibold text-foreground">{selectedCat.name}</h3>
                        <p className="text-sm text-muted-foreground">Avg. time: {selectedCat.avgTime}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setStep("select")}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Describe the issue *
                      </label>
                      <Textarea
                        placeholder="E.g., Water leaking from kitchen sink pipe..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Property Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter your address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Add Photos (optional)
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload photos</p>
                      </div>
                    </div>

                    <Button onClick={handleSubmit} className="w-full" size="lg">
                      Continue
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === "confirm" && selectedCat && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg mx-auto"
              >
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                    Confirm Your Request
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium text-foreground">{selectedCat.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Est. Time</span>
                      <span className="font-medium text-foreground">{selectedCat.avgTime}</span>
                    </div>
                    <div className="py-3 border-b border-border">
                      <span className="text-muted-foreground block mb-1">Issue</span>
                      <span className="text-foreground">{description}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Est. Cost</span>
                      <span className="font-bold text-accent">₹299 - ₹999</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("describe")} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleConfirm} className="flex-1">
                      Confirm Request
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Tracking */}
            {step === "tracking" && selectedCat && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg mx-auto"
              >
                <Card className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    Technician Assigned!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your {selectedCat.name.toLowerCase()} expert is on the way
                  </p>

                  <div className="bg-muted rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-2xl">👨‍🔧</span>
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-foreground">Ramesh Kumar</p>
                        <p className="text-sm text-muted-foreground">4.8 ⭐ • 500+ jobs completed</p>
                        <p className="text-sm text-accent">Arriving in ~30 mins</p>
                      </div>
                      <Button size="icon" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    {["Assigned", "On the way", "Arrived", "Working", "Done"].map((status, i) => (
                      <div key={status} className="flex-1">
                        <div className={`h-2 rounded-full ${i < 2 ? "bg-accent" : "bg-muted"}`} />
                        <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{status}</p>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" onClick={handleReset} className="w-full">
                    Raise Another Request
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}