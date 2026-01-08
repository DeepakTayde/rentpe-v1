import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createNotification } from "@/contexts/NotificationContext";
import { PropertyListingForm } from "@/components/property/PropertyListingForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft, CheckCircle, Clock, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function AddProperty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [submitted, setSubmitted] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    // Simulate property creation
    const newPropertyId = `prop_${Date.now()}`;
    setPropertyId(newPropertyId);
    setSubmitted(true);
    
    // Add notification via database
    if (user?.id) {
      await createNotification(
        user.id,
        "property",
        "Property Submitted",
        `Your property "${data.title}" has been submitted for verification. An agent will visit soon.`,
        { property_id: newPropertyId },
        "/owner/dashboard"
      );
    }
    
    toast.success("Property submitted for verification!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container py-4 flex items-center gap-4">
            <Link to="/owner" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Rent<span className="text-accent">Pe</span>
              </span>
            </div>
          </div>
        </header>

        <main className="container py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            
            <h1 className="text-2xl font-display font-bold text-foreground mb-3">
              Property Submitted!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your property has been submitted for verification. Our agent will visit within 24-48 hours.
            </p>

            <Card className="p-6 text-left mb-8">
              <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Agent Assignment</p>
                    <p className="text-sm text-muted-foreground">An agent will be assigned within 2 hours</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Property Visit</p>
                    <p className="text-sm text-muted-foreground">Agent visits to verify property details</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Go Live</p>
                    <p className="text-sm text-muted-foreground">Once verified, your property is visible to tenants</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/owner/properties">View My Properties</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/owner">Go to Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Link to="/owner" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Rent<span className="text-accent">Pe</span>
            </span>
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground">
            List Your Property
          </h1>
          <p className="text-muted-foreground">
            Fill in the details to list your property on RentPe
          </p>
        </motion.div>

        <PropertyListingForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
