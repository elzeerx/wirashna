
import { supabase } from "@/integrations/supabase/client";
import { WorkshopRegistration } from "@/types/supabase";

export const fetchUserRegistrations = async (userId: string): Promise<WorkshopRegistration[]> => {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('*, workshops(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user registrations:", error);
    throw error;
  }

  return (data || []) as WorkshopRegistration[];
};

export const fetchWorkshopRegistrations = async (workshopId: string): Promise<WorkshopRegistration[]> => {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching registrations for workshop ${workshopId}:`, error);
    throw error;
  }

  return (data || []) as WorkshopRegistration[];
};

export const deleteRegistration = async (registrationId: string): Promise<void> => {
  try {
    // First get the registration to get the workshop ID
    const { data: registration, error: getError } = await supabase
      .from('workshop_registrations')
      .select('workshop_id')
      .eq('id', registrationId)
      .single();
      
    if (getError) {
      console.error(`Error getting registration ${registrationId}:`, getError);
      throw getError;
    }
    
    const workshopId = registration.workshop_id;
    
    // Now delete the registration
    const { error } = await supabase
      .from('workshop_registrations')
      .delete()
      .eq('id', registrationId);

    if (error) {
      console.error(`Error deleting registration ${registrationId}:`, error);
      throw error;
    }
    
    // Recalculate seats after deletion
    await recalculateWorkshopSeats(workshopId);
  } catch (error) {
    console.error(`Error in deleteRegistration:`, error);
    throw error;
  }
};
