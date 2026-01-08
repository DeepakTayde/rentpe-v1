import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { RentPaymentFlow } from "@/components/rent/RentPaymentFlow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft, CreditCard, Calendar, Download, CheckCircle } from "lucide-react";

const rentHistory = [
  { id: "1", month: "December 2023", amount: 45000, status: "paid", date: "5 Dec 2023", cashback: 900 },
  { id: "2", month: "November 2023", amount: 45000, status: "paid", date: "5 Nov 2023", cashback: 900 },
  { id: "3", month: "October 2023", amount: 45000, status: "paid", date: "5 Oct 2023", cashback: 900 },
];

export default function PayRent() {
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Link to="/tenant" className="p-2 rounded-lg hover:bg-muted transition-colors">
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

      <main className="container py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground">Pay Rent</h1>
          <p className="text-muted-foreground">Manage your monthly rent payments</p>
        </motion.div>

        {/* Current Due */}
        <Card className="p-6 border-warning/30 bg-warning/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning" />
              <span className="font-medium text-foreground">January 2024</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">Due in 5 days</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground mb-1">₹45,000</p>
          <p className="text-sm text-muted-foreground mb-4">2BHK in Bandra West</p>
          <Button className="w-full" onClick={() => setShowPayment(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        </Card>

        {/* Payment History */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Payment History</h2>
          <div className="space-y-3">
            {rentHistory.map((payment) => (
              <Card key={payment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{payment.month}</p>
                    <p className="text-sm text-muted-foreground">Paid on {payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-success">+₹{payment.cashback} cashback</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-sm text-success">
                    <CheckCircle className="w-4 h-4" /> Paid
                  </span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Invoice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {showPayment && (
        <RentPaymentFlow
          rentAmount={45000}
          propertyTitle="2BHK in Bandra West"
          dueDate="5th January 2024"
          onClose={() => setShowPayment(false)}
          onSuccess={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
