import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Store, Star, MapPin, Clock, ChevronRight, Shield, 
  Truck, Sofa, Tv, Bike, Wrench, Package, Sparkles,
  Home, Settings, ArrowRight, BadgeCheck, Wallet, Map, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VendorMapView } from "@/components/marketplace/VendorMapView";

const productCategories = [
  { id: "furniture", name: "Furniture", nameHi: "फर्नीचर", icon: Sofa, count: 234 },
  { id: "electronics", name: "Electronics", nameHi: "इलेक्ट्रॉनिक्स", icon: Tv, count: 156 },
  { id: "mobility", name: "Mobility", nameHi: "मोबिलिटी", icon: Bike, count: 89 },
  { id: "home-equipment", name: "Home Equipment", nameHi: "घरेलू उपकरण", icon: Home, count: 178 },
  { id: "tools", name: "Tools", nameHi: "टूल्स", icon: Wrench, count: 67 },
];

const serviceCategories = [
  { id: "delivery-install", name: "Delivery & Install", nameHi: "डिलीवरी और इंस्टॉल", icon: Truck, count: 45 },
  { id: "repair", name: "Repair", nameHi: "रिपेयर", icon: Settings, count: 78 },
  { id: "deep-cleaning", name: "Deep Cleaning", nameHi: "डीप क्लीनिंग", icon: Sparkles, count: 56 },
  { id: "relocation", name: "Relocation", nameHi: "रिलोकेशन", icon: Package, count: 34 },
];

const nearbyVendors = [
  {
    id: "1",
    name: "Sharma Furniture House",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    rating: 4.8,
    reviews: 234,
    serviceArea: "Koramangala, HSR Layout",
    responseSLA: "2 घंटे में जवाब",
    verified: true,
    categories: ["Furniture", "Home Equipment"],
  },
  {
    id: "2",
    name: "TechRent Electronics",
    logo: "https://images.unsplash.com/photo-1496200186974-4293800e2c20?w=100&h=100&fit=crop",
    rating: 4.6,
    reviews: 189,
    serviceArea: "Indiranagar, Whitefield",
    responseSLA: "1 घंटे में जवाब",
    verified: true,
    categories: ["Electronics", "Tools"],
  },
  {
    id: "3",
    name: "QuickMove Logistics",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&h=100&fit=crop",
    rating: 4.5,
    reviews: 156,
    serviceArea: "All Bangalore",
    responseSLA: "30 मिनट में जवाब",
    verified: true,
    categories: ["Relocation", "Delivery"],
  },
];

const featuredListings = [
  {
    id: "1",
    title: "Single Bed with Mattress",
    titleHi: "सिंगल बेड मैट्रेस के साथ",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    monthlyRent: 899,
    deposit: 2000,
    deliveryAvailable: true,
    vendor: "Sharma Furniture",
    rating: 4.7,
  },
  {
    id: "2",
    title: "32\" Smart LED TV",
    titleHi: "32\" स्मार्ट LED TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    monthlyRent: 799,
    deposit: 3000,
    deliveryAvailable: true,
    vendor: "TechRent",
    rating: 4.5,
  },
  {
    id: "3",
    title: "Washing Machine 6.5kg",
    titleHi: "वॉशिंग मशीन 6.5kg",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop",
    monthlyRent: 599,
    deposit: 2500,
    deliveryAvailable: true,
    vendor: "HomeAppliance Hub",
    rating: 4.6,
  },
  {
    id: "4",
    title: "Study Table + Chair Set",
    titleHi: "स्टडी टेबल + चेयर सेट",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
    monthlyRent: 449,
    deposit: 1500,
    deliveryAvailable: true,
    vendor: "Sharma Furniture",
    rating: 4.8,
  },
];

const tenantBundles = [
  {
    id: "1",
    name: "Bedroom Starter Pack",
    nameHi: "बेडरूम स्टार्टर पैक",
    items: ["Single Bed", "Mattress", "Side Table", "Table Lamp"],
    monthlyRent: 1499,
    savings: 400,
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Appliance Pack",
    nameHi: "अप्लायंस पैक",
    items: ["Refrigerator", "Washing Machine", "Microwave"],
    monthlyRent: 1899,
    savings: 500,
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Work From Home Pack",
    nameHi: "वर्क फ्रॉम होम पैक",
    items: ["Study Table", "Chair", "Table Lamp", "WiFi Router"],
    monthlyRent: 999,
    savings: 300,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop",
  },
];

