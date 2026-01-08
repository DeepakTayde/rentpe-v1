import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, MapPin, Filter, SortAsc, Truck, Shield,
  BadgeCheck, Store, ChevronDown, Grid, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const categoryData: Record<string, { name: string; nameHi: string; type: "product" | "service" }> = {
  furniture: { name: "Furniture", nameHi: "फर्नीचर", type: "product" },
  electronics: { name: "Electronics", nameHi: "इलेक्ट्रॉनिक्स", type: "product" },
  mobility: { name: "Mobility", nameHi: "मोबिलिटी", type: "product" },
  "home-equipment": { name: "Home Equipment", nameHi: "घरेलू उपकरण", type: "product" },
  tools: { name: "Tools", nameHi: "टूल्स", type: "product" },
  "delivery-install": { name: "Delivery & Install", nameHi: "डिलीवरी और इंस्टॉल", type: "service" },
  repair: { name: "Repair", nameHi: "रिपेयर", type: "service" },
  "deep-cleaning": { name: "Deep Cleaning", nameHi: "डीप क्लीनिंग", type: "service" },
  relocation: { name: "Relocation", nameHi: "रिलोकेशन", type: "service" },
};

const mockProducts = [
  {
    id: "1",
    title: "Single Bed with Mattress",
    titleHi: "सिंगल बेड मैट्रेस के साथ",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    monthlyRent: 899,
    deposit: 2000,
    deliveryAvailable: true,
    vendor: { id: "1", name: "Sharma Furniture", verified: true },
    rating: 4.7,
    reviews: 45,
    condition: "Excellent",
  },
  {
    id: "2",
    title: "Double Bed King Size",
    titleHi: "डबल बेड किंग साइज",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    monthlyRent: 1499,
    deposit: 4000,
    deliveryAvailable: true,
    vendor: { id: "1", name: "Sharma Furniture", verified: true },
    rating: 4.8,
    reviews: 67,
    condition: "Like New",
  },
  {
    id: "3",
    title: "3-Seater Sofa",
    titleHi: "3-सीटर सोफा",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    monthlyRent: 1199,
    deposit: 3000,
    deliveryAvailable: true,
    vendor: { id: "2", name: "Modern Living", verified: true },
    rating: 4.5,
    reviews: 34,
    condition: "Good",
  },
  {
    id: "4",
    title: "Dining Table 4-Seater",
    titleHi: "डाइनिंग टेबल 4-सीटर",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
    monthlyRent: 799,
    deposit: 2500,
    deliveryAvailable: true,
    vendor: { id: "1", name: "Sharma Furniture", verified: true },
    rating: 4.6,
    reviews: 28,
    condition: "Excellent",
  },
  {
    id: "5",
    title: "Wardrobe 3-Door",
    titleHi: "वार्डरोब 3-डोर",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&h=300&fit=crop",
    monthlyRent: 999,
    deposit: 3000,
    deliveryAvailable: true,
    vendor: { id: "3", name: "HomeStyle", verified: false },
    rating: 4.3,
    reviews: 19,
    condition: "Good",
  },
  {
    id: "6",
    title: "Study Table with Chair",
    titleHi: "स्टडी टेबल चेयर के साथ",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
    monthlyRent: 449,
    deposit: 1500,
    deliveryAvailable: true,
    vendor: { id: "1", name: "Sharma Furniture", verified: true },
    rating: 4.7,
    reviews: 52,
    condition: "Excellent",
  },
];

const mockServices = [
  {
    id: "1",
    title: "Full Home Relocation",
    titleHi: "पूरे घर का रिलोकेशन",
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=300&fit=crop",
    startingPrice: 2999,
    vendor: { id: "3", name: "QuickMove Logistics", verified: true },
    rating: 4.6,
    reviews: 89,
    serviceArea: "All Bangalore",
  },
  {
    id: "2",
    title: "Furniture Delivery & Setup",
    titleHi: "फर्नीचर डिलीवरी और सेटअप",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
    startingPrice: 499,
    vendor: { id: "3", name: "QuickMove Logistics", verified: true },
    rating: 4.5,
    reviews: 156,
    serviceArea: "Bangalore Urban",
  },
  {
    id: "3",
    title: "Appliance Installation",
    titleHi: "अप्लायंस इंस्टॉलेशन",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
    startingPrice: 299,
    vendor: { id: "4", name: "TechCare Services", verified: true },
    rating: 4.7,
    reviews: 203,
    serviceArea: "South Bangalore",
  },
];

export default function MarketplaceCategoryListing() {
  const { categoryId } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  const category = categoryData[categoryId || "furniture"] || categoryData.furniture;
  const isService = category.type === "service";
  const items = isService ? mockServices : mockProducts;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Category Header */}
      <section className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {category.name}
          </h1>
          <p className="text-muted-foreground">{category.nameHi}</p>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-0 bg-background z-10 border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-full">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 rounded-full">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{items.length} results</span>
              <div className="flex border rounded-full overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isService ? (
            // Service Cards
            <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {mockServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all overflow-hidden">
                    <div className="relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Link to={`/marketplace/vendor/${service.vendor.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                          <Store className="w-3 h-3" />
                          {service.vendor.name}
                        </Link>
                        {service.vendor.verified && (
                          <BadgeCheck className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.titleHi}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{service.rating}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">({service.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{service.serviceArea}</span>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary">₹{service.startingPrice}</span>
                        <span className="text-sm text-muted-foreground">onwards</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1 rounded-full" size="sm">
                          Book Service
                        </Button>
                        <Link to={`/marketplace/vendor/${service.vendor.id}`}>
                          <Button variant="outline" size="sm" className="rounded-full">
                            View Store
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            // Product Cards
            <div className={`grid gap-4 md:gap-6 ${viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all overflow-hidden group">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {product.deliveryAvailable && (
                          <Badge className="bg-green-600 text-white text-xs">
                            <Truck className="w-3 h-3 mr-1" />
                            Delivery
                          </Badge>
                        )}
                      </div>
                      <Badge className="absolute top-2 right-2 bg-background/90 text-foreground text-xs">
                        {product.condition}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 mb-1">
                        <Link to={`/marketplace/vendor/${product.vendor.id}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          {product.vendor.name}
                        </Link>
                        {product.vendor.verified && (
                          <BadgeCheck className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-muted-foreground">{product.titleHi}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary">₹{product.monthlyRent}</span>
                        <span className="text-xs text-muted-foreground">/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Deposit: ₹{product.deposit}
                      </p>
                      <Button className="w-full mt-3 rounded-full" size="sm">
                        Rent Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
