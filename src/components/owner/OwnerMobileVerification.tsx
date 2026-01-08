import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { PropertyRegistrationForm } from "./PropertyRegistrationForm";

type Step = "phone" | "otp" | "registration";

export function OwnerMobileVerification() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending (in production, integrate with SMS gateway)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep("otp");
    setCountdown(30);
    toast.success("OTP sent to your phone number");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification (in production, verify with backend)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, accept any 6-digit OTP
    setIsLoading(false);
    setStep("registration");
    toast.success("Phone number verified successfully!");
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setCountdown(30);
    toast.success("OTP resent successfully");
  };

  if (step === "registration") {
    return <PropertyRegistrationForm phone={phone} />;
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          {step === "phone" ? (
            <Phone className="w-8 h-8 text-accent" />
          ) : (
            <CheckCircle className="w-8 h-8 text-accent" />
          )}
        </div>
        <CardTitle className="text-xl">
          {step === "phone" ? "Verify Your Phone" : "Enter OTP"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "phone" ? (
          <>
            <p className="text-sm text-muted-foreground text-center">
              Enter your phone number to get started
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                +91
              </span>
              <Input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="pl-12 text-lg tracking-wider"
                maxLength={10}
              />
            </div>
            <Button 
              className="w-full gap-2" 
              size="lg"
              onClick={handleSendOTP}
              disabled={phone.length !== 10 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Get OTP
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground text-center">
              Enter the 6-digit code sent to +91 {phone}
            </p>
            
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg"
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-sm text-accent hover:underline"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground text-center w-full"
            >
              Change phone number
            </button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
