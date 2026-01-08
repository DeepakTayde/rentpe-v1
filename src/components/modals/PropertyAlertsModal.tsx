import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit2, 
  X,
  MapPin,
  Home,
  IndianRupee,
  BellRing,
  Mail,
  Smartphone
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePropertyAlerts, CreateAlertInput } from "@/hooks/usePropertyAlerts";
import { useCities } from "@/hooks/useCities";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = ['1rk', '1bhk', '2bhk', '3bhk', '4bhk', 'villa', 'pg'];
const FURNISHING_OPTIONS = ['fully_furnished', 'semi_furnished', 'unfurnished'];

export function PropertyAlertsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { alerts, isLoading, createAlert, updateAlert, deleteAlert } = usePropertyAlerts();
  const citiesQuery = useCities();
  const cities = citiesQuery.data || [];

  const [formData, setFormData] = useState<CreateAlertInput>({
    name: 'My Property Alert',
    city_id: null,
    property_type: null,
    min_budget: null,
    max_budget: null,
    min_bedrooms: null,
    max_bedrooms: null,
    furnishing: null,
    localities: null,
    is_active: true,
    notify_email: true,
    notify_push: true,
  });

  const handleCreate = async () => {
    await createAlert.mutateAsync(formData);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: 'My Property Alert',
      city_id: null,
      property_type: null,
      min_budget: null,
      max_budget: null,
      min_bedrooms: null,
      max_bedrooms: null,
      furnishing: null,
      localities: null,
      is_active: true,
      notify_email: true,
      notify_push: true,
    });
  };

  if (!user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            Set Alert
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Property Alerts</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <BellRing className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Sign in to create property alerts and get notified when new properties match your criteria.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="w-4 h-4" />
          Property Radar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" />
            Property Alerts
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Alert Name */}
              <div className="space-y-2">
                <Label>Alert Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 2BHK in Jabalpur under 15k"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  City
                </Label>
                <Select
                  value={formData.city_id || ''}
                  onValueChange={(v) => setFormData({ ...formData, city_id: v || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any city</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}, {city.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Property Type
                </Label>
                <Select
                  value={formData.property_type || ''}
                  onValueChange={(v) => setFormData({ ...formData, property_type: v || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Budget Range
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={formData.min_budget || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      min_budget: e.target.value ? parseInt(e.target.value) : null 
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={formData.max_budget || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      max_budget: e.target.value ? parseInt(e.target.value) : null 
                    })}
                  />
                </div>
              </div>

              {/* Furnishing */}
              <div className="space-y-2">
                <Label>Furnishing</Label>
                <Select
                  value={formData.furnishing || ''}
                  onValueChange={(v) => setFormData({ ...formData, furnishing: v || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any furnishing</SelectItem>
                    {FURNISHING_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-3 pt-2 border-t">
                <Label>Notify me via</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Email</span>
                  </div>
                  <Switch
                    checked={formData.notify_email}
                    onCheckedChange={(v) => setFormData({ ...formData, notify_email: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Push Notification</span>
                  </div>
                  <Switch
                    checked={formData.notify_push}
                    onCheckedChange={(v) => setFormData({ ...formData, notify_push: v })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsCreating(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={createAlert.isPending}
                >
                  {createAlert.isPending ? 'Creating...' : 'Create Alert'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Create Button */}
              <Button
                onClick={() => setIsCreating(true)}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Alert
              </Button>

              {/* Alerts List */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No alerts yet. Create one to get notified about new properties!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onToggle={(isActive) => updateAlert.mutate({ id: alert.id, is_active: isActive })}
                      onDelete={() => deleteAlert.mutate(alert.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function AlertCard({ 
  alert, 
  onToggle, 
  onDelete 
}: { 
  alert: any; 
  onToggle: (isActive: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <div className={cn(
      "p-4 rounded-lg border transition-colors",
      alert.is_active ? "bg-card" : "bg-muted/50 opacity-60"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium">{alert.name}</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {alert.property_type && (
              <Badge variant="secondary" className="text-xs">
                {alert.property_type.toUpperCase()}
              </Badge>
            )}
            {alert.max_budget && (
              <Badge variant="secondary" className="text-xs">
                ≤₹{alert.max_budget.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={alert.is_active}
            onCheckedChange={onToggle}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {alert.notify_email && (
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Email
          </span>
        )}
        {alert.notify_push && (
          <span className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            Push
          </span>
        )}
      </div>
    </div>
  );
}
