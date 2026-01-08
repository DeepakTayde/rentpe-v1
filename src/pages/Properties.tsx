import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, Heart, BedDouble, Bath, Square, Loader2 } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { useCities } from "@/hooks/useCities";
import { PropertyAlertsModal } from "@/components/modals/PropertyAlertsModal";

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const cityNameFromUrl = searchParams.get("city");
  
  const { data: cities, isLoading: citiesLoading } = useCities();
  
  // Set city ID from URL city name
  useEffect(() => {
    if (cities && cityNameFromUrl) {
      const city = cities.find(c => c.name.toLowerCase() === cityNameFromUrl.toLowerCase());
      if (city) {
        setSelectedCityId(city.id);
      }
    }
  }, [cities, cityNameFromUrl]);

  const { data: properties, isLoading: propertiesLoading } = useProperties({
    cityId: selectedCityId || undefined,
    searchQuery: searchQuery || undefined,
  });

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = cities?.find(c => c.id === cityId);
    if (city) {
      searchParams.set("city", city.name);
    } else {
      searchParams.delete("city");
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      searchParams.set("q", query);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCityId("");
    setSearchParams({});
  };

  const isLoading = propertiesLoading || citiesLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          {/* Search Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Find Your Perfect Home</h1>
            <p className="text-muted-foreground mb-6">Browse verified properties across India</p>
            
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by locality or property name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
              >
                <option value="">All Cities</option>
                {cities?.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.propertyCount})
                  </option>
                ))}
              </select>
              <PropertyAlertsModal />
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-2 text-muted-foreground">Loading properties...</span>
            </div>
          )}

          {/* Results */}
          {!isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/properties/${property.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all group">
                      <div className="relative">
                        <img 
                          src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"} 
                          alt={property.title} 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card">
                          <Heart className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
                          Verified
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {property.locality}{property.city ? `, ${property.city.name}` : ""}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{property.bedrooms}</span>
                          <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms}</span>
                          <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.area_sqft || "N/A"} sqft</span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div>
                            <p className="text-xl font-bold text-accent">₹{property.rent_amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">per month</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                            {property.furnishing.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          
          {!isLoading && (!properties || properties.length === 0) && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No properties found</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
