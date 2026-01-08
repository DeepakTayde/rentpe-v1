-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'completed');

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  move_in_date DATE NOT NULL,
  rent_amount INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT NOT NULL,
  tenant_phone TEXT NOT NULL,
  tenant_occupation TEXT,
  emergency_contact TEXT,
  agreement_accepted BOOLEAN NOT NULL DEFAULT false,
  agreement_accepted_at TIMESTAMP WITH TIME ZONE,
  payment_status TEXT DEFAULT 'pending',
  payment_amount INTEGER,
  payment_date TIMESTAMP WITH TIME ZONE,
  owner_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Tenants can view their own bookings
CREATE POLICY "Tenants can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = tenant_id);

-- Tenants can create bookings
CREATE POLICY "Tenants can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = tenant_id);

-- Tenants can update their own pending bookings (cancel)
CREATE POLICY "Tenants can update their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = tenant_id AND status = 'pending');

-- Owners can view bookings for their properties
CREATE POLICY "Owners can view bookings for their properties"
ON public.bookings
FOR SELECT
USING (auth.uid() = owner_id);

-- Owners can update bookings for their properties (approve/reject)
CREATE POLICY "Owners can update bookings for their properties"
ON public.bookings
FOR UPDATE
USING (auth.uid() = owner_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all bookings
CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();