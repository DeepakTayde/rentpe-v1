import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { marketplaceItems } from "@/data/mockData";
import { Star, ShoppingCart, Package, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const categories = ["All", "Furniture", "Appliances"];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<string[]>([]);

  const filteredItems = selectedCategory === "All" 
    ? marketplaceItems 
    : marketplaceItems.filter(item => item.category === selectedCategory);

  const addToCart = (itemId: string) => {
    if (cart.includes(itemId)) {
      setCart(cart.filter(id => id !== itemId));
      toast.info("Removed from cart");
    } else {
      setCart([...cart, itemId]);
      toast.success("Added to cart!");
    }
  };

  const totalMonthly = cart.reduce((sum, id) => {
    const item = marketplaceItems.find(i => i.id === id);
    return sum + (item?.rentPerMonth || 0);
  }, 0);

  const totalDeposit = cart.reduce((sum, id) => {
    const item = marketplaceItems.find(i => i.id === id);
    return sum + (item?.deposit || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Rental Marketplace</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rent furniture & appliances at affordable monthly rates. No commitment, easy returns.
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all group">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          {item.category}
                        </span>
                        {cart.includes(item.id) && (
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-success flex items-center justify-center">
                            <Check className="w-4 h-4 text-success-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xl font-bold text-accent">₹{item.rentPerMonth}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                            <p className="text-xs text-muted-foreground">Deposit: ₹{item.deposit}</p>
                          </div>
                        </div>
                        <Button 
                          variant={cart.includes(item.id) ? "secondary" : "default"}
                          className="w-full"
                          onClick={() => addToCart(item.id)}
                        >
                          {cart.includes(item.id) ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Your Cart</h3>
                      <p className="text-sm text-muted-foreground">{cart.length} items</p>
                    </div>
                  </div>

                  {cart.length > 0 ? (
                    <>
                      <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                        {cart.map(id => {
                          const item = marketplaceItems.find(i => i.id === id);
                          if (!item) return null;
                          return (
                            <div key={id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">₹{item.rentPerMonth}/mo</p>
                              </div>
                              <button 
                                onClick={() => addToCart(id)}
                                className="text-destructive hover:text-destructive/80 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-3 border-t border-border pt-4 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monthly Rent</span>
                          <span className="font-medium text-foreground">₹{totalMonthly}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Security Deposit</span>
                          <span className="font-medium text-foreground">₹{totalDeposit}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                          <span className="font-semibold text-foreground">Total Now</span>
                          <span className="font-bold text-accent">₹{totalMonthly + totalDeposit}</span>
                        </div>
                      </div>

                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">Your cart is empty</p>
                      <p className="text-sm text-muted-foreground/70">Add items to get started</p>
                    </div>
                  )}
                </Card>

                {/* Benefits */}
                <div className="mt-4 space-y-2">
                  {["Free delivery & setup", "Easy returns anytime", "Damage protection included"].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-success" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}