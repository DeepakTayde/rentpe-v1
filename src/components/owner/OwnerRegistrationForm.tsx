import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building, User, Phone, Mail, MapPin, IndianRupee, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const formSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  ownerPhone: z.string().min(10, "Please enter a valid phone number"),
  ownerEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  propertyAddress: z.string().min(5, "Please enter a complete address"),
  propertyLocality: z.string().min(2, "Please enter the locality"),
  propertyType: z.string().min(1, "Please select a property type"),
  bedrooms: z.number().min(1, "Please select number of bedrooms"),
  expectedRent: z.number().min(1000, "Please enter expected rent"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function OwnerRegistrationForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    propertyAddress: "",
    propertyLocality: "",
    propertyType: "2bhk",
    bedrooms: 2,
    expectedRent: 0,
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      formSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("owner_leads").insert([{
        owner_id: user?.id || crypto.randomUUID(),
        owner_name: formData.ownerName,
        owner_phone: formData.ownerPhone,
        owner_email: formData.ownerEmail || null,
        property_address: formData.propertyAddress,
        property_locality: formData.propertyLocality,
        property_type: formData.propertyType,
        bedrooms: formData.bedrooms,
        expected_rent: formData.expectedRent,
        notes: formData.notes || null,
      }] as any);

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Registration submitted! An agent will contact you soon.");
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Thank You!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Your property registration has been submitted. One of our agents will contact you 
          within 24 hours to explain our guaranteed rent program.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Register Another Property
        </Button>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          List Your Property with RentPe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Owner Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Your Details</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your name"
                    value={formData.ownerName}
                    onChange={(e) => handleChange("ownerName", e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.ownerName && <p className="text-sm text-destructive mt-1">{errors.ownerName}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="10-digit phone number"
                    value={formData.ownerPhone}
                    onChange={(e) => handleChange("ownerPhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10"
                  />
                </div>
                {errors.ownerPhone && <p className="text-sm text-destructive mt-1">{errors.ownerPhone}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.ownerEmail}
                  onChange={(e) => handleChange("ownerEmail", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-foreground">Property Details</h3>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Property Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea
                  placeholder="Enter complete property address"
                  value={formData.propertyAddress}
                  onChange={(e) => handleChange("propertyAddress", e.target.value)}
                  className="pl-10 min-h-[80px]"
                />
              </div>
              {errors.propertyAddress && <p className="text-sm text-destructive mt-1">{errors.propertyAddress}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Locality *
                </label>
                <Input
                  placeholder="e.g., Koramangala, HSR Layout"
                  value={formData.propertyLocality}
                  onChange={(e) => handleChange("propertyLocality", e.target.value)}
                />
                {errors.propertyLocality && <p className="text-sm text-destructive mt-1">{errors.propertyLocality}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Property Type *
                </label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => {
                    handleChange("propertyType", value);
                    // Auto-set bedrooms based on type
                    const bedroomMap: Record<string, number> = {
                      "1rk": 1, "1bhk": 1, "2bhk": 2, "3bhk": 3, "4bhk": 4, "villa": 4, "pg": 1
                    };
                    handleChange("bedrooms", bedroomMap[value] || 2);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1rk">1 RK</SelectItem>
                    <SelectItem value="1bhk">1 BHK</SelectItem>
                    <SelectItem value="2bhk">2 BHK</SelectItem>
                    <SelectItem value="3bhk">3 BHK</SelectItem>
                    <SelectItem value="4bhk">4 BHK</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="pg">PG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Expected Monthly Rent *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="e.g., 25000"
                  value={formData.expectedRent || ""}
                  onChange={(e) => handleChange("expectedRent", parseInt(e.target.value) || 0)}
                  className="pl-10"
                />
              </div>
              {errors.expectedRent && <p className="text-sm text-destructive mt-1">{errors.expectedRent}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Additional Notes (Optional)
              </label>
              <Textarea
                placeholder="Any additional details about the property..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Property for Guaranteed Rent"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to be contacted by our agents regarding your property listing.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
