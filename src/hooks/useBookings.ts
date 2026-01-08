import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Booking {
  id: string;
  property_id: string;
  tenant_id: string;
  owner_id: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  move_in_date: string;
  rent_amount: number;
  deposit_amount: number;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
  tenant_occupation: string | null;
  emergency_contact: string | null;
  agreement_accepted: boolean;
  agreement_accepted_at: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  payment_date: string | null;
  owner_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  property?: {
    title: string;
    address: string;
    locality: string;
  };
}

export function useBookings() {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          property:properties(title, address, locality)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion since the generated types may not include bookings yet
      setBookings((data as unknown as Booking[]) || []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const createBooking = async (bookingData: {
    property_id: string;
    owner_id: string;
    move_in_date: string;
    rent_amount: number;
    deposit_amount: number;
    tenant_name: string;
    tenant_email: string;
    tenant_phone: string;
    tenant_occupation?: string;
    emergency_contact?: string;
  }) => {
    if (!user) {
      toast.error("Please sign in to book a property");
      return { error: new Error("Not authenticated") };
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          ...bookingData,
          tenant_id: user.id,
          agreement_accepted: true,
          agreement_accepted_at: new Date().toISOString(),
          payment_status: "completed",
          payment_amount: bookingData.rent_amount + bookingData.deposit_amount,
          payment_date: new Date().toISOString(),
        } as any)
        .select()
        .single();

      if (error) throw error;

      await fetchBookings();
      return { data, error: null };
    } catch (error: any) {
      console.error("Error creating booking:", error);
      return { data: null, error };
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: "approved" | "rejected" | "cancelled",
    notes?: string
  ) => {
    try {
      const updateData: Record<string, unknown> = { status };
      if (status === "rejected" && notes) {
        updateData.rejection_reason = notes;
      } else if (notes) {
        updateData.owner_notes = notes;
      }

      const { error } = await supabase
        .from("bookings")
        .update(updateData as any)
        .eq("id", bookingId);

      if (error) throw error;

      await fetchBookings();
      toast.success(`Booking ${status} successfully`);
      return { error: null };
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
      return { error };
    }
  };

  return {
    bookings,
    isLoading,
    createBooking,
    updateBookingStatus,
    refetch: fetchBookings,
  };
}
