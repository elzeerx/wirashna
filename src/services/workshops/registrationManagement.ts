import { supabase } from "@/integrations/supabase/client";
import { WorkshopRegistration } from "@/types/supabase";
import { recalculateWorkshopSeats } from './registrationSeats';

export const fetchUserRegistrations = async (userId: string): Promise<WorkshopRegistration[]> => {
  try {
    // Check if userId is provided - if not, fetch all registrations
    const query = supabase
      .from('workshop_registrations')
      .select('*, workshops(*)')
      .order('created_at', { ascending: false });
    
    // Only add the user filter if a valid userId is provided
    if (userId && userId.trim() !== '') {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching registrations:", error);
      throw error;
    }

    return (data || []) as WorkshopRegistration[];
  } catch (error) {
    console.error("Error in fetchUserRegistrations:", error);
    return [];
  }
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
