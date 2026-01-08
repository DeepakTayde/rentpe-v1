import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  CreditCard,
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileText,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export default function WorkerKYC() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    panNumber: "",
    panImage: null as File | null,
    accountName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
  });

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    
    if (!formData.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      toast.error("Please enter a valid PAN number");
      return;
    }
    
    if (!formData.accountNumber || formData.accountNumber !== formData.confirmAccountNumber) {
      toast.error("Account numbers do not match");
      return;
    }
    
    if (!formData.ifscCode || formData.ifscCode.length !== 11) {
      toast.error("Please enter a valid IFSC code");
      return;
    }
    
    setIsLoading(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.success("KYC documents submitted for verification");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-8 max-w-md mx-auto text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  KYC Submitted Successfully!
                </h2>
                <p className="text-muted-foreground mb-6">
                  आपके documents verification में हैं। 
                  Approval के बाद आपकी profile live हो जाएगी।
                </p>
                
                <Badge variant="outline" className="gap-2 text-warning border-warning/30 mb-6">
                  <AlertCircle className="w-4 h-4" />
                  Under Verification (24-48 hours)
                </Badge>
                
                <div className="space-y-3">
                  <Link to="/home-services">
                    <Button variant="outline" className="w-full">
                      Back to Home Services
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              KYC Verification
            </h1>
            <p className="text-muted-foreground">
              Profile live करने के लिए KYC complete करें
            </p>
          </motion.div>

          {/* Info Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 mb-6 bg-accent/5 border-accent/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Important Notes:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• One PAN = One worker profile only</li>
                    <li>• Profile will be LIVE only after KYC approval</li>
                    <li>• Bank details change requires re-approval</li>
                    <li>• Payments enabled only after KYC verification</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* KYC Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="space-y-6">
                {/* Aadhaar Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    Aadhaar Card
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                      <Input
                        id="aadhaar"
                        type="text"
                        placeholder="XXXX XXXX XXXX"
                        className="mt-1.5"
                        value={formData.aadhaarNumber}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12) 
                        }))}
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Aadhaar Front *</Label>
                        <label className="mt-1.5 flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                          {formData.aadhaarFront ? (
                            <div className="flex items-center gap-2 text-success">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm">{formData.aadhaarFront.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Upload Front</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange("aadhaarFront", e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      
                      <div>
                        <Label>Aadhaar Back *</Label>
                        <label className="mt-1.5 flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                          {formData.aadhaarBack ? (
                            <div className="flex items-center gap-2 text-success">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm">{formData.aadhaarBack.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Upload Back</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange("aadhaarBack", e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                {/* PAN Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    PAN Card
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pan">PAN Number *</Label>
                      <Input
                        id="pan"
                        type="text"
                        placeholder="ABCDE1234F"
                        className="mt-1.5 uppercase"
                        value={formData.panNumber}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          panNumber: e.target.value.toUpperCase().slice(0, 10) 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>PAN Card Image *</Label>
                      <label className="mt-1.5 flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                        {formData.panImage ? (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm">{formData.panImage.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Upload PAN Card</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange("panImage", e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Bank Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    Bank Account Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="accountName">Account Holder Name *</Label>
                      <Input
                        id="accountName"
                        type="text"
                        placeholder="As per bank records"
                        className="mt-1.5"
                        value={formData.accountName}
                        onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        type="text"
                        placeholder="Enter account number"
                        className="mt-1.5"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          accountNumber: e.target.value.replace(/\D/g, "") 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmAccountNumber">Confirm Account Number *</Label>
                      <Input
                        id="confirmAccountNumber"
                        type="text"
                        placeholder="Re-enter account number"
                        className="mt-1.5"
                        value={formData.confirmAccountNumber}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          confirmAccountNumber: e.target.value.replace(/\D/g, "") 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ifsc">IFSC Code *</Label>
                      <Input
                        id="ifsc"
                        type="text"
                        placeholder="SBIN0001234"
                        className="mt-1.5 uppercase"
                        value={formData.ifscCode}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          ifscCode: e.target.value.toUpperCase().slice(0, 11) 
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Submit for Verification
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
