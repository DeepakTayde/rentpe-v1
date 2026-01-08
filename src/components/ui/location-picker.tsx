import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  className
}: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onLocationChange(lat, lng);
        setShowMap(true);
        toast.success("Location detected!");
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to get your location. Please enter manually.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualEntry = () => {
    setShowMap(true);
    // Default to a central India location if no coordinates
    if (!latitude || !longitude) {
      onLocationChange(20.5937, 78.9629);
    }
  };

  // Initialize map when showing
  useEffect(() => {
    if (!showMap || !mapContainer.current) return;

    const initMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        // Check if token is available (user would need to set this)
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        
        if (!token) {
          // Show a message that map requires API key
          if (mapContainer.current) {
            mapContainer.current.innerHTML = `
              <div class="flex flex-col items-center justify-center h-full text-center p-4">
                <p class="text-sm text-muted-foreground mb-2">Map requires Mapbox API key</p>
                <p class="text-xs text-muted-foreground">Location coordinates: ${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}</p>
              </div>
            `;
          }
          return;
        }
        
        mapboxgl.accessToken = token;
        
        const lat = latitude || 20.5937;
        const lng = longitude || 78.9629;

        mapRef.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 15,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add draggable marker
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        markerRef.current.on('dragend', () => {
          const lngLat = markerRef.current.getLngLat();
          onLocationChange(lngLat.lat, lngLat.lng);
        });

        // Allow click to set location
        mapRef.current.on('click', (e: any) => {
          const { lng, lat } = e.lngLat;
          markerRef.current.setLngLat([lng, lat]);
          onLocationChange(lat, lng);
        });
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [showMap]);

  // Update marker when coordinates change externally
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLngLat([longitude, latitude]);
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
      }
    }
  }, [latitude, longitude]);

  return (
    <div className={cn("space-y-3", className)}>
      {!showMap ? (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Navigation className="w-4 h-4 mr-2" />
            )}
            Use My Location
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleManualEntry}
            className="flex-1"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Set on Map
          </Button>
        </div>
      ) : (
        <>
          <div 
            ref={mapContainer} 
            className="w-full h-48 rounded-lg border border-border overflow-hidden bg-muted"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>
              {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
            </span>
            <span className="text-muted-foreground/60">• Click or drag marker to adjust</span>
          </div>
        </>
      )}
    </div>
  );
}
