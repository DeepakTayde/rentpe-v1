import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Square, Building, Calendar, Phone, Check, ArrowLeft, Home } from "lucide-react";
import { properties } from "@/data/mockData";
import { PropertyBookingModal } from "@/components/booking/PropertyBookingModal";
import { VisitSchedulingModal } from "@/components/visit/VisitSchedulingModal";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === id);
  const [showBooking, setShowBooking] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property not found</h1>
          <Button asChild><Link to="/properties">Back to Properties</Link></Button>
        </div>
      </div>
    );
  }

  const handleBookingComplete = () => {
    setShowBooking(false);
    navigate("/tenant/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container">
          <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <img src={property.images[0]} alt={property.title} className="w-full h-80 object-cover rounded-2xl" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">{property.title}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {property.address}
                </p>
              </motion.div>

              {/* Quick Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-4 gap-4">
                {[
                  { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
                  { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                  { icon: Square, label: "Area", value: `${property.areaSqft} sqft` },
                  { icon: Building, label: "Floor", value: `${property.floorNumber}/${property.totalFloors}` },
                ].map((item) => (
                  <Card key={item.label} className="p-4 text-center">
                    <item.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-lg font-semibold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </Card>
                ))}
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">About this property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </motion.div>

              {/* Amenities */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-success" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Rules */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">House Rules</h2>
                <div className="flex flex-wrap gap-2">
                  {property.rules.map((rule) => (
                    <span key={rule} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                      {rule}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6 sticky top-24">
                  <div className="mb-4">
                    <p className="text-3xl font-display font-bold text-accent">₹{property.rentAmount.toLocaleString()}</p>
                    <p className="text-muted-foreground">per month</p>
                  </div>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="font-medium text-foreground">₹{property.depositAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Furnishing</span>
                      <span className="font-medium text-foreground capitalize">{property.furnishing.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available From</span>
                      <span className="font-medium text-foreground">{property.availableFrom}</span>
                    </div>
                  </div>

                  {/* Book Property Button */}
                  <Button 
                    className="w-full mb-3" 
                    size="lg" 
                    onClick={() => setShowBooking(true)}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Book Property
                  </Button>
                  
                  <Button className="w-full mb-3" size="lg" variant="secondary" onClick={() => setShowVisitModal(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Visit
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Agent
                  </Button>
                  
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Listed by</p>
                    <p className="font-semibold text-foreground">{property.agentName}</p>
                    <p className="text-sm text-muted-foreground">{property.agentPhone}</p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Booking Modal */}
      <PropertyBookingModal
        property={{
          id: property.id,
          title: property.title,
          address: property.address,
          locality: property.locality,
          rentAmount: property.rentAmount,
          depositAmount: property.depositAmount,
          furnishing: property.furnishing,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          ownerId: property.ownerId || "",
          images: property.images,
          amenities: property.amenities,
        }}
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        onComplete={handleBookingComplete}
      />

      {/* Visit Scheduling Modal */}
      <VisitSchedulingModal
        property={{
          id: property.id,
          title: property.title,
          locality: property.locality,
          address: property.address,
          rentAmount: property.rentAmount,
          bedrooms: property.bedrooms,
          images: property.images,
        }}
        isOpen={showVisitModal}
        onClose={() => setShowVisitModal(false)}
        onComplete={() => setShowVisitModal(false)}
      />
    </div>
  );
}
