
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = "https://dxgscdegcjhejmqcvajc.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export class RegistrationService {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async updateRegistrationStatus(workshopId: string, userId: string, paymentId: string, status: string = 'paid') {
    try {
      console.log(`Updating registration for workshopId: ${workshopId}, userId: ${userId}, paymentId: ${paymentId}`);
      
      // First, check if a user profile exists
      const { data: userProfile, error: profileError } = await this.supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      // If no profile exists, try to create one
      if (profileError || !userProfile) {
        console.log(`No user profile found for ${userId}, attempting to create one`);
        
        // Get user data from auth.users
        const { data: user, error: userError } = await this.supabase.auth.admin.getUserById(userId);
        
        if (!userError && user) {
          // Create a new profile
          await this.supabase
            .from("user_profiles")
            .insert({
              id: userId,
              full_name: user.user.user_metadata?.full_name || user.user.email,
              email: user.user.email,
              role: 'subscriber'
            });
          
          console.log(`Created new user profile for ${userId}`);
        } else {
          console.error("Error getting user data:", userError);
        }
      }
      
      // Update the registration status using upsert to handle potential duplicates
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

      console.log(`Successfully updated registration status for ${userId}`);
      return data;
    } catch (error) {
      console.error("Error in updateRegistrationStatus:", error);
      throw error;
    }
  }

  async markRegistrationFailed(workshopId: string, userId: string) {
    try {
      console.log(`Marking registration as failed for workshopId: ${workshopId}, userId: ${userId}`);
      
      const { data, error } = await this.supabase
        .from("workshop_registrations")
        .update({ 
          payment_status: "failed",
          updated_at: new Date().toISOString()
        })
        .eq("workshop_id", workshopId)
        .eq("user_id", userId)
        .eq("payment_status", "processing");

      if (error) {
        console.error("Error marking registration as failed:", error);
        throw error;
      }

      console.log(`Successfully marked registration as failed for ${userId}`);
      return data;
    } catch (error) {
      console.error("Error in markRegistrationFailed:", error);
      throw error;
    }
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
      
      console.log(`Workshop ${workshopId} stats: Total=${totalSeats}, Confirmed=${confirmedRegistrations}, Available=${availableSeats}`);
      
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
