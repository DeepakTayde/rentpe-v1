import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CityWithCount {
  id: string;
  name: string;
  state: string;
  propertyCount: number;
}

export const useCities = () => {
  return useQuery({
    queryKey: ["cities-with-counts"],
    queryFn: async (): Promise<CityWithCount[]> => {
      // Fetch cities
      const { data: cities, error: citiesError } = await supabase
        .from("cities")
        .select("id, name, state")
        .eq("is_active", true)
        .order("name");

      if (citiesError) throw citiesError;

      // Fetch property counts per city (only verified properties)
      const { data: propertyCounts, error: countsError } = await supabase
        .from("properties")
        .select("city_id")
        .eq("status", "verified")
        .eq("is_verified", true);

      if (countsError) throw countsError;

      // Count properties per city
      const countMap = new Map<string, number>();
      propertyCounts?.forEach((p) => {
        const count = countMap.get(p.city_id) || 0;
        countMap.set(p.city_id, count + 1);
      });

      return (cities || []).map((city) => ({
        id: city.id,
        name: city.name,
        state: city.state,
        propertyCount: countMap.get(city.id) || 0,
      }));
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// localStorage key for city persistence
const SELECTED_CITY_KEY = "rentkar_selected_city";

export const getPersistedCity = (): string | null => {
  try {
    return localStorage.getItem(SELECTED_CITY_KEY);
  } catch {
    return null;
  }
};

export const persistCity = (cityName: string): void => {
  try {
    localStorage.setItem(SELECTED_CITY_KEY, cityName);
  } catch {
    // Ignore localStorage errors
  }
};
