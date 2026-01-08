import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, CheckCircle, MapPin, Building2, FileText, Upload,
  ArrowRight, ArrowLeft, X, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface VerificationData {
  addressVerified: boolean;
  ownershipVerified: boolean;
  imagesMatch: boolean;
  conditionGood: boolean;
  livePhotos: string[];
  notes: string;
  checklist: {
    item: string;
    checked: boolean;
  }[];
}

const verificationChecklist = [
  "Property address matches listing",
  "Owner documents verified",
  "All rooms inspected",
  "Amenities as described",
  "No structural issues",
  "Clean and habitable",
  "Utilities working",
  "Building security verified",
];

interface PropertyVerificationFlowProps {
  property: {
    id: string;
    title: string;
    address: string;
    locality: string;
    ownerName?: string;
    images: string[];
  };
  onComplete: (approved: boolean, data: VerificationData) => void;
  onClose: () => void;
}

export function PropertyVerificationFlow({ property, onComplete, onClose }: PropertyVerificationFlowProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<VerificationData>({
    addressVerified: false,
    ownershipVerified: false,
    imagesMatch: false,
    conditionGood: false,
    livePhotos: [],
    notes: "",
    checklist: verificationChecklist.map((item) => ({ item, checked: false })),
  });

  const progress = (step / 3) * 100;
  const checkedCount = data.checklist.filter((c) => c.checked).length;
  const allChecked = checkedCount === data.checklist.length;

  const addLivePhoto = () => {
    const mockPhotos = [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setData({ ...data, livePhotos: [...data.livePhotos, randomPhoto] });
    toast.success("Photo captured!");
  };

  const removeLivePhoto = (index: number) => {
    setData({ ...data, livePhotos: data.livePhotos.filter((_, i) => i !== index) });
  };

  const toggleChecklistItem = (index: number) => {
    const newChecklist = [...data.checklist];
    newChecklist[index].checked = !newChecklist[index].checked;
    setData({ ...data, checklist: newChecklist });
  };

  const handleApprove = () => {
    onComplete(true, data);
  };

  const handleReject = () => {
    onComplete(false, data);
  };

  return (
    <div className="space-y-6">
      {/* Property Info */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex gap-4">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-foreground">{property.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {property.locality}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Owner: {property.ownerName || "Property Owner"}
            </p>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step} of 3</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Verification Checklist</h3>
            <div className="space-y-3">
              {data.checklist.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleChecklistItem(index)}
                  />
                  <span className="text-foreground">{item.item}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {checkedCount} of {data.checklist.length} verified
              </span>
              {allChecked && (
                <span className="text-success flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  All items verified
                </span>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Upload Live Photos</h3>
              <span className="text-sm text-muted-foreground">{data.livePhotos.length} photos</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {data.livePhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Live photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeLivePhoto(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <button
                onClick={addLivePhoto}
                className="h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-accent transition-colors"
              >
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Capture</span>
              </button>
            </div>

            <div className="p-4 bg-warning/10 rounded-lg">
              <p className="text-sm text-warning flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Take clear photos of all rooms, matching the listing images. These will be used for verification.
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Final Review</h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Checkbox
                  checked={data.addressVerified}
                  onCheckedChange={(checked) => setData({ ...data, addressVerified: !!checked })}
                />
                <span className="text-foreground">Address matches listing</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Checkbox
                  checked={data.ownershipVerified}
                  onCheckedChange={(checked) => setData({ ...data, ownershipVerified: !!checked })}
                />
                <span className="text-foreground">Ownership/authorization verified</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Checkbox
                  checked={data.imagesMatch}
                  onCheckedChange={(checked) => setData({ ...data, imagesMatch: !!checked })}
                />
                <span className="text-foreground">Uploaded images match actual property</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Checkbox
                  checked={data.conditionGood}
                  onCheckedChange={(checked) => setData({ ...data, conditionGood: !!checked })}
                />
                <span className="text-foreground">Property condition is satisfactory</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                value={data.notes}
                onChange={(e) => setData({ ...data, notes: e.target.value })}
                placeholder="Add any observations or issues..."
                rows={3}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}

        <div className="flex-1" />

        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={!data.addressVerified || !data.ownershipVerified || !data.imagesMatch}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
