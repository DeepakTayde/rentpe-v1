import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Search, 
  Send, 
  Loader2, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square,
  X,
  Mic,
  MicOff,
  ArrowRight,
  Home,
  IndianRupee,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAIPropertySearch, AISearchProperty } from "@/hooks/useAIPropertySearch";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AISearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXAMPLE_QUERIES = [
  "2BHK under ₹15k in Koramangala",
  "Furnished 1BHK near metro station",
  "3BHK with parking under ₹25k",
  "PG for working professionals in HSR",
];

function PropertyCard({ property, onClick }: { property: AISearchProperty; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all group">
        <div className="flex gap-3 p-3">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200"}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
              {property.title}
            </h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {property.locality}{property.city ? `, ${property.city.name}` : ""}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{property.bedrooms}</span>
              <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms}</span>
              {property.area_sqft && (
                <span className="flex items-center gap-1"><Square className="w-3 h-3" />{property.area_sqft}</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-accent font-bold">₹{property.rent_amount.toLocaleString()}/mo</span>
              <Badge variant="outline" className="text-xs capitalize">
                {property.furnishing.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function AISearchModal({ open, onOpenChange }: AISearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { search, isLoading, result, error, clearHistory } = useAIPropertySearch();
  const { isListening, startListening, stopListening, interimTranscript, isSupported } = useVoiceInput();

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Update query with voice transcript
  useEffect(() => {
    if (interimTranscript) {
      setQuery(interimTranscript);
    }
  }, [interimTranscript]);

  // Scroll to results when they appear
  useEffect(() => {
    if (result?.properties?.length && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    await search(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    search(example);
  };

  const handlePropertyClick = (propertyId: string) => {
    onOpenChange(false);
    navigate(`/properties/${propertyId}`);
  };

  const handleViewAll = () => {
    onOpenChange(false);
    const params = new URLSearchParams();
    if (result?.filters?.locality) params.set("q", result.filters.locality);
    navigate(`/properties?${params.toString()}`);
  };

  const handleClose = () => {
    onOpenChange(false);
    setQuery("");
    clearHistory();
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <VisuallyHidden>
          <DialogTitle>AI Property Search</DialogTitle>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-accent/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground">AI Property Search</h2>
              <p className="text-sm text-muted-foreground">Describe what you're looking for in natural language</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Example Queries */}
          {!result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="w-4 h-4" />
                <span>Try asking:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUERIES.map((example, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-2 rounded-lg bg-muted hover:bg-accent/10 hover:text-accent text-sm transition-colors text-left"
                  >
                    "{example}"
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* AI Response */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground">{result.message}</p>
                  
                  {/* Parsed Filters */}
                  {(result.filters?.property_type || result.filters?.max_budget || result.filters?.locality) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {result.filters.property_type && (
                        <Badge variant="secondary" className="gap-1">
                          <Home className="w-3 h-3" />
                          {result.filters.property_type.toUpperCase()}
                        </Badge>
                      )}
                      {result.filters.max_budget && (
                        <Badge variant="secondary" className="gap-1">
                          <IndianRupee className="w-3 h-3" />
                          Under ₹{result.filters.max_budget.toLocaleString()}
                        </Badge>
                      )}
                      {result.filters.locality && (
                        <Badge variant="secondary" className="gap-1">
                          <MapPin className="w-3 h-3" />
                          {result.filters.locality}
                        </Badge>
                      )}
                      {result.filters.furnishing && (
                        <Badge variant="secondary" className="capitalize">
                          {result.filters.furnishing.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Properties */}
              <div ref={resultsRef} className="space-y-3">
                {result.properties.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Found {result.properties.length} properties
                      </span>
                      <Button variant="ghost" size="sm" onClick={handleViewAll} className="gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    {result.properties.slice(0, 5).map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onClick={() => handlePropertyClick(property.id)}
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Home className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No properties match your criteria</p>
                    <p className="text-sm mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-sm text-muted-foreground">Refine your search:</span>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(suggestion)}
                        className="px-3 py-1.5 rounded-full bg-muted hover:bg-accent/10 hover:text-accent text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 'Find me a 2BHK under ₹15k near Koramangala'"
                className="pr-10"
                disabled={isLoading}
              />
              {isSupported && (
                <button
                  onClick={toggleVoice}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isListening ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          {isListening && (
            <p className="text-xs text-accent mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Listening... speak now
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
