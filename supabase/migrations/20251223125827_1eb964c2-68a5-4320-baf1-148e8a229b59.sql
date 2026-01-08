-- Create lead status enum
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'visit_scheduled', 'visit_completed', 'onboarded', 'rejected', 'lost');

-- Create owner leads table for agent assignment
CREATE TABLE public.owner_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  agent_id UUID,
  property_address TEXT NOT NULL,
  property_locality TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id),
  status public.lead_status NOT NULL DEFAULT 'new',
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,
  expected_rent INTEGER,
  property_type public.property_type DEFAULT '2bhk',
  bedrooms INTEGER DEFAULT 2,
  notes TEXT,
  agent_notes TEXT,
  contact_attempts INTEGER DEFAULT 0,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  visit_scheduled_at TIMESTAMP WITH TIME ZONE,
  visit_completed_at TIMESTAMP WITH TIME ZONE,
  onboarded_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.owner_leads ENABLE ROW LEVEL SECURITY;

-- Agents can view leads assigned to them
CREATE POLICY "Agents can view their assigned leads"
ON public.owner_leads
FOR SELECT
USING (auth.uid() = agent_id);

-- Agents can update leads assigned to them
CREATE POLICY "Agents can update their assigned leads"
ON public.owner_leads
FOR UPDATE
USING (auth.uid() = agent_id);

-- Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.owner_leads
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all leads
CREATE POLICY "Admins can manage all leads"
ON public.owner_leads
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Owners can create leads (self-registration)
CREATE POLICY "Anyone can create leads"
ON public.owner_leads
FOR INSERT
WITH CHECK (true);

-- Create agent notifications table
CREATE TABLE public.agent_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_notifications ENABLE ROW LEVEL SECURITY;

-- Agents can view their notifications
CREATE POLICY "Agents can view their notifications"
ON public.agent_notifications
FOR SELECT
USING (auth.uid() = agent_id);

-- Agents can update their notifications (mark as read)
CREATE POLICY "Agents can update their notifications"
ON public.agent_notifications
FOR UPDATE
USING (auth.uid() = agent_id);

-- System can create notifications (using service role)
CREATE POLICY "System can create notifications"
ON public.agent_notifications
FOR INSERT
WITH CHECK (true);

-- Create trigger for updated_at on owner_leads
CREATE TRIGGER update_owner_leads_updated_at
BEFORE UPDATE ON public.owner_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-assign lead to nearest available agent
CREATE OR REPLACE FUNCTION public.assign_lead_to_agent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  available_agent_id UUID;
BEGIN
  -- Find an available agent (simple round-robin for now)
  SELECT ap.user_id INTO available_agent_id
  FROM public.agent_profiles ap
  WHERE ap.is_available = true
  ORDER BY ap.pending_verifications ASC, RANDOM()
  LIMIT 1;
  
  IF available_agent_id IS NOT NULL THEN
    NEW.agent_id := available_agent_id;
    
    -- Update agent's pending count
    UPDATE public.agent_profiles 
    SET pending_verifications = COALESCE(pending_verifications, 0) + 1
    WHERE user_id = available_agent_id;
    
    -- Create notification for agent
    INSERT INTO public.agent_notifications (agent_id, type, title, message, data)
    VALUES (
      available_agent_id,
      'new_lead',
      'New Owner Lead Assigned',
      'A new property owner has been assigned to you: ' || NEW.owner_name,
      jsonb_build_object('lead_id', NEW.id, 'owner_name', NEW.owner_name, 'locality', NEW.property_locality)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign leads
CREATE TRIGGER auto_assign_lead
BEFORE INSERT ON public.owner_leads
FOR EACH ROW
WHEN (NEW.agent_id IS NULL)
EXECUTE FUNCTION public.assign_lead_to_agent();