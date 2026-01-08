import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AISearchFilters {
  property_type?: string;
  min_budget?: number;
  max_budget?: number;
  city?: string;
  locality?: string;
  furnishing?: string;
  bedrooms?: number;
  amenities?: string[];
  response_message?: string;
  suggestions?: string[];
}

export interface AISearchProperty {
  id: string;
  title: string;
  locality: string;
  address: string;
  rent_amount: number;
  deposit_amount: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  furnishing: string;
  property_type: string;
  images: string[] | null;
  amenities: string[] | null;
  is_verified: boolean;
  city: { id: string; name: string } | null;
}

export interface AISearchResult {
  filters: AISearchFilters;
  properties: AISearchProperty[];
  message: string;
  suggestions: string[];
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export function useAIPropertySearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);

  const search = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-property-search", {
        body: { query, conversationHistory },
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: query },
        { role: "assistant", content: data.message }
      ]);

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
    setResult(null);
    setError(null);
  }, []);

  return {
    search,
    isLoading,
    error,
    result,
    conversationHistory,
    clearHistory,
  };
}
