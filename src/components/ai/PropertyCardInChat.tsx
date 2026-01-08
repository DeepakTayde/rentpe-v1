import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  title: string;
  locality: string;
  city?: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  propertyType: string;
  furnishing: string;
  image?: string;
  isBoosted?: boolean;
  onScheduleVisit?: () => void;
}

export function PropertyCardInChat({
  id,
  title,
  locality,
  city,
  rent,
  deposit,
  bedrooms,
  bathrooms,
  area,
  propertyType,
  furnishing,
  image,
  isBoosted,
  onScheduleVisit,
}: PropertyCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        isBoosted && "ring-2 ring-primary/50"
      )}
    >
      {/* Image */}
      <div className="relative h-32 bg-muted">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Square className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {isBoosted && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="font-semibold">
            ₹{rent.toLocaleString()}/mo
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <h4 className="font-semibold text-sm line-clamp-1">{title}</h4>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {locality}{city && `, ${city}`}
          </p>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {bedrooms} Bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {bathrooms} Bath
          </span>
          {area && (
            <span className="flex items-center gap-1">
              <Square className="w-3 h-3" />
              {area} sqft
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {propertyType.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {furnishing.replace('_', ' ')}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-7 text-xs"
            onClick={() => navigate(`/properties/${id}`)}
          >
            View Details
          </Button>
          {onScheduleVisit && (
            <Button 
              size="sm" 
              className="flex-1 h-7 text-xs"
              onClick={onScheduleVisit}
            >
              Schedule Visit
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Quick action buttons for chat
interface ActionButtonsProps {
  actions: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  onAction: (action: string) => void;
}

export function ActionButtonsInChat({ actions, onAction }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          size="sm"
          variant={action.variant || 'outline'}
          className="h-7 text-xs"
          onClick={() => onAction(action.action)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
