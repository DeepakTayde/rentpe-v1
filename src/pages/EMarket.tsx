import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Wrench, ShieldCheck } from "lucide-react";

const productRentalCategories = [
  { id: "furniture", name: "Furniture" },
  { id: "electronics", name: "Electronics" },
  { id: "appliances", name: "Appliances" },
  { id: "bike-scooty", name: "Bike / Scooty" },
  { id: "tools", name: "Tools" },
];

const serviceRentalCategories = [
  { id: "installation", name: "Installation" },
  { id: "repair", name: "Repair" },
  { id: "relocation", name: "Relocation" },
  { id: "deep-cleaning", name: "Deep Cleaning" },
];

const popularProducts = [
  {
    id: "pp-1",
    name: "Single Bed with Mattress",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    monthlyRentLabel: "₹899 / month",
    depositLabel: "Deposit: ₹2000",
    area: "Andheri",
  },
  {
    id: "pp-2",
    name: "Washing Machine",
    image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800&h=600&fit=crop",
    monthlyRentLabel: "₹699 / month",
    depositLabel: "Deposit: ₹1500",
    area: "Powai",
  },
  {
    id: "pp-3",
    name: "Study Table",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop",
    monthlyRentLabel: "₹449 / month",
    depositLabel: "Deposit: ₹1000",
    area: "Bandra",
  },
  {
    id: "pp-4",
    name: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
    monthlyRentLabel: "₹1499 / month",
    depositLabel: "Deposit: ₹3000",
    area: "Goregaon",
  },
];

const EMarket = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center">
            E-Market by RentPe
          </h1>
        </div>

        {/* Category-wise Marketplace Sections */}
        <section className="py-12">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Product Rentals</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {productRentalCategories.map((category) => (
                <Link key={category.id} to={`/e-market?type=product&category=${category.id}`}>
                  <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Package className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Service Rentals</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {serviceRentalCategories.map((category) => (
                <Link key={category.id} to={`/e-market?type=service&category=${category.id}`}>
                  <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-accent transition-colors">
                        <Wrench className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Product Listing Preview (Static) */}
        <section className="py-12">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Popular Products Near You</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {popularProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-all overflow-hidden group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 md:h-48 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-1">{product.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-primary">{product.monthlyRentLabel}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="rounded-full">
                        {product.depositLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{product.area}</span>
                    </div>
                    <Button asChild className="w-full mt-3 rounded-full" size="sm">
                      <Link to={`/e-market?product=${product.id}`}>Rent Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety Strip */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="secondary" className="rounded-full">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verified Vendors
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                Secure Payment via RentPe
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                No Direct Payment Allowed
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                Refund Protected (Hold Wallet)
              </Badge>
            </div>
          </div>
        </section>

        {/* Vendor CTA */}
        <section className="py-12">
          <div className="container">
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-foreground font-medium">
                    Vendor ho? Apne products aur services rent par list karein
                  </p>
                </div>
                <Link to="/marketplace/vendor/register">
                  <Button className="rounded-full">Join as Vendor</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EMarket;
