
import { supabase } from "@/integrations/supabase/client";

export const recalculateWorkshopSeats = async (workshopId: string): Promise<boolean> => {
  try {
    console.log(`Recalculating seats for workshop ${workshopId}`);
    
    // Get the workshop's total seats
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('total_seats')
      .eq('id', workshopId)
      .single();
    
    if (workshopError) {
      console.error(`Error getting workshop ${workshopId}:`, workshopError);
      throw workshopError;
    }
    
    // Count confirmed registrations with paid status
    const { count, error: countError } = await supabase
      .from('workshop_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('payment_status', 'paid');
    
    if (countError) {
      console.error(`Error counting registrations for workshop ${workshopId}:`, countError);
      throw countError;
    }
    
    const totalSeats = workshop.total_seats;
    const confirmedRegistrations = count || 0;
    const availableSeats = Math.max(0, totalSeats - confirmedRegistrations);
    
    console.log(`Workshop ${workshopId} stats:`, {
      totalSeats,
      confirmedRegistrations,
      availableSeats
    });
    
    // Update the workshop's available seats
    const { error: updateError } = await supabase
      .from('workshops')
      .update({ available_seats: availableSeats })
      .eq('id', workshopId);
    
    if (updateError) {
      console.error(`Error updating available seats for workshop ${workshopId}:`, updateError);
      throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in recalculateWorkshopSeats:`, error);
    throw error;
  }
};
