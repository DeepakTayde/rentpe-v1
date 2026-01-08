import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, Star, Clock, Store, Navigation, 
  BadgeCheck, ChevronRight, Locate 
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  serviceArea: string;
  responseSLA: string;
  verified: boolean;
  categories: string[];
  lat: number;
  lng: number;
  distance?: number;
}

const mockVendors: Vendor[] = [
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
    lat: 12.9352,
    lng: 77.6245,
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
    lat: 12.9784,
    lng: 77.6408,
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
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "4",
    name: "HomeAppliance Hub",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
    rating: 4.7,
    reviews: 198,
    serviceArea: "JP Nagar, BTM Layout",
    responseSLA: "1 घंटे में जवाब",
    verified: true,
    categories: ["Electronics", "Home Equipment"],
    lat: 12.9081,
    lng: 77.5857,
  },
  {
    id: "5",
    name: "CleanPro Services",
    logo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop",
    rating: 4.4,
    reviews: 145,
    serviceArea: "Whitefield, Marathahalli",
    responseSLA: "2 घंटे में जवाब",
    verified: true,
    categories: ["Deep Cleaning", "Repair"],
    lat: 12.9698,
    lng: 77.7500,
  },
];

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function VendorMapView() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const getUserLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          toast.success("Location detected!");
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Bangalore center
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
          toast.error("Location access denied. Using default location.");
          setIsLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const vendorsWithDistance = mockVendors.map(vendor => ({
        ...vendor,
        distance: calculateDistance(userLocation.lat, userLocation.lng, vendor.lat, vendor.lng)
      }));
      
      const filtered = vendorsWithDistance
        .filter(v => v.distance! <= maxDistance)
        .sort((a, b) => a.distance! - b.distance!);
      
      setFilteredVendors(filtered);
    }
  }, [userLocation, maxDistance]);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const initMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) {
          console.warn("Mapbox token not found");
          return;
        }
        
        mapboxgl.accessToken = token;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = new mapboxgl.Map({
          container: mapRef.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [userLocation.lng, userLocation.lat],
          zoom: 12,
        });

        mapInstanceRef.current = map;

        // Add user location marker
        new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([userLocation.lng, userLocation.lat])
          .setPopup(new mapboxgl.Popup().setHTML('<p class="font-semibold">Your Location</p>'))
          .addTo(map);

        // Add vendor markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        filteredVendors.forEach(vendor => {
          const el = document.createElement('div');
          el.className = 'vendor-marker';
          el.style.cssText = `
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            border: 3px solid #22c55e;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          `;
          el.innerHTML = `<img src="${vendor.logo}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />`;

          el.addEventListener('click', () => {
            setSelectedVendor(vendor);
          });

          const marker = new mapboxgl.Marker(el)
            .setLngLat([vendor.lng, vendor.lat])
            .addTo(map);

          markersRef.current.push(marker);
        });

        // Add distance circle
        map.on('load', () => {
          const circleCoords = [];
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * 2 * Math.PI;
            const dx = maxDistance * Math.cos(angle);
            const dy = maxDistance * Math.sin(angle);
            const lat = userLocation.lat + (dy / 111.32);
            const lng = userLocation.lng + (dx / (111.32 * Math.cos(userLocation.lat * Math.PI / 180)));
            circleCoords.push([lng, lat]);
          }
          circleCoords.push(circleCoords[0]);

          if (map.getSource('distance-circle')) {
            (map.getSource('distance-circle') as any).setData({
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates: [circleCoords] }
            });
          } else {
            map.addSource('distance-circle', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [circleCoords] },
                properties: {}
              }
            });

            map.addLayer({
              id: 'distance-circle-fill',
              type: 'fill',
              source: 'distance-circle',
              paint: {
                'fill-color': '#3b82f6',
                'fill-opacity': 0.1
              }
            });

            map.addLayer({
              id: 'distance-circle-line',
              type: 'line',
              source: 'distance-circle',
              paint: {
                'line-color': '#3b82f6',
                'line-width': 2,
                'line-dasharray': [2, 2]
              }
            });
          }
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, filteredVendors, maxDistance]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Button 
              variant="outline" 
              onClick={getUserLocation}
              disabled={isLoading}
            >
              <Locate className="w-4 h-4 mr-2" />
              {isLoading ? "Detecting..." : "Update Location"}
            </Button>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Distance: {maxDistance} km</span>
                <Badge variant="secondary">{filteredVendors.length} vendors</Badge>
              </div>
              <Slider
                value={[maxDistance]}
                onValueChange={(value) => setMaxDistance(value[0])}
                min={1}
                max={25}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map and List */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Map */}
        <Card className="overflow-hidden">
          <div 
            ref={mapRef} 
            className="h-[400px] w-full bg-muted"
            style={{ minHeight: '400px' }}
          />
          {!import.meta.env.VITE_MAPBOX_TOKEN && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
              <p className="text-muted-foreground text-center p-4">
                Map requires Mapbox token.<br />
                Showing vendor list below.
              </p>
            </div>
          )}
        </Card>

        {/* Vendor List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredVendors.length === 0 ? (
            <Card className="p-6 text-center">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No vendors found within {maxDistance} km
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try increasing the distance
              </p>
            </Card>
          ) : (
            filteredVendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className={`hover:shadow-md transition-all cursor-pointer ${
                  selectedVendor?.id === vendor.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedVendor(vendor)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{vendor.name}</h3>
                        {vendor.verified && (
                          <BadgeCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{vendor.rating}</span>
                        <span className="text-muted-foreground">({vendor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{vendor.distance?.toFixed(1)} km away</span>
                      </div>
                    </div>
                    <Link to={`/marketplace/vendor/${vendor.id}`}>
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Store className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {vendor.categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{vendor.responseSLA}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Selected Vendor Details */}
      {selectedVendor && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedVendor.logo}
                  alt={selectedVendor.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{selectedVendor.name}</h3>
                  <p className="text-muted-foreground">{selectedVendor.serviceArea}</p>
                  <p className="text-sm text-primary font-medium">
                    {selectedVendor.distance?.toFixed(1)} km away
                  </p>
                </div>
              </div>
              <Link to={`/marketplace/vendor/${selectedVendor.id}`}>
                <Button className="rounded-full">
                  View Store
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
