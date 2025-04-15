
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = "https://dxgscdegcjhejmqcvajc.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export class RegistrationService {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async updateRegistrationStatus(workshopId: string, userId: string, paymentId: string, status: string = 'paid') {
    const { data, error } = await this.supabase
      .from("workshop_registrations")
      .update({ 
        payment_status: status,
        status: "confirmed",
        payment_id: paymentId,
        updated_at: new Date().toISOString()
      })
      .eq("workshop_id", workshopId)
      .eq("user_id", userId)
      .in("payment_status", ["processing", "unpaid", "failed"]);

    if (error) {
      console.error("Error updating registration:", error);
      throw error;
    }

    return data;
  }

  async recalculateWorkshopSeats(workshopId: string) {
    try {
      console.log(`Recalculating seats for workshop ${workshopId}`);
      
      const { data: workshop, error: workshopError } = await this.supabase
        .from('workshops')
        .select('total_seats')
        .eq('id', workshopId)
        .single();
      
      if (workshopError) throw workshopError;
      
      const { count, error: countError } = await this.supabase
        .from('workshop_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('workshop_id', workshopId)
        .eq('payment_status', 'paid');
      
      if (countError) throw countError;
      
      const totalSeats = workshop.total_seats;
      const confirmedRegistrations = count || 0;
      const availableSeats = Math.max(0, totalSeats - confirmedRegistrations);
      
      const { error: updateError } = await this.supabase
        .from('workshops')
        .update({ available_seats: availableSeats })
        .eq('id', workshopId);
      
      if (updateError) throw updateError;
      
      console.log(`Successfully updated available seats for workshop ${workshopId}`);
      return true;
    } catch (error) {
      console.error(`Error in recalculateWorkshopSeats:`, error);
      throw error;
    }
  }
}

