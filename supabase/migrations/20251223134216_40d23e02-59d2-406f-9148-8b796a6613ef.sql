
-- Create enum for commission types
CREATE TYPE public.commission_type AS ENUM ('owner_onboarding', 'tenant_placement', 'monthly_recurring');

-- Create enum for commission status
CREATE TYPE public.commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');

-- Create agent_commissions table
CREATE TABLE public.agent_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id),
  lead_id UUID REFERENCES public.owner_leads(id),
  booking_id UUID REFERENCES public.bookings(id),
  commission_type public.commission_type NOT NULL,
  base_amount INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  commission_amount INTEGER NOT NULL,
  status public.commission_status NOT NULL DEFAULT 'pending',
  description TEXT,
  month_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Agents can view their own commissions"
ON public.agent_commissions
FOR SELECT
USING (auth.uid() = agent_id);

CREATE POLICY "Admins can view all commissions"
ON public.agent_commissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all commissions"
ON public.agent_commissions
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create commissions"
ON public.agent_commissions
FOR INSERT
WITH CHECK (true);

-- Function to create owner onboarding commission (10%)
CREATE OR REPLACE FUNCTION public.create_onboarding_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  property_rent INTEGER;
BEGIN
  -- Only trigger when status changes to 'onboarded'
  IF NEW.status = 'onboarded' AND OLD.status != 'onboarded' AND NEW.agent_id IS NOT NULL THEN
    -- Get expected rent from lead
    property_rent := COALESCE(NEW.expected_rent, 10000);
    
    -- Create 10% commission
    INSERT INTO public.agent_commissions (
      agent_id,
      lead_id,
      commission_type,
      base_amount,
      percentage,
      commission_amount,
      description
    ) VALUES (
      NEW.agent_id,
      NEW.id,
      'owner_onboarding',
      property_rent,
      10.00,
      (property_rent * 10) / 100,
      'Owner onboarding commission for ' || NEW.owner_name
    );
    
    -- Update agent's completed verifications
    UPDATE public.agent_profiles
    SET completed_verifications = COALESCE(completed_verifications, 0) + 1,
        pending_verifications = GREATEST(COALESCE(pending_verifications, 0) - 1, 0)
    WHERE user_id = NEW.agent_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for owner onboarding commission
CREATE TRIGGER on_lead_onboarded
  AFTER UPDATE ON public.owner_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.create_onboarding_commission();

-- Function to create tenant placement commission (15%)
CREATE OR REPLACE FUNCTION public.create_placement_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  property_agent_id UUID;
  prop_id UUID;
BEGIN
  -- Only trigger when status changes to 'approved' and agreement is accepted
  IF NEW.status = 'approved' AND OLD.status != 'approved' AND NEW.agreement_accepted = true THEN
    -- Get agent from property
    SELECT agent_id, id INTO property_agent_id, prop_id
    FROM public.properties
    WHERE id = NEW.property_id;
    
    IF property_agent_id IS NOT NULL THEN
      -- Create 15% commission
      INSERT INTO public.agent_commissions (
        agent_id,
        property_id,
        booking_id,
        commission_type,
        base_amount,
        percentage,
        commission_amount,
        description
      ) VALUES (
        property_agent_id,
        NEW.property_id,
        NEW.id,
        'tenant_placement',
        NEW.rent_amount,
        15.00,
        (NEW.rent_amount * 15) / 100,
        'Tenant placement commission for ' || NEW.tenant_name
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for tenant placement commission
CREATE TRIGGER on_booking_approved
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.create_placement_commission();

-- Add updated_at trigger
CREATE TRIGGER update_agent_commissions_updated_at
  BEFORE UPDATE ON public.agent_commissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
