import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a property search assistant for RentPe. Your job is to parse natural language property queries and extract structured search parameters.

Extract the following fields from user queries:
- property_type: one of "1rk", "1bhk", "2bhk", "3bhk", "4bhk", "villa", "pg" (null if not specified)
- min_budget: minimum rent in INR (null if not specified)
- max_budget: maximum rent in INR (null if not specified)  
- city: city name (null if not specified)
- locality: specific area/locality (null if not specified)
- furnishing: one of "fully_furnished", "semi_furnished", "unfurnished" (null if not specified)
- bedrooms: number of bedrooms (null if not specified)
- amenities: array of desired amenities like ["parking", "gym", "pool", "wifi", "ac"] (empty array if not specified)

Also provide:
- response_message: A friendly response message acknowledging the search
- suggestions: Array of 2-3 search refinement suggestions

Example input: "Show me 2BHK under 15k near Koramangala with parking"
Example output:
{
  "property_type": "2bhk",
  "max_budget": 15000,
  "locality": "Koramangala",
  "amenities": ["parking"],
  "response_message": "Looking for 2BHK apartments under ₹15,000 in Koramangala with parking...",
  "suggestions": ["Add furnishing preference", "Specify move-in date", "Include gym access"]
}

Always respond with valid JSON only. No markdown, no explanation.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, conversationHistory = [] } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing AI search query:", query);

    // Call AI to parse the query
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationHistory,
          { role: "user", content: query },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "{}";
    
    console.log("AI response:", aiContent);

    // Parse AI response
    let parsedFilters;
    try {
      // Clean the response - remove markdown code blocks if present
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedFilters = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      parsedFilters = {
        response_message: "I'll help you find properties. Could you tell me more about what you're looking for?",
        suggestions: ["Specify budget range", "Mention preferred location", "Add property type (1BHK, 2BHK, etc.)"]
      };
    }

    // Now fetch properties from database based on parsed filters
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    
    let propertyQuery = supabase
      .from("properties")
      .select(`
        id,
        title,
        locality,
        address,
        rent_amount,
        deposit_amount,
        bedrooms,
        bathrooms,
        area_sqft,
        furnishing,
        property_type,
        images,
        amenities,
        is_verified,
        city:cities(id, name)
      `)
      .eq("status", "verified")
      .order("created_at", { ascending: false })
      .limit(10);

    // Apply filters from AI parsing
    if (parsedFilters.property_type) {
      propertyQuery = propertyQuery.eq("property_type", parsedFilters.property_type);
    }
    if (parsedFilters.max_budget) {
      propertyQuery = propertyQuery.lte("rent_amount", parsedFilters.max_budget);
    }
    if (parsedFilters.min_budget) {
      propertyQuery = propertyQuery.gte("rent_amount", parsedFilters.min_budget);
    }
    if (parsedFilters.furnishing) {
      propertyQuery = propertyQuery.eq("furnishing", parsedFilters.furnishing);
    }
    if (parsedFilters.bedrooms) {
      propertyQuery = propertyQuery.eq("bedrooms", parsedFilters.bedrooms);
    }
    if (parsedFilters.locality) {
      propertyQuery = propertyQuery.ilike("locality", `%${parsedFilters.locality}%`);
    }

    const { data: properties, error: dbError } = await propertyQuery;

    if (dbError) {
      console.error("Database error:", dbError);
    }

    console.log(`Found ${properties?.length || 0} properties`);

    return new Response(JSON.stringify({
      filters: parsedFilters,
      properties: properties || [],
      message: parsedFilters.response_message || "Here are some properties for you",
      suggestions: parsedFilters.suggestions || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Property Search error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      properties: [],
      message: "Sorry, I couldn't process your search. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
