import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Sparkles, 
  Star, 
  Zap, 
  TrendingUp,
  Check,
  Crown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePropertyBoosts, BOOST_PLANS } from "@/hooks/usePropertyBoosts";
import { cn } from "@/lib/utils";

interface BoostPropertyModalProps {
  propertyId: string;
  propertyTitle?: string;
  trigger?: React.ReactNode;
}

export function BoostPropertyModal({ 
  propertyId, 
  propertyTitle,
  trigger 
}: BoostPropertyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { createBoost, boosts } = usePropertyBoosts(propertyId);

  const existingBoost = boosts.find(b => b.property_id === propertyId && b.is_active);

  const handleBoost = async () => {
    if (!selectedPlan) return;
    
    const plan = BOOST_PLANS.find(p => p.id === selectedPlan);
    if (!plan) return;

    await createBoost.mutateAsync({
      propertyId,
      boostType: selectedPlan as 'featured' | 'premium' | 'spotlight',
      durationDays: plan.duration,
    });
    
    setIsOpen(false);
    setSelectedPlan(null);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'featured': return Sparkles;
      case 'premium': return Star;
      case 'spotlight': return Crown;
      default: return Zap;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Rocket className="w-4 h-4" />
            Boost Listing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Boost Your Property
          </DialogTitle>
        </DialogHeader>

        {existingBoost ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Property Already Boosted!</h3>
            <p className="text-muted-foreground mb-4">
              Your {existingBoost.boost_type} boost is active until{' '}
              {new Date(existingBoost.ends_at).toLocaleDateString()}
            </p>
            <div className="bg-muted rounded-lg p-4 text-sm">
              <div className="flex justify-between mb-2">
                <span>Impressions</span>
                <span className="font-semibold">{existingBoost.impressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Clicks</span>
                <span className="font-semibold">{existingBoost.clicks.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {propertyTitle && (
              <p className="text-sm text-muted-foreground">
                Boost "<span className="font-medium text-foreground">{propertyTitle}</span>" to get more visibility and tenant inquiries.
              </p>
            )}

            {/* Plans */}
            <div className="space-y-3">
              {BOOST_PLANS.map((plan, index) => {
                const Icon = getPlanIcon(plan.id);
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left transition-all",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            plan.id === 'featured' && "bg-blue-100 text-blue-600",
                            plan.id === 'premium' && "bg-purple-100 text-purple-600",
                            plan.id === 'spotlight' && "bg-amber-100 text-amber-600",
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{plan.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {plan.duration} days
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">₹{plan.price}</div>
                          {isSelected && (
                            <Badge className="bg-primary">Selected</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {plan.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plan.benefits.map((benefit, i) => (
                          <span 
                            key={i}
                            className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                          >
                            <Check className="w-3 h-3 text-primary" />
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!selectedPlan || createBoost.isPending}
              onClick={handleBoost}
            >
              {createBoost.isPending ? (
                'Processing...'
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Boost Now
                  {selectedPlan && (
                    <span>
                      - ₹{BOOST_PLANS.find(p => p.id === selectedPlan)?.price}
                    </span>
                  )}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Payment will be added to your wallet balance. You can cancel anytime.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
