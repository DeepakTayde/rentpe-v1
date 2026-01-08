-- Create notification type enum
CREATE TYPE public.notification_type AS ENUM (
  'visit',
  'booking', 
  'maintenance',
  'payment',
  'system',
  'lead',
  'commission',
  'property',
  'service',
  'agreement'
);

-- Create unified notifications table for all roles
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

-- System can insert notifications for any user (via triggers/functions)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to create a notification
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
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data, action_url)
  VALUES (p_user_id, p_type, p_title, p_message, p_data, p_action_url)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger: Notify owner when property is booked
CREATE OR REPLACE FUNCTION public.notify_on_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  property_owner_id UUID;
  property_title TEXT;
BEGIN
  -- Get property owner
  SELECT owner_id, title INTO property_owner_id, property_title
  FROM public.properties
  WHERE id = NEW.property_id;
  
  IF property_owner_id IS NOT NULL THEN
    -- Notify owner about new booking
    PERFORM public.create_notification(
      property_owner_id,
      'booking',
      'New Booking Request',
      'You have a new booking request for ' || COALESCE(property_title, 'your property') || ' from ' || NEW.tenant_name,
      jsonb_build_object('booking_id', NEW.id, 'property_id', NEW.property_id),
      '/owner/dashboard'
    );
  END IF;
  
  -- Notify tenant about booking confirmation
  IF NEW.tenant_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.tenant_id,
      'booking',
      'Booking Submitted',
      'Your booking request for ' || COALESCE(property_title, 'the property') || ' has been submitted',
      jsonb_build_object('booking_id', NEW.id, 'property_id', NEW.property_id),
      '/tenant/dashboard'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_created
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_booking();

-- Trigger: Notify on booking status change
CREATE OR REPLACE FUNCTION public.notify_on_booking_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  property_title TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title INTO property_title
    FROM public.properties
    WHERE id = NEW.property_id;
    
    -- Notify tenant about status change
    IF NEW.tenant_id IS NOT NULL THEN
      PERFORM public.create_notification(
        NEW.tenant_id,
        'booking',
        'Booking ' || INITCAP(NEW.status::text),
        'Your booking for ' || COALESCE(property_title, 'the property') || ' has been ' || NEW.status::text,
        jsonb_build_object('booking_id', NEW.id, 'status', NEW.status),
        '/tenant/dashboard'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_status_changed
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_booking_status_change();

-- Trigger: Notify agent on new lead assignment
CREATE OR REPLACE FUNCTION public.notify_agent_on_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.agent_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.agent_id,
      'lead',
      'New Lead Assigned',
      'New owner lead: ' || NEW.owner_name || ' in ' || COALESCE(NEW.property_locality, 'your area'),
      jsonb_build_object('lead_id', NEW.id, 'owner_name', NEW.owner_name),
      '/agent/dashboard'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_lead_assigned
AFTER INSERT ON public.owner_leads
FOR EACH ROW
EXECUTE FUNCTION public.notify_agent_on_lead();

-- Trigger: Notify agent on commission earned
CREATE OR REPLACE FUNCTION public.notify_on_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.agent_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.agent_id,
      'commission',
      'Commission Earned!',
      'You earned ₹' || NEW.commission_amount || ' - ' || COALESCE(NEW.description, NEW.commission_type::text),
      jsonb_build_object('commission_id', NEW.id, 'amount', NEW.commission_amount),
      '/agent/dashboard'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_commission_created
AFTER INSERT ON public.agent_commissions
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_commission();

-- Trigger: Notify on lead status change
CREATE OR REPLACE FUNCTION public.notify_on_lead_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.agent_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.agent_id,
      'lead',
      'Lead Status Updated',
      'Lead ' || NEW.owner_name || ' is now ' || REPLACE(NEW.status::text, '_', ' '),
      jsonb_build_object('lead_id', NEW.id, 'status', NEW.status),
      '/agent/dashboard'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_lead_status_changed
AFTER UPDATE ON public.owner_leads
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_lead_status_change();