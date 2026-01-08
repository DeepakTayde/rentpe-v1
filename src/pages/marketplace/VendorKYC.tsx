import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, CreditCard, Building2, Upload, Check, 
  AlertCircle, Clock, ArrowRight, FileText, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

export default function VendorKYC() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<"pending" | "submitted" | "verified">("pending");

  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    panNumber: "",
    panImage: null as File | null,
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const completionPercentage = () => {
    let filled = 0;
    const fields = [
      formData.aadhaarNumber,
      formData.panNumber,
      formData.accountHolderName,
      formData.accountNumber,
      formData.ifscCode,
    ];
    fields.forEach((field) => {
      if (field) filled++;
    });
    return (filled / fields.length) * 100;
  };

  const handleSubmit = () => {
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      toast.error("Account numbers do not match");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setKycStatus("submitted");
      toast.success("KYC documents submitted successfully!");
    }, 2000);
  };

  if (kycStatus === "submitted") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    KYC Verification Pending
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    आपके documents verification के लिए submit हो गए हैं। 
                    Approval में 24-48 घंटे लग सकते हैं।
                  </p>
                  <div className="p-4 bg-muted/50 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Our team will verify your Aadhaar & PAN</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Bank account verification via penny drop</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Profile goes LIVE after approval</span>
                      </li>
                    </ul>
                  </div>
                  <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Verification in Progress
                  </Badge>
                  <div className="flex flex-col gap-3">
                    <Link to="/marketplace">
                      <Button className="w-full rounded-full">
                        Browse Marketplace
                      </Button>
                    </Link>
                    <Button variant="outline" className="rounded-full">
                      Check Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Shield className="w-3 h-3 mr-1" />
              KYC Verification
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Complete Your KYC
            </h1>
            <p className="text-muted-foreground mt-2">
              Aadhaar, PAN और Bank details submit करें
            </p>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-sm text-muted-foreground">{Math.round(completionPercentage())}%</span>
              </div>
              <Progress value={completionPercentage()} className="h-2" />
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Aadhaar Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Aadhaar Card
                </CardTitle>
                <CardDescription>आधार कार्ड details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Aadhaar Number *</Label>
                  <Input
                    placeholder="XXXX XXXX XXXX"
                    value={formData.aadhaarNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12),
                      })
                    }
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Aadhaar Front Image *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground">Upload front side</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Aadhaar Back Image *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground">Upload back side</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PAN Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  PAN Card
                </CardTitle>
                <CardDescription>पैन कार्ड details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>PAN Number *</Label>
                  <Input
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        panNumber: e.target.value.toUpperCase().slice(0, 10),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>PAN Card Image *</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm text-muted-foreground">Upload PAN card</p>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      एक PAN से सिर्फ एक vendor profile बन सकती है।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5 text-primary" />
                  Bank Details
                </CardTitle>
                <CardDescription>बैंक अकाउंट details (payment के लिए)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Account Holder Name *</Label>
                  <Input
                    placeholder="As per bank records"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountHolderName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number *</Label>
                  <Input
                    type="password"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, "") })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Account Number *</Label>
                  <Input
                    placeholder="Re-enter account number"
                    value={formData.confirmAccountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmAccountNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>IFSC Code *</Label>
                    <Input
                      placeholder="e.g., SBIN0001234"
                      value={formData.ifscCode}
                      onChange={(e) =>
                        setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      placeholder="Auto-detected from IFSC"
                      value={formData.bankName}
                      disabled
                    />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      Bank account penny drop verification से verify होगा।
                      Bank details change करने पर re-approval required होगी।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Important:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>सभी payments RentPe Hold Wallet में जाएंगे</li>
                      <li>Delivery OTP confirm होने के बाद payment release होगी</li>
                      <li>Profile KYC approval के बाद ही LIVE होगी</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || completionPercentage() < 100}
              className="w-full rounded-full"
              size="lg"
            >
              {isLoading ? "Submitting..." : "Submit KYC Documents"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
