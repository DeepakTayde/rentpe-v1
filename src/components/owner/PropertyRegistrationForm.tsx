import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { LocationPicker } from "@/components/ui/location-picker";
import { 
  Building, 
  User, 
  Mail, 
  MapPin, 
  IndianRupee, 
  CheckCircle, 
  Loader2,
  Home,
  BedDouble,
  Bath
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCities } from "@/hooks/useCities";
import { z } from "zod";

const formSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  ownerEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  propertyAddress: z.string().min(10, "Please enter a complete address"),
  propertyLocality: z.string().min(2, "Please enter the locality"),
  cityId: z.string().min(1, "Please select a city"),
  propertyType: z.string().min(1, "Please select a property type"),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  areaSqft: z.number().optional(),
  floorNumber: z.number().optional(),
  totalFloors: z.number().optional(),
  expectedRent: z.number().min(1000, "Please enter expected rent"),
  notes: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  phone: string;
}

export function PropertyRegistrationForm({ phone }: Props) {
  const navigate = useNavigate();
  const { data: cities } = useCities();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    ownerEmail: "",
    propertyAddress: "",
    propertyLocality: "",
    cityId: "",
    propertyType: "2bhk",
    bedrooms: 2,
    bathrooms: 1,
    areaSqft: undefined,
    floorNumber: undefined,
    totalFloors: undefined,
    expectedRent: 0,
    notes: "",
    latitude: undefined,
    longitude: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (field: keyof FormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
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
        owner_id: crypto.randomUUID(),
        owner_name: formData.ownerName,
        owner_phone: phone,
        owner_email: formData.ownerEmail || null,
        property_address: formData.propertyAddress,
        property_locality: formData.propertyLocality,
        city_id: formData.cityId,
        property_type: formData.propertyType,
        bedrooms: formData.bedrooms,
        expected_rent: formData.expectedRent,
        notes: formData.notes || null,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        images: images,
      }] as any);

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Property registered successfully!");
      
      setTimeout(() => {
        navigate("/owner/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to register property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Registration Successful!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          Your property has been registered. Our team will contact you within 24 hours.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard...
        </p>
      </motion.div>
    );
  }

  return (
    <Card className="bg-card border-border max-h-[80vh] overflow-y-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Property Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">Phone: +91 {phone}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Owner Details */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground text-sm">Your Details</h3>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your name"
                  value={formData.ownerName}
                  onChange={(e) => handleChange("ownerName", e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              {errors.ownerName && <p className="text-xs text-destructive mt-0.5">{errors.ownerName}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.ownerEmail}
                  onChange={(e) => handleChange("ownerEmail", e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          </div>

          {/* Property Location */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="font-medium text-foreground text-sm">Property Location</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">City *</label>
                <Select
                  value={formData.cityId}
                  onValueChange={(value) => handleChange("cityId", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map((city) => (
                      <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cityId && <p className="text-xs text-destructive mt-0.5">{errors.cityId}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Locality *</label>
                <Input
                  placeholder="e.g., Koramangala"
                  value={formData.propertyLocality}
                  onChange={(e) => handleChange("propertyLocality", e.target.value)}
                  className="h-9"
                />
                {errors.propertyLocality && <p className="text-xs text-destructive mt-0.5">{errors.propertyLocality}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Textarea
                  placeholder="Enter complete property address"
                  value={formData.propertyAddress}
                  onChange={(e) => handleChange("propertyAddress", e.target.value)}
                  className="pl-9 min-h-[60px] text-sm"
                />
              </div>
              {errors.propertyAddress && <p className="text-xs text-destructive mt-0.5">{errors.propertyAddress}</p>}
            </div>
          </div>

          {/* Location Picker */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="font-medium text-foreground text-sm">Exact Location (Optional)</h3>
            <LocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* Property Details */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="font-medium text-foreground text-sm">Property Details</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Type *</label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => {
                    handleChange("propertyType", value);
                    const bedroomMap: Record<string, number> = {
                      "1rk": 1, "1bhk": 1, "2bhk": 2, "3bhk": 3, "4bhk": 4, "villa": 4, "pg": 1
                    };
                    handleChange("bedrooms", bedroomMap[value] || 2);
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
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

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Expected Rent *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="25000"
                    value={formData.expectedRent || ""}
                    onChange={(e) => handleChange("expectedRent", parseInt(e.target.value) || 0)}
                    className="pl-9 h-9"
                  />
                </div>
                {errors.expectedRent && <p className="text-xs text-destructive mt-0.5">{errors.expectedRent}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                  <BedDouble className="w-3 h-3" /> Bedrooms
                </label>
                <Select
                  value={formData.bedrooms.toString()}
                  onValueChange={(value) => handleChange("bedrooms", parseInt(value))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                  <Bath className="w-3 h-3" /> Bathrooms
                </label>
                <Select
                  value={formData.bathrooms.toString()}
                  onValueChange={(value) => handleChange("bathrooms", parseInt(value))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                  <Home className="w-3 h-3" /> Area (sqft)
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={formData.areaSqft || ""}
                  onChange={(e) => handleChange("areaSqft", parseInt(e.target.value) || undefined)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Floor Number</label>
                <Input
                  type="number"
                  placeholder="e.g., 3"
                  value={formData.floorNumber || ""}
                  onChange={(e) => handleChange("floorNumber", parseInt(e.target.value) || undefined)}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Total Floors</label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.totalFloors || ""}
                  onChange={(e) => handleChange("totalFloors", parseInt(e.target.value) || undefined)}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="font-medium text-foreground text-sm">Property Photos (Optional)</h3>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              folder="property-leads"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Additional Notes</label>
            <Textarea
              placeholder="Any additional details..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="min-h-[50px] text-sm"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Registering...
              </>
            ) : (
              "Register Property"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
