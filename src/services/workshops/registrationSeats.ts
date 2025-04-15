
import { supabase } from "@/integrations/supabase/client";

export const recalculateWorkshopSeats = async (workshopId: string): Promise<void> => {
  try {
    console.log(`Starting recalculation of seats for workshop ${workshopId}`);
    
    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('total_seats')
      .eq('id', workshopId)
      .single();
    
    if (workshopError) {
      console.error(`Error fetching workshop ${workshopId}:`, workshopError);
      throw workshopError;
    }
    
    // Count confirmed and paid registrations only
    const { count, error: countError } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('payment_status', 'paid');
    
    if (countError) {
      console.error(`Error counting confirmed registrations:`, countError);
      throw countError;
    }
    
    const totalSeats = workshop.total_seats;
    const confirmedRegistrations = count || 0;
    const availableSeats = Math.max(0, totalSeats - confirmedRegistrations);
    
    console.log(`Workshop ${workshopId}: Total seats ${totalSeats}, Confirmed paid registrations ${confirmedRegistrations}, Available seats ${availableSeats}`);
    
    // Update workshop available seats
    const { error: updateError } = await supabase
      .from('workshops')
      .update({ available_seats: availableSeats })
      .eq('id', workshopId);
    
    if (updateError) {
      console.error(`Error updating workshop available seats:`, updateError);
      throw updateError;
    }
    
    console.log(`Successfully recalculated available seats for workshop ${workshopId}`);
  } catch (error) {
    console.error(`Error recalculating workshop seats:`, error);
    throw error;
  }
};
