import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, MapPin, Clock, Shield, BadgeCheck, Store, 
  MessageCircle, Truck, Package, RotateCcw, AlertTriangle,
  ChevronRight, Phone, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const vendorData = {
  id: "1",
  name: "Sharma Furniture House",
  tagline: "Quality Furniture on Rent Since 2015",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop",
  rating: 4.8,
  reviews: 234,
  verified: true,
  memberSince: "2020",
  responseTime: "2 घंटे में जवाब",
  serviceAreas: ["Koramangala", "HSR Layout", "BTM Layout", "Jayanagar", "JP Nagar"],
  categories: ["Furniture", "Home Equipment"],
  totalListings: 48,
  completedOrders: 1250,
  policies: {
    deposit: "1-2 months rent as security deposit",
    delivery: "Free delivery within 10km, ₹500 beyond",
    return: "7-day return policy for manufacturing defects",
    damage: "Minor wear allowed, major damage deducted from deposit",
  },
  description: "हम पिछले 8+ सालों से quality furniture rental service provide कर रहे हैं। सभी items properly sanitized और inspected होते हैं।",
};

const vendorListings = [
  {
    id: "1",
    title: "Single Bed with Mattress",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    monthlyRent: 899,
    deposit: 2000,
    rating: 4.7,
  },
  {
    id: "2",
    title: "Double Bed King Size",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    monthlyRent: 1499,
    deposit: 4000,
    rating: 4.8,
  },
  {
    id: "3",
    title: "3-Seater Sofa",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    monthlyRent: 1199,
    deposit: 3000,
    rating: 4.5,
  },
  {
    id: "4",
    title: "Dining Table 4-Seater",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
    monthlyRent: 799,
    deposit: 2500,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Study Table with Chair",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
    monthlyRent: 449,
    deposit: 1500,
    rating: 4.7,
  },
  {
    id: "6",
    title: "Wardrobe 3-Door",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&h=300&fit=crop",
    monthlyRent: 999,
    deposit: 3000,
    rating: 4.3,
  },
];

const vendorReviews = [
  {
    id: "1",
    user: "Rahul M.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Excellent quality furniture! Delivery was on time and the team was very professional.",
  },
  {
    id: "2",
    user: "Priya S.",
    rating: 4,
    date: "1 month ago",
    comment: "Good products, slightly delayed delivery but overall satisfied.",
  },
  {
    id: "3",
    user: "Amit K.",
    rating: 5,
    date: "1 month ago",
    comment: "Been renting from them for 2 years. Never had any issues. Highly recommended!",
  },
];

export default function VendorProfile() {
  const { vendorId } = useParams();
  const [activeTab, setActiveTab] = useState("listings");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-muted">
        <img
          src={vendorData.coverImage}
          alt="Store cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Vendor Header */}
      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={vendorData.logo}
                  alt={vendorData.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-background shadow-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        {vendorData.name}
                      </h1>
                      {vendorData.verified && (
                        <BadgeCheck className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <p className="text-muted-foreground">{vendorData.tagline}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{vendorData.rating}</span>
                        <span className="text-muted-foreground">({vendorData.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{vendorData.responseTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {vendorData.categories.map((cat) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button className="rounded-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat (₹49)
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Service
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{vendorData.totalListings}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{vendorData.completedOrders}+</p>
                <p className="text-sm text-muted-foreground">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{vendorData.memberSince}</p>
                <p className="text-sm text-muted-foreground">Since</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start bg-muted/50 rounded-full p-1">
                <TabsTrigger value="listings" className="rounded-full">
                  Products ({vendorData.totalListings})
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-full">
                  Reviews ({vendorData.reviews})
                </TabsTrigger>
                <TabsTrigger value="policies" className="rounded-full">
                  Policies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vendorListings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all group">
                        <div className="relative">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm line-clamp-1">{listing.title}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs">{listing.rating}</span>
                          </div>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="font-bold text-primary">₹{listing.monthlyRent}</span>
                            <span className="text-xs text-muted-foreground">/mo</span>
                          </div>
                          <Button size="sm" className="w-full mt-2 rounded-full text-xs">
                            Rent Now
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {vendorReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{review.user}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="mt-3 text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="policies" className="mt-6">
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Deposit Policy</h3>
                          <p className="text-sm text-muted-foreground mt-1">{vendorData.policies.deposit}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Delivery Policy</h3>
                          <p className="text-sm text-muted-foreground mt-1">{vendorData.policies.delivery}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <RotateCcw className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Return Policy</h3>
                          <p className="text-sm text-muted-foreground mt-1">{vendorData.policies.return}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Damage Policy</h3>
                          <p className="text-sm text-muted-foreground mt-1">{vendorData.policies.damage}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Service Areas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Service Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vendorData.serviceAreas.map((area) => (
                    <Badge key={area} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{vendorData.description}</p>
              </CardContent>
            </Card>

            {/* Verification Badge */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-10 h-10 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Verified Vendor</h3>
                    <p className="text-sm text-green-700">Aadhaar & PAN verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    सभी payments RentPe Hold Wallet में जाते हैं। Direct deal outside platform allowed nahi hai।
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
