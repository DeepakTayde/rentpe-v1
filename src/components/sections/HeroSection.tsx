import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ChevronDown, Loader2, Building, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-apartment.jpg";
import { useCities, getPersistedCity, persistCity } from "@/hooks/useCities";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { AISearchModal } from "@/components/modals/AISearchModal";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { data: cities, isLoading: citiesLoading } = useCities();
  const [selectedCity, setSelectedCity] = useState(() => getPersistedCity() || "Mumbai");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from database
  const { data: suggestions = [], isLoading: suggestionsLoading } = useSearchSuggestions(searchQuery, selectedCity);

  // Set initial city from database if persisted city doesn't exist there
  useEffect(() => {
    if (cities && cities.length > 0) {
      const persistedCity = getPersistedCity();
      const cityExists = cities.some(c => c.name === persistedCity);
      if (!cityExists) {
        setSelectedCity(cities[0].name);
        persistCity(cities[0].name);
      }
    }
  }, [cities]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    persistCity(cityName);
    setIsCityDropdownOpen(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.set("city", selectedCity);
    if (searchQuery) params.set("q", searchQuery);
    navigate(`/properties?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: { name: string; type: string; id?: string }) => {
    if (suggestion.type === "property" && suggestion.id) {
      navigate(`/properties/${suggestion.id}`);
    } else {
      setSearchQuery(suggestion.name);
      setShowSuggestions(false);
      const params = new URLSearchParams();
      params.set("city", selectedCity);
      params.set("q", suggestion.name);
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern apartment complex in India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-pattern" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              India's Smart Living Operating System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Your Complete
            <br />
            <span className="bg-gradient-to-r from-accent to-sky-300 bg-clip-text text-transparent">
              Living Ecosystem
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
          >
            Rent smarter. Pay easier. Live better. One platform for renting, payments, maintenance, and daily services.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card/95 backdrop-blur-lg rounded-2xl p-3 shadow-xl">
              <div className="flex flex-col gap-3">
                {/* City Selector - Mobile Optimized */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-4 md:py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors w-full touch-manipulation"
                  >
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="font-medium text-foreground">{selectedCity}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ml-auto ${isCityDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isCityDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-full bg-card rounded-xl shadow-lg border border-border overflow-hidden z-20 max-h-80 overflow-y-auto"
                    >
                      {citiesLoading ? (
                        <div className="px-4 py-4 md:py-3 flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading cities...
                        </div>
                      ) : (
                        cities?.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city.name)}
                            className={`w-full px-4 py-4 md:py-3 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between touch-manipulation ${
                              selectedCity === city.name ? "bg-accent/10 text-accent" : "text-foreground"
                            }`}
                          >
                            <span>{city.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {city.propertyCount} {city.propertyCount === 1 ? "property" : "properties"}
                            </span>
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Search Input with Suggestions - Mobile Optimized */}
                <div className="flex-1 relative" ref={searchRef}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                        setShowSuggestions(false);
                      }
                    }}
                    placeholder="Search by locality, landmark, or property name..."
                    className="w-full px-4 py-4 md:py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 text-base md:text-sm touch-manipulation"
                  />
                  
                  {/* Suggestions Dropdown - Mobile Optimized */}
                  {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-20 max-h-60 md:max-h-80 overflow-y-auto"
                    >
                      {suggestionsLoading ? (
                        <div className="px-4 py-4 md:py-3 flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Searching...
                        </div>
                      ) : (
                        suggestions.map((suggestion, index) => (
                          <button
                            key={`${suggestion.type}-${suggestion.id || index}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-4 md:py-3 text-left text-sm hover:bg-muted transition-colors flex items-center gap-3 touch-manipulation"
                          >
                            {suggestion.type === "property" ? (
                              <Building className="w-4 h-4 text-accent flex-shrink-0" />
                            ) : (
                              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-foreground truncate">{suggestion.name}</div>
                              {suggestion.subtext && (
                                <div className="text-xs text-muted-foreground truncate">{suggestion.subtext}</div>
                              )}
                            </div>
                            <span className="text-muted-foreground text-xs flex-shrink-0">
                              {suggestion.type === "property" ? "Property" : "Locality"}
                            </span>
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="gap-2 flex-1 py-4 md:py-3 touch-manipulation"
                    onClick={handleSearch}
                  >
                    <Search className="w-5 h-5" />
                    Search Properties
                  </Button>

                  <Button 
                    variant="default" 
                    size="lg" 
                    className="gap-2 flex-1 py-4 md:py-3 bg-gradient-to-r from-accent to-sky-400 hover:from-accent/90 hover:to-sky-400/90 touch-manipulation"
                    onClick={() => setShowAISearch(true)}
                  >
                    <Sparkles className="w-5 h-5" />
                    Ask AI Assistant
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Search Modal */}
          <AISearchModal open={showAISearch} onOpenChange={setShowAISearch} />

          {/* Quick Actions - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Button 
              variant="hero-outline" 
              size="lg"
              className="w-full sm:w-auto py-4 md:py-3 touch-manipulation"
              onClick={() => navigate("/list-property")}
            >
              List Your Property
            </Button>
            <Button 
              variant="hero-outline" 
              size="lg"
              className="w-full sm:w-auto py-4 md:py-3 touch-manipulation"
              onClick={() => navigate("/select-role?role=vendor")}
            >
              Join as Vendor
            </Button>
          </motion.div>

          {/* Trust Stats - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16 pt-6 md:pt-8 border-t border-primary-foreground/10"
          >
            {[
              { value: "50K+", label: "Verified Properties" },
              { value: "2L+", label: "Happy Tenants" },
              { value: "15+", label: "Cities" },
              { value: "4.8★", label: "App Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-primary-foreground/70 leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
};
