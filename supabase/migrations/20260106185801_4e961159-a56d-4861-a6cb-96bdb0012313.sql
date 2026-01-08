-- Property Alerts/Radar table
CREATE TABLE public.property_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Alert',
  city_id UUID REFERENCES public.cities(id),
  property_type public.property_type,
  min_budget INTEGER,
  max_budget INTEGER,
  min_bedrooms INTEGER,
  max_bedrooms INTEGER,
  furnishing public.furnishing_status,
  localities TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  notify_email BOOLEAN NOT NULL DEFAULT true,
  notify_push BOOLEAN NOT NULL DEFAULT true,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Boost/Promoted Listings table
CREATE TABLE public.property_boosts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  boost_type TEXT NOT NULL CHECK (boost_type IN ('featured', 'premium', 'spotlight')),
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_boosts ENABLE ROW LEVEL SECURITY;

-- Property Alerts RLS policies
CREATE POLICY "Users can view their own alerts"
  ON public.property_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
  ON public.property_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.property_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON public.property_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Property Boosts RLS policies
CREATE POLICY "Anyone can view active boosts"
  ON public.property_boosts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners can create boosts for their properties"
  ON public.property_boosts FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their boosts"
  ON public.property_boosts FOR UPDATE
  USING (auth.uid() = owner_id);

-- Update triggers
CREATE TRIGGER update_property_alerts_updated_at
  BEFORE UPDATE ON public.property_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();