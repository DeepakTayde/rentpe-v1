import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Suggestion {
  id?: string;
  name: string;
  type: "property" | "locality";
  city: string;
  subtext?: string;
}

export const useSearchSuggestions = (searchQuery: string, cityName: string) => {
  return useQuery({
    queryKey: ["search-suggestions", searchQuery, cityName],
    queryFn: async (): Promise<Suggestion[]> => {
      if (!searchQuery.trim() || searchQuery.length < 2) return [];

      const query = searchQuery.toLowerCase();
      const suggestions: Suggestion[] = [];

      // Fetch properties matching the search
      const { data: properties } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          locality,
          address,
          rent_amount,
          property_type,
          city:cities(name)
        `)
        .eq("status", "verified")
        .eq("is_verified", true)
        .or(`title.ilike.%${searchQuery}%,locality.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`)
        .limit(5);

      // Fetch distinct localities from properties
      const { data: localities } = await supabase
        .from("properties")
        .select(`
          locality,
          city:cities(name)
        `)
        .eq("status", "verified")
        .eq("is_verified", true)
        .ilike("locality", `%${searchQuery}%`)
        .limit(10);

      // Get unique localities matching the city
      const uniqueLocalities = new Set<string>();
      localities?.forEach((l) => {
        const city = (l.city as { name: string })?.name;
        if (city === cityName && !uniqueLocalities.has(l.locality)) {
          uniqueLocalities.add(l.locality);
          suggestions.push({
            name: l.locality,
            type: "locality",
            city: cityName,
          });
        }
      });

      // Add matching properties
      properties?.forEach((p) => {
        const city = (p.city as { name: string })?.name;
        if (city === cityName) {
          suggestions.push({
            id: p.id,
            name: p.title,
            type: "property",
            city: cityName,
            subtext: `₹${p.rent_amount?.toLocaleString("en-IN")}/mo • ${p.locality}`,
          });
        }
      });

      return suggestions.slice(0, 8);
    },
    enabled: searchQuery.length >= 2,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
};
