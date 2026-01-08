import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, Database } from "@/integrations/supabase/types";

export type Property = Tables<"properties"> & {
  city?: {
    id: string;
    name: string;
    state: string;
  };
};

type PropertyType = Database["public"]["Enums"]["property_type"];
type FurnishingStatus = Database["public"]["Enums"]["furnishing_status"];

interface UsePropertiesOptions {
  cityId?: string;
  cityName?: string;
  searchQuery?: string;
  propertyType?: PropertyType;
  furnishing?: FurnishingStatus;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
}

export const useProperties = (options: UsePropertiesOptions = {}) => {
  return useQuery({
    queryKey: ["properties", options],
    queryFn: async (): Promise<Property[]> => {
      let query = supabase
        .from("properties")
        .select(`
          *,
          city:cities(id, name, state)
        `)
        .eq("status", "verified")
        .eq("is_verified", true)
        .order("created_at", { ascending: false });

      // Filter by city ID
      if (options.cityId) {
        query = query.eq("city_id", options.cityId);
      }

      // Filter by property type
      if (options.propertyType) {
        query = query.eq("property_type", options.propertyType);
      }

      // Filter by furnishing
      if (options.furnishing) {
        query = query.eq("furnishing", options.furnishing);
      }

      // Filter by rent range
      if (options.minRent) {
        query = query.gte("rent_amount", options.minRent);
      }
      if (options.maxRent) {
        query = query.lte("rent_amount", options.maxRent);
      }

      // Filter by bedrooms
      if (options.bedrooms) {
        query = query.eq("bedrooms", options.bedrooms);
      }

      const { data, error } = await query;

      if (error) throw error;

      let properties = (data || []) as Property[];

      // Filter by city name if provided (from URL)
      if (options.cityName) {
        properties = properties.filter(
          (p) => p.city?.name?.toLowerCase() === options.cityName?.toLowerCase()
        );
      }

      // Filter by search query (locality, title, address)
      if (options.searchQuery) {
        const q = options.searchQuery.toLowerCase();
        properties = properties.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.locality.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q)
        );
      }

      return properties;
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async (): Promise<Property | null> => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          city:cities(id, name, state)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Property | null;
    },
    enabled: !!id,
  });
};
