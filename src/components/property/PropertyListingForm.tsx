import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, MapPin, IndianRupee, Image, CheckCircle, 
  ArrowRight, ArrowLeft, Upload, X, Plus
} from "lucide-react";
import { cities } from "@/data/mockData";
import { toast } from "sonner";

interface PropertyFormData {
  // Basic Details
  propertyType: string;
  address: string;
  locality: string;
  cityId: string;
  floorNumber: string;
  totalFloors: string;
  furnishing: string;
  availableFrom: string;
  areaSqft: string;
  bedrooms: string;
  bathrooms: string;
  
  // Rent & Rules
  rentAmount: string;
  depositAmount: string;
  maintenanceCharges: string;
  rules: string[];
  
  // Amenities
  amenities: string[];
  
  // Images
  images: { url: string; type: string }[];
  
  // Description
  title: string;
  description: string;
}

const propertyTypes = [
  { value: "1rk", label: "1 RK" },
  { value: "1bhk", label: "1 BHK" },
  { value: "2bhk", label: "2 BHK" },
  { value: "3bhk", label: "3 BHK" },
  { value: "4bhk", label: "4 BHK" },
  { value: "villa", label: "Villa" },
  { value: "pg", label: "PG" },
];

const furnishingOptions = [
  { value: "fully_furnished", label: "Fully Furnished" },
  { value: "semi_furnished", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

const availableAmenities = [
  "Gym", "Swimming Pool", "Parking", "Security", "Power Backup",
  "Lift", "Garden", "Club House", "Children's Play Area", "WiFi",
  "AC", "Water Purifier", "Washing Machine", "Gas Pipeline",
];

const propertyRules = [
  "No Pets", "Pets Allowed", "Family Only", "Bachelors Allowed",
  "No Smoking", "Vegetarians Only", "Non-Veg Allowed",
];

const imageTypes = ["Bedroom", "Bathroom", "Kitchen", "Living Room", "Balcony", "Outside View"];

const steps = [
  { id: 1, title: "Basic Details", icon: Building2 },
  { id: 2, title: "Rent & Rules", icon: IndianRupee },
  { id: 3, title: "Images", icon: Image },
  { id: 4, title: "Review", icon: CheckCircle },
];

interface PropertyListingFormProps {
  onSubmit: (data: PropertyFormData) => void;
}

export function PropertyListingForm({ onSubmit }: PropertyListingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyType: "",
    address: "",
    locality: "",
    cityId: "",
    floorNumber: "",
    totalFloors: "",
    furnishing: "",
    availableFrom: "",
    areaSqft: "",
    bedrooms: "1",
    bathrooms: "1",
    rentAmount: "",
    depositAmount: "",
    maintenanceCharges: "",
    rules: [],
    amenities: [],
    images: [],
    title: "",
    description: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const updateFormData = (field: keyof PropertyFormData, value: string | string[] | { url: string; type: string }[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "rules" | "amenities", item: string) => {
    const currentItems = formData[field];
    const newItems = currentItems.includes(item)
      ? currentItems.filter((i) => i !== item)
      : [...currentItems, item];
    updateFormData(field, newItems);
  };

  const addImage = () => {
    const mockImageUrls = [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
    ];
    const randomImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    const unusedType = imageTypes.find((t) => !formData.images.some((i) => i.type === t)) || "Other";
    updateFormData("images", [...formData.images, { url: randomImage, type: unusedType }]);
    toast.success("Image uploaded successfully!");
  };

  const removeImage = (index: number) => {
    updateFormData("images", formData.images.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyType && formData.address && formData.locality && formData.cityId;
      case 2:
        return formData.rentAmount && formData.depositAmount;
      case 3:
        return formData.images.length >= 3;
      case 4:
        return formData.title;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 ${
                step.id === currentStep
                  ? "text-accent"
                  : step.id < currentStep
                  ? "text-success"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id === currentStep
                    ? "bg-accent text-accent-foreground"
                    : step.id < currentStep
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-display font-semibold text-foreground">Basic Details</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type *</Label>
                  <Select value={formData.propertyType} onValueChange={(v) => updateFormData("propertyType", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Select value={formData.cityId} onValueChange={(v) => updateFormData("cityId", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Complete Address *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Enter full address with landmarks"
                  rows={2}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Locality *</Label>
                  <Input
                    value={formData.locality}
                    onChange={(e) => updateFormData("locality", e.target.value)}
                    placeholder="e.g., Bandra West"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Furnishing</Label>
                  <Select value={formData.furnishing} onValueChange={(v) => updateFormData("furnishing", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      {furnishingOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Input
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) => updateFormData("floorNumber", e.target.value)}
                    placeholder="e.g., 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Floors</Label>
                  <Input
                    type="number"
                    value={formData.totalFloors}
                    onChange={(e) => updateFormData("totalFloors", e.target.value)}
                    placeholder="e.g., 12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData("bedrooms", e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData("bathrooms", e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Area (sq.ft)</Label>
                  <Input
                    type="number"
                    value={formData.areaSqft}
                    onChange={(e) => updateFormData("areaSqft", e.target.value)}
                    placeholder="e.g., 950"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available From</Label>
                  <Input
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => updateFormData("availableFrom", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-2">
                  {availableAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleArrayItem("amenities", amenity)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.amenities.includes(amenity)
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-display font-semibold text-foreground">Rent & Rules</h2>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Rent *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={formData.rentAmount}
                      onChange={(e) => updateFormData("rentAmount", e.target.value)}
                      className="pl-9"
                      placeholder="e.g., 45000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={formData.depositAmount}
                      onChange={(e) => updateFormData("depositAmount", e.target.value)}
                      className="pl-9"
                      placeholder="e.g., 90000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Maintenance (optional)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={formData.maintenanceCharges}
                      onChange={(e) => updateFormData("maintenanceCharges", e.target.value)}
                      className="pl-9"
                      placeholder="e.g., 3000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Property Rules</Label>
                <div className="flex flex-wrap gap-2">
                  {propertyRules.map((rule) => (
                    <button
                      key={rule}
                      type="button"
                      onClick={() => toggleArrayItem("rules", rule)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.rules.includes(rule)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {rule}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-semibold text-foreground">Upload Images</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Minimum 3 images required. Add images of bedroom, bathroom, kitchen, etc.
                  </p>
                </div>
                <span className={`text-sm font-medium ${formData.images.length >= 3 ? "text-success" : "text-warning"}`}>
                  {formData.images.length}/3 minimum
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.type}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="absolute bottom-2 left-2 text-xs bg-foreground/80 text-background px-2 py-0.5 rounded">
                      {image.type}
                    </span>
                  </div>
                ))}
                <button
                  onClick={addImage}
                  className="h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Photo</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {imageTypes.map((type) => {
                  const hasImage = formData.images.some((i) => i.type === type);
                  return (
                    <span
                      key={type}
                      className={`text-xs px-2 py-1 rounded-full ${
                        hasImage ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {type} {hasImage ? "✓" : ""}
                    </span>
                  );
                })}
              </div>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-display font-semibold text-foreground">Review & Submit</h2>
              
              <div className="space-y-2">
                <Label>Property Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="e.g., Spacious 2BHK with Sea View in Bandra West"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Describe your property..."
                  rows={4}
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Property Summary</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium text-foreground">
                      {propertyTypes.find((t) => t.value === formData.propertyType)?.label || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {formData.locality}, {cities.find((c) => c.id === formData.cityId)?.name || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Rent</p>
                    <p className="font-medium text-foreground">₹{formData.rentAmount || 0}/month</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Deposit</p>
                    <p className="font-medium text-foreground">₹{formData.depositAmount || 0}</p>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {formData.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={img.type}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button onClick={nextStep} disabled={!isStepValid()}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!isStepValid()}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit for Verification
          </Button>
        )}
      </div>
    </div>
  );
}