export default function MarketplaceIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Store className="w-3 h-3 mr-1" />
              RentPe Marketplace
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Rent Products & Services Near You
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              किराये पर प्रोडक्ट्स और सर्विसेज – आपके पास
            </p>
            <p className="text-muted-foreground mb-8">
              Furniture, Electronics, Appliances aur services – verified vendors se rent karein
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                <Store className="w-4 h-4 mr-2" />
                Browse Marketplace
              </Button>
              <Link to="/marketplace/vendor/register">
                <Button size="lg" variant="outline" className="rounded-full w-full">
                  Join as Vendor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Verified Vendors</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="w-4 h-4 text-primary" />
              <span>Secure Escrow Payment</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-green-600" />
              <span>OTP Verified Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Rent Products</h2>
              <p className="text-muted-foreground">प्रोडक्ट्स किराये पर लें</p>
            </div>
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/marketplace/category/${category.id}`}>
                  <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <category.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.nameHi}</p>
                      <p className="text-xs text-primary mt-1">{category.count}+ items</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Book Services</h2>
              <p className="text-muted-foreground">सर्विसेज बुक करें</p>
            </div>
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/marketplace/category/${category.id}`}>
                  <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-accent transition-colors">
                        <category.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.nameHi}</p>
                      <p className="text-xs text-primary mt-1">{category.count}+ vendors</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Vendors with Map View */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Nearby Vendors</h2>
              <p className="text-muted-foreground">आपके पास के वेंडर्स</p>
            </div>
          </div>
          
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="grid w-full max-w-xs grid-cols-2 mb-6">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Map View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                List View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="map">
              <VendorMapView />
            </TabsContent>
            
            <TabsContent value="list">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyVendors.map((vendor, index) => (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={vendor.logo}
                            alt={vendor.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                              {vendor.verified && (
                                <BadgeCheck className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{vendor.rating}</span>
                              <span className="text-muted-foreground">({vendor.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{vendor.serviceArea}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Clock className="w-4 h-4" />
                            <span>{vendor.responseSLA}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {vendor.categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        <Link to={`/marketplace/vendor/${vendor.id}`}>
                          <Button className="w-full mt-4 rounded-full" variant="outline">
                            <Store className="w-4 h-4 mr-2" />
                            View Store
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Listings</h2>
              <p className="text-muted-foreground">लोकप्रिय प्रोडक्ट्स</p>
            </div>
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all overflow-hidden group">
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                    {listing.deliveryAvailable && (
                      <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                        <Truck className="w-3 h-3 mr-1" />
                        Delivery
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-1">{listing.title}</h3>
                    <p className="text-xs text-muted-foreground">{listing.titleHi}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{listing.rating}</span>
                      <span className="text-xs text-muted-foreground">• {listing.vendor}</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-primary">₹{listing.monthlyRent}</span>
                      <span className="text-xs text-muted-foreground">/month</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Deposit: ₹{listing.deposit}
                    </p>
                    <Button className="w-full mt-3 rounded-full" size="sm">
                      Rent Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tenant Bundles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Bundles for New Tenants</h2>
            <p className="text-muted-foreground">नए किराएदारों के लिए स्पेशल पैक्स</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tenantBundles.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all overflow-hidden border-2 hover:border-primary/50">
                  <div className="relative">
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                      Save ₹{bundle.savings}/mo
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground">{bundle.name}</h3>
                    <p className="text-muted-foreground">{bundle.nameHi}</p>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-2">
                        {bundle.items.map((item) => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">₹{bundle.monthlyRent}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <Button className="w-full mt-4 rounded-full">
                      Get This Bundle
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join as Vendor CTA */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-8 md:p-12 text-center">
              <Store className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Become a RentPe Vendor
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                अपने प्रोडक्ट्स और सर्विसेज को लाखों customers तक पहुंचाएं
              </p>
              <p className="text-muted-foreground mb-6">
                Zero listing fees • Secure payments • Pan-India reach
              </p>
              <Link to="/marketplace/vendor/register">
                <Button size="lg" className="rounded-full">
                  Join as Vendor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <section className="py-6 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-3 max-w-2xl mx-auto">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Safety Notice:</strong> सभी payments RentPe Hold Wallet में जाते हैं। 
              Delivery OTP confirm होने के बाद ही vendor को payment release होती है। 
              Direct deal outside platform allowed nahi hai।
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
