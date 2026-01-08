import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ChefHat, 
  Wrench, 
  Zap, 
  Shirt, 
  Hammer, 
  HandHelping,
  Star,
  MessageSquare,
  Search,
  Filter,
  BadgeCheck,
  MapPin,
  Clock
} from "lucide-react";

const categoryInfo: Record<string, { name: string; nameHi: string; icon: any; color: string }> = {
  cleaning: { name: "Cleaning", nameHi: "सफाई", icon: Sparkles, color: "bg-blue-500" },
  cook: { name: "Cook / Home Chef", nameHi: "रसोइया", icon: ChefHat, color: "bg-orange-500" },
  plumber: { name: "Plumber", nameHi: "प्लंबर", icon: Wrench, color: "bg-cyan-500" },
  electrician: { name: "Electrician", nameHi: "इलेक्ट्रीशियन", icon: Zap, color: "bg-yellow-500" },
  laundry: { name: "Laundry", nameHi: "धुलाई", icon: Shirt, color: "bg-purple-500" },
  carpenter: { name: "Carpenter", nameHi: "बढ़ई", icon: Hammer, color: "bg-amber-600" },
  helper: { name: "Helper", nameHi: "हेल्पर", icon: HandHelping, color: "bg-green-500" },
};

// Mock workers data
const mockWorkers = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    category: "cleaning",
    rating: 4.8,
    reviews: 156,
    isAvailable: true,
    experience: 5,
    addOns: ["Bathroom Cleaning", "Kitchen Deep Cleaning", "Sofa Cleaning"],
    area: "Koramangala, Bangalore",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: true,
  },
  {
    id: "w2",
    name: "Sunita Devi",
    category: "cleaning",
    rating: 4.9,
    reviews: 203,
    isAvailable: true,
    experience: 8,
    addOns: ["Floor Mopping", "Window Cleaning", "Dusting"],
    area: "HSR Layout, Bangalore",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
  },
  {
    id: "w3",
    name: "Manoj Singh",
    category: "cleaning",
    rating: 4.5,
    reviews: 89,
    isAvailable: false,
    experience: 3,
    addOns: ["Deep Cleaning", "Move-in Cleaning"],
    area: "Indiranagar, Bangalore",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    verified: true,
  },
  {
    id: "w4",
    name: "Lakshmi Amma",
    category: "cook",
    rating: 4.9,
    reviews: 312,
    isAvailable: true,
    experience: 15,
    addOns: ["Veg", "South Indian", "Breakfast", "Lunch", "Dinner"],
    area: "BTM Layout, Bangalore",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    verified: true,
  },
  {
    id: "w5",
    name: "Mohammad Ali",
    category: "cook",
    rating: 4.7,
    reviews: 178,
    isAvailable: true,
    experience: 10,
    addOns: ["Non-Veg", "Mughlai", "Biryani", "Tiffin Service"],
    area: "Whitefield, Bangalore",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
    verified: true,
  },
  {
    id: "w6",
    name: "Raju Mistri",
    category: "plumber",
    rating: 4.6,
    reviews: 234,
    isAvailable: true,
    experience: 12,
    addOns: ["Pipe Fitting", "Tap Repair", "Toilet Repair", "Water Tank"],
    area: "Marathahalli, Bangalore",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
    verified: true,
  },
  {
    id: "w7",
    name: "Vijay Electrician",
    category: "electrician",
    rating: 4.8,
    reviews: 189,
    isAvailable: false,
    experience: 8,
    addOns: ["Wiring", "Fan Installation", "Switch Board", "MCB Repair"],
    area: "Electronic City, Bangalore",
    photo: "https://randomuser.me/api/portraits/men/36.jpg",
    verified: true,
  },
];

export default function CategoryListing() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  const category = categoryInfo[categoryId || "cleaning"];
  const CategoryIcon = category?.icon || Sparkles;
  
  const workers = useMemo(() => {
    return mockWorkers.filter(w => {
      const matchesCategory = w.category === categoryId;
      const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           w.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && (searchQuery === "" || matchesSearch);
    });
  }, [categoryId, searchQuery]);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center`}>
                <CategoryIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {category.name}
                </h1>
                <p className="text-muted-foreground">{category.nameHi} सेवाएं</p>
              </div>
            </div>
            
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or area..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* Workers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker, index) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 hover:shadow-lg transition-all">
                  <div className="flex gap-4">
                    {/* Photo */}
                    <div className="relative">
                      <img 
                        src={worker.photo} 
                        alt={worker.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      {worker.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground truncate">{worker.name}</h3>
                        <Badge 
                          variant={worker.isAvailable ? "default" : "secondary"}
                          className={worker.isAvailable ? "bg-success text-success-foreground" : ""}
                        >
                          {worker.isAvailable ? "🟢 Available" : "🔴 Busy"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium text-foreground">{worker.rating}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">({worker.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{worker.experience} yrs experience</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{worker.area}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add-ons */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {worker.addOns.slice(0, 3).map((addon) => (
                      <Badge key={addon} variant="outline" className="text-xs">
                        {addon}
                      </Badge>
                    ))}
                    {worker.addOns.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{worker.addOns.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Button className="flex-1 gap-2" disabled={!worker.isAvailable}>
                      <MessageSquare className="w-4 h-4" />
                      Chat ₹49
                    </Button>
                    <Link to={`/home-services/worker/${worker.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {workers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No workers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or check back later
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
