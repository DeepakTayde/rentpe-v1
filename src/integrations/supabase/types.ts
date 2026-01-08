export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_commissions: {
        Row: {
          agent_id: string
          approved_at: string | null
          base_amount: number
          booking_id: string | null
          commission_amount: number
          commission_type: Database["public"]["Enums"]["commission_type"]
          created_at: string
          description: string | null
          id: string
          lead_id: string | null
          month_year: string | null
          paid_at: string | null
          percentage: number
          property_id: string | null
          status: Database["public"]["Enums"]["commission_status"]
          updated_at: string
        }
        Insert: {
          agent_id: string
          approved_at?: string | null
          base_amount: number
          booking_id?: string | null
          commission_amount: number
          commission_type: Database["public"]["Enums"]["commission_type"]
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string | null
          month_year?: string | null
          paid_at?: string | null
          percentage: number
          property_id?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Update: {
          agent_id?: string
          approved_at?: string | null
          base_amount?: number
          booking_id?: string | null
          commission_amount?: number
          commission_type?: Database["public"]["Enums"]["commission_type"]
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string | null
          month_year?: string | null
          paid_at?: string | null
          percentage?: number
          property_id?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "owner_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_notifications: {
        Row: {
          agent_id: string
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      agent_profiles: {
        Row: {
          assigned_areas: string[] | null
          completed_verifications: number | null
          created_at: string
          id: string
          is_available: boolean | null
          pending_verifications: number | null
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_areas?: string[] | null
          completed_verifications?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          pending_verifications?: number | null
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_areas?: string[] | null
          completed_verifications?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          pending_verifications?: number | null
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          agreement_accepted: boolean
          agreement_accepted_at: string | null
          created_at: string
          deposit_amount: number
          emergency_contact: string | null
          id: string
          move_in_date: string
          owner_id: string
          owner_notes: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_status: string | null
          property_id: string
          rejection_reason: string | null
          rent_amount: number
          status: Database["public"]["Enums"]["booking_status"]
          tenant_email: string
          tenant_id: string
          tenant_name: string
          tenant_occupation: string | null
          tenant_phone: string
          updated_at: string
        }
        Insert: {
          agreement_accepted?: boolean
          agreement_accepted_at?: string | null
          created_at?: string
          deposit_amount: number
          emergency_contact?: string | null
          id?: string
          move_in_date: string
          owner_id: string
          owner_notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          property_id: string
          rejection_reason?: string | null
          rent_amount: number
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_email: string
          tenant_id: string
          tenant_name: string
          tenant_occupation?: string | null
          tenant_phone: string
          updated_at?: string
        }
        Update: {
          agreement_accepted?: boolean
          agreement_accepted_at?: string | null
          created_at?: string
          deposit_amount?: number
          emergency_contact?: string | null
          id?: string
          move_in_date?: string
          owner_id?: string
          owner_notes?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          property_id?: string
          rejection_reason?: string | null
          rent_amount?: number
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_email?: string
          tenant_id?: string
          tenant_name?: string
          tenant_occupation?: string | null
          tenant_phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          state: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          state: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          state?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          agreement_enabled: boolean
          booking_enabled: boolean
          commission_enabled: boolean
          created_at: string
          email_notifications: boolean
          id: string
          lead_enabled: boolean
          maintenance_enabled: boolean
          payment_enabled: boolean
          property_enabled: boolean
          push_notifications: boolean
          service_enabled: boolean
          system_enabled: boolean
          updated_at: string
          user_id: string
          visit_enabled: boolean
        }
        Insert: {
          agreement_enabled?: boolean
          booking_enabled?: boolean
          commission_enabled?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          lead_enabled?: boolean
          maintenance_enabled?: boolean
          payment_enabled?: boolean
          property_enabled?: boolean
          push_notifications?: boolean
          service_enabled?: boolean
          system_enabled?: boolean
          updated_at?: string
          user_id: string
          visit_enabled?: boolean
        }
        Update: {
          agreement_enabled?: boolean
          booking_enabled?: boolean
          commission_enabled?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          lead_enabled?: boolean
          maintenance_enabled?: boolean
          payment_enabled?: boolean
          property_enabled?: boolean
          push_notifications?: boolean
          service_enabled?: boolean
          system_enabled?: boolean
          updated_at?: string
          user_id?: string
          visit_enabled?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      owner_leads: {
        Row: {
          agent_id: string | null
          agent_notes: string | null
          bedrooms: number | null
          city_id: string | null
          contact_attempts: number | null
          created_at: string
          expected_rent: number | null
          id: string
          images: string[] | null
          last_contact_at: string | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          onboarded_at: string | null
          owner_email: string | null
          owner_id: string
          owner_name: string
          owner_phone: string
          property_address: string
          property_locality: string
          property_type: Database["public"]["Enums"]["property_type"] | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          visit_completed_at: string | null
          visit_scheduled_at: string | null
        }
        Insert: {
          agent_id?: string | null
          agent_notes?: string | null
          bedrooms?: number | null
          city_id?: string | null
          contact_attempts?: number | null
          created_at?: string
          expected_rent?: number | null
          id?: string
          images?: string[] | null
          last_contact_at?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          onboarded_at?: string | null
          owner_email?: string | null
          owner_id: string
          owner_name: string
          owner_phone: string
          property_address: string
          property_locality: string
          property_type?: Database["public"]["Enums"]["property_type"] | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          visit_completed_at?: string | null
          visit_scheduled_at?: string | null
        }
        Update: {
          agent_id?: string | null
          agent_notes?: string | null
          bedrooms?: number | null
          city_id?: string | null
          contact_attempts?: number | null
          created_at?: string
          expected_rent?: number | null
          id?: string
          images?: string[] | null
          last_contact_at?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          onboarded_at?: string | null
          owner_email?: string | null
          owner_id?: string
          owner_name?: string
          owner_phone?: string
          property_address?: string
          property_locality?: string
          property_type?: Database["public"]["Enums"]["property_type"] | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          visit_completed_at?: string | null
          visit_scheduled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_leads_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_profiles: {
        Row: {
          bank_account_number: string | null
          bank_ifsc: string | null
          created_at: string
          id: string
          pan_number: string | null
          total_earnings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string
          id?: string
          pan_number?: string | null
          total_earnings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_account_number?: string | null
          bank_ifsc?: string | null
          created_at?: string
          id?: string
          pan_number?: string | null
          total_earnings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          agent_id: string | null
          amenities: string[] | null
          area_sqft: number | null
          available_from: string
          bathrooms: number
          bedrooms: number
          city_id: string
          created_at: string
          deposit_amount: number
          description: string | null
          floor_number: number | null
          furnishing: Database["public"]["Enums"]["furnishing_status"]
          id: string
          images: string[] | null
          is_verified: boolean
          latitude: number | null
          locality: string
          longitude: number | null
          owner_id: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          rent_amount: number
          rules: string[] | null
          status: Database["public"]["Enums"]["property_status"]
          title: string
          total_floors: number | null
          updated_at: string
        }
        Insert: {
          address: string
          agent_id?: string | null
          amenities?: string[] | null
          area_sqft?: number | null
          available_from?: string
          bathrooms?: number
          bedrooms?: number
          city_id: string
          created_at?: string
          deposit_amount: number
          description?: string | null
          floor_number?: number | null
          furnishing?: Database["public"]["Enums"]["furnishing_status"]
          id?: string
          images?: string[] | null
          is_verified?: boolean
          latitude?: number | null
          locality: string
          longitude?: number | null
          owner_id?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          rent_amount: number
          rules?: string[] | null
          status?: Database["public"]["Enums"]["property_status"]
          title: string
          total_floors?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          agent_id?: string | null
          amenities?: string[] | null
          area_sqft?: number | null
          available_from?: string
          bathrooms?: number
          bedrooms?: number
          city_id?: string
          created_at?: string
          deposit_amount?: number
          description?: string | null
          floor_number?: number | null
          furnishing?: Database["public"]["Enums"]["furnishing_status"]
          id?: string
          images?: string[] | null
          is_verified?: boolean
          latitude?: number | null
          locality?: string
          longitude?: number | null
          owner_id?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          rent_amount?: number
          rules?: string[] | null
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
          total_floors?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      property_alerts: {
        Row: {
          city_id: string | null
          created_at: string
          furnishing: Database["public"]["Enums"]["furnishing_status"] | null
          id: string
          is_active: boolean
          last_notified_at: string | null
          localities: string[] | null
          max_bedrooms: number | null
          max_budget: number | null
          min_bedrooms: number | null
          min_budget: number | null
          name: string
          notify_email: boolean
          notify_push: boolean
          property_type: Database["public"]["Enums"]["property_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          furnishing?: Database["public"]["Enums"]["furnishing_status"] | null
          id?: string
          is_active?: boolean
          last_notified_at?: string | null
          localities?: string[] | null
          max_bedrooms?: number | null
          max_budget?: number | null
          min_bedrooms?: number | null
          min_budget?: number | null
          name?: string
          notify_email?: boolean
          notify_push?: boolean
          property_type?: Database["public"]["Enums"]["property_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          furnishing?: Database["public"]["Enums"]["furnishing_status"] | null
          id?: string
          is_active?: boolean
          last_notified_at?: string | null
          localities?: string[] | null
          max_bedrooms?: number | null
          max_budget?: number | null
          min_bedrooms?: number | null
          min_budget?: number | null
          name?: string
          notify_email?: boolean
          notify_push?: boolean
          property_type?: Database["public"]["Enums"]["property_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_alerts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      property_boosts: {
        Row: {
          amount_paid: number
          boost_type: string
          clicks: number
          created_at: string
          ends_at: string
          id: string
          impressions: number
          is_active: boolean
          owner_id: string
          property_id: string
          starts_at: string
        }
        Insert: {
          amount_paid?: number
          boost_type: string
          clicks?: number
          created_at?: string
          ends_at: string
          id?: string
          impressions?: number
          is_active?: boolean
          owner_id: string
          property_id: string
          starts_at?: string
        }
        Update: {
          amount_paid?: number
          boost_type?: string
          clicks?: number
          created_at?: string
          ends_at?: string
          id?: string
          impressions?: number
          is_active?: boolean
          owner_id?: string
          property_id?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_boosts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_profiles: {
        Row: {
          completed_jobs: number | null
          created_at: string
          id: string
          is_available: boolean | null
          rating: number | null
          service_areas: string[] | null
          specializations: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_jobs?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          rating?: number | null
          service_areas?: string[] | null
          specializations?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_jobs?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          rating?: number | null
          service_areas?: string[] | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tenant_profiles: {
        Row: {
          created_at: string
          current_property_id: string | null
          emergency_contact: string | null
          id: string
          move_in_date: string | null
          updated_at: string
          user_id: string
          wallet_balance: number | null
        }
        Insert: {
          created_at?: string
          current_property_id?: string | null
          emergency_contact?: string | null
          id?: string
          move_in_date?: string | null
          updated_at?: string
          user_id: string
          wallet_balance?: number | null
        }
        Update: {
          created_at?: string
          current_property_id?: string | null
          emergency_contact?: string | null
          id?: string
          move_in_date?: string | null
          updated_at?: string
          user_id?: string
          wallet_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_profiles_current_property_id_fkey"
            columns: ["current_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_profiles: {
        Row: {
          business_name: string | null
          created_at: string
          id: string
          is_available: boolean | null
          rating: number | null
          service_areas: string[] | null
          service_types: string[] | null
          total_jobs: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          rating?: number | null
          service_areas?: string[] | null
          service_types?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          rating?: number | null
          service_areas?: string[] | null
          service_types?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          notes: string | null
          property_id: string
          scheduled_date: string
          scheduled_time: string
          status: Database["public"]["Enums"]["visit_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          property_id: string
          scheduled_date: string
          scheduled_time: string
          status?: Database["public"]["Enums"]["visit_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          property_id?: string
          scheduled_date?: string
          scheduled_time?: string
          status?: Database["public"]["Enums"]["visit_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_action_url?: string
          p_data?: Json
          p_message: string
          p_title: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_user_id: string
        }
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "tenant" | "owner" | "agent" | "vendor" | "technician" | "admin"
      booking_status:
        | "pending"
        | "approved"
        | "rejected"
        | "cancelled"
        | "completed"
      commission_status: "pending" | "approved" | "paid" | "cancelled"
      commission_type:
        | "owner_onboarding"
        | "tenant_placement"
        | "monthly_recurring"
      furnishing_status: "fully_furnished" | "semi_furnished" | "unfurnished"
      lead_status:
        | "new"
        | "contacted"
        | "visit_scheduled"
        | "visit_completed"
        | "onboarded"
        | "rejected"
        | "lost"
      notification_type:
        | "visit"
        | "booking"
        | "maintenance"
        | "payment"
        | "system"
        | "lead"
        | "commission"
        | "property"
        | "service"
        | "agreement"
      property_status: "pending" | "verified" | "rejected" | "rented"
      property_type: "1rk" | "1bhk" | "2bhk" | "3bhk" | "4bhk" | "villa" | "pg"
      visit_status: "pending" | "confirmed" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["tenant", "owner", "agent", "vendor", "technician", "admin"],
      booking_status: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
        "completed",
      ],
      commission_status: ["pending", "approved", "paid", "cancelled"],
      commission_type: [
        "owner_onboarding",
        "tenant_placement",
        "monthly_recurring",
      ],
      furnishing_status: ["fully_furnished", "semi_furnished", "unfurnished"],
      lead_status: [
        "new",
        "contacted",
        "visit_scheduled",
        "visit_completed",
        "onboarded",
        "rejected",
        "lost",
      ],
      notification_type: [
        "visit",
        "booking",
        "maintenance",
        "payment",
        "system",
        "lead",
        "commission",
        "property",
        "service",
        "agreement",
      ],
      property_status: ["pending", "verified", "rejected", "rented"],
      property_type: ["1rk", "1bhk", "2bhk", "3bhk", "4bhk", "villa", "pg"],
      visit_status: ["pending", "confirmed", "completed", "cancelled"],
    },
  },
} as const
