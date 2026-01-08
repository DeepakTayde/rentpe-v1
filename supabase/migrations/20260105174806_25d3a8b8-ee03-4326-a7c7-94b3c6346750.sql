-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  visit_enabled BOOLEAN NOT NULL DEFAULT true,
  booking_enabled BOOLEAN NOT NULL DEFAULT true,
  maintenance_enabled BOOLEAN NOT NULL DEFAULT true,
  payment_enabled BOOLEAN NOT NULL DEFAULT true,
  system_enabled BOOLEAN NOT NULL DEFAULT true,
  lead_enabled BOOLEAN NOT NULL DEFAULT true,
  commission_enabled BOOLEAN NOT NULL DEFAULT true,
  property_enabled BOOLEAN NOT NULL DEFAULT true,
  service_enabled BOOLEAN NOT NULL DEFAULT true,
  agreement_enabled BOOLEAN NOT NULL DEFAULT true,
  email_notifications BOOLEAN NOT NULL DEFAULT false,
  push_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "Users can view their own preferences"
ON public.notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert their own preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update their own preferences"
ON public.notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Add updated_at trigger
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update create_notification function to check preferences
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}',
  p_action_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
  is_enabled BOOLEAN := true;
  pref_column TEXT;
BEGIN
  -- Check if user has preferences and if this notification type is enabled
  pref_column := p_type::text || '_enabled';
  
  EXECUTE format(
    'SELECT COALESCE((SELECT %I FROM public.notification_preferences WHERE user_id = $1), true)',
    pref_column
  ) INTO is_enabled USING p_user_id;
  
  -- Only create notification if enabled (or no preferences set - defaults to enabled)
  IF is_enabled THEN
    INSERT INTO public.notifications (user_id, type, title, message, data, action_url)
    VALUES (p_user_id, p_type, p_title, p_message, p_data, p_action_url)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
  END IF;
  
  RETURN NULL;
END;
$$;