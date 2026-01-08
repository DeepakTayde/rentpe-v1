import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationContext, createNotification } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { 
  CreditCard, Wallet, Smartphone, Building, CheckCircle, 
  ArrowRight, ArrowLeft, Gift, IndianRupee, X
} from "lucide-react";
import { toast } from "sonner";

interface RentPaymentFlowProps {
  rentAmount: number;
  propertyTitle: string;
  dueDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = "upi" | "card" | "netbanking";

const paymentMethods = [
  { id: "upi" as const, label: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, etc." },
  { id: "card" as const, label: "Card", icon: CreditCard, description: "Credit/Debit Card" },
  { id: "netbanking" as const, label: "Net Banking", icon: Building, description: "All major banks" },
];

export function RentPaymentFlow({ 
  rentAmount, 
  propertyTitle, 
  dueDate, 
  onClose,
  onSuccess 
}: RentPaymentFlowProps) {
  const { user, wallet, updateWallet } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [walletUsage, setWalletUsage] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  const totalWallet = wallet.ownerDiscount + wallet.cashback + wallet.referral;
  const maxWalletUsage = Math.min(totalWallet, rentAmount * 0.1); // Max 10% can be paid via wallet
  const walletToUse = Math.min(walletUsage, maxWalletUsage);
  const amountToPay = rentAmount - walletToUse;
  const cashbackEarned = Math.floor(amountToPay * 0.02); // 2% cashback

  const processPayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Update wallet - deduct used amount and add cashback
    if (walletToUse > 0) {
      // Deduct from wallet buckets in order: Owner Discount -> Cashback -> Referral
      let remaining = walletToUse;
      if (remaining > 0 && wallet.ownerDiscount > 0) {
        const deduct = Math.min(remaining, wallet.ownerDiscount);
        updateWallet("ownerDiscount", -deduct);
        remaining -= deduct;
      }
      if (remaining > 0 && wallet.cashback > 0) {
        const deduct = Math.min(remaining, wallet.cashback);
        updateWallet("cashback", -deduct);
        remaining -= deduct;
      }
      if (remaining > 0 && wallet.referral > 0) {
        const deduct = Math.min(remaining, wallet.referral);
        updateWallet("referral", -deduct);
      }
    }
    
    // Add cashback
    updateWallet("cashback", cashbackEarned);
    
    setProcessing(false);
    setStep(4);
    
    // Add notification via database
    if (user?.id) {
      createNotification(
        user.id,
        "payment",
        "Rent Paid Successfully",
        `Your rent of ₹${rentAmount.toLocaleString()} has been paid. Earned ₹${cashbackEarned} cashback!`,
        { amount: rentAmount, cashback: cashbackEarned },
        "/tenant/rent-history"
      );
    }
    
    toast.success("Payment successful!");
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-foreground">Pay Rent</h2>
            <p className="text-sm text-muted-foreground">{propertyTitle}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Rent Summary */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Amount Due</p>
                  <p className="text-4xl font-display font-bold text-foreground mt-2">
                    ₹{rentAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Due: {dueDate}</p>
                </div>

                {/* Wallet Section */}
                {totalWallet > 0 && (
                  <Card className="p-4 bg-accent/5 border-accent/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-accent" />
                        <span className="font-medium text-foreground">Use Wallet Balance</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Available: ₹{totalWallet}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Slider
                        value={[walletUsage]}
                        onValueChange={([val]) => setWalletUsage(val)}
                        max={maxWalletUsage}
                        step={10}
                        className="py-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Using: ₹{walletToUse}</span>
                        <span className="text-muted-foreground">Max: ₹{maxWalletUsage} (10%)</span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Summary */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rent Amount</span>
                    <span className="text-foreground">₹{rentAmount.toLocaleString()}</span>
                  </div>
                  {walletToUse > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Wallet Applied</span>
                      <span className="text-success">- ₹{walletToUse}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t border-border">
                    <span className="text-foreground">To Pay</span>
                    <span className="text-foreground">₹{amountToPay.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cashback Banner */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
                  <Gift className="w-5 h-5 text-success" />
                  <span className="text-sm text-success">
                    Earn ₹{cashbackEarned} cashback on this payment!
                  </span>
                </div>

                <Button className="w-full" onClick={() => setStep(2)}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Select Payment Method</h3>
                  <p className="text-sm text-muted-foreground">
                    Amount: ₹{amountToPay.toLocaleString()}
                  </p>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                        paymentMethod === method.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={method.id} />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === method.id ? "bg-accent" : "bg-muted"
                      }`}>
                        <method.icon className={`w-5 h-5 ${
                          paymentMethod === method.id ? "text-accent-foreground" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Enter Payment Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod === "upi" && "Enter your UPI ID"}
                    {paymentMethod === "card" && "Enter your card details"}
                    {paymentMethod === "netbanking" && "Select your bank"}
                  </p>
                </div>

                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <Input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                    />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input placeholder="***" type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="grid grid-cols-2 gap-3">
                    {["HDFC", "ICICI", "SBI", "Axis", "Kotak", "Yes Bank"].map((bank) => (
                      <button
                        key={bank}
                        className="p-3 border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-foreground"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                )}

                <Card className="p-4 bg-muted/50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-foreground">₹{amountToPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>Cashback</span>
                      <span>+ ₹{cashbackEarned}</span>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={processPayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{amountToPay.toLocaleString()}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-muted-foreground">
                    Your rent payment of ₹{rentAmount.toLocaleString()} has been processed.
                  </p>
                </div>

                <Card className="p-4 bg-success/5 border-success/20 text-left">
                  <div className="flex items-center gap-3">
                    <Gift className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-semibold text-foreground">₹{cashbackEarned} Cashback Earned!</p>
                      <p className="text-sm text-muted-foreground">Added to your wallet</p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="text-foreground font-mono">TXN{Date.now()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="text-foreground">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    View History
                  </Button>
                  <Button className="flex-1" onClick={onSuccess}>
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
