-- Create role enum
CREATE TYPE public.app_role AS ENUM ('tenant', 'owner', 'agent', 'vendor', 'technician', 'admin');

-- Create profiles table with common fields
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  city_id UUID REFERENCES public.cities(id),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Role-specific tables

-- Tenant-specific data
CREATE TABLE public.tenant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_property_id UUID REFERENCES public.properties(id),
  wallet_balance INTEGER DEFAULT 0,
  emergency_contact TEXT,
  move_in_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Owner-specific data
CREATE TABLE public.owner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  pan_number TEXT,
  total_earnings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agent-specific data
CREATE TABLE public.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  assigned_areas TEXT[],
  completed_verifications INTEGER DEFAULT 0,
  pending_verifications INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor-specific data
CREATE TABLE public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  service_types TEXT[],
  service_areas TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Technician-specific data
CREATE TABLE public.technician_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  specializations TEXT[],
  service_areas TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (read-only for users, admins can manage)
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow new users to insert their own role during signup
CREATE POLICY "Users can insert their own role on signup"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS for role-specific tables (users can only access their own data)
CREATE POLICY "Users can manage their tenant profile"
ON public.tenant_profiles FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tenant profiles"
ON public.tenant_profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their owner profile"
ON public.owner_profiles FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all owner profiles"
ON public.owner_profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their agent profile"
ON public.agent_profiles FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all agent profiles"
ON public.agent_profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their vendor profile"
ON public.vendor_profiles FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all vendor profiles"
ON public.vendor_profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their technician profile"
ON public.technician_profiles FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all technician profiles"
ON public.technician_profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_profiles_updated_at
BEFORE UPDATE ON public.tenant_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_owner_profiles_updated_at
BEFORE UPDATE ON public.owner_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_profiles_updated_at
BEFORE UPDATE ON public.agent_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at
BEFORE UPDATE ON public.vendor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technician_profiles_updated_at
BEFORE UPDATE ON public.technician_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();