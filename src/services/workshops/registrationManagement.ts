
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
  try {
    // Join with user_profiles to get user information
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*, user_profiles:user_id(*)')
      .eq('workshop_id', workshopId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching registrations for workshop ${workshopId}:`, error);
      throw error;
    }

    // Check for missing user profiles and log them
    const missingProfiles = data?.filter(reg => reg.user_profiles === null);
    if (missingProfiles && missingProfiles.length > 0) {
      console.warn(`Found ${missingProfiles.length} registrations with missing user profiles:`, 
        missingProfiles.map(reg => ({ id: reg.id, email: reg.email })));
    }

    // Check for duplicate registrations
    const userWorkshopMap = new Map();
    const duplicates = [];
    
    data?.forEach(reg => {
      const key = `${reg.user_id}-${reg.workshop_id}`;
      if (userWorkshopMap.has(key)) {
        duplicates.push({ id: reg.id, user_id: reg.user_id, email: reg.email });
      } else {
        userWorkshopMap.set(key, reg);
      }
    });
    
    if (duplicates.length > 0) {
      console.warn(`Found ${duplicates.length} duplicate registrations:`, duplicates);
    }

    // Return all registrations, including potential duplicates
    // The UI will handle showing unique entries
    return (data || []) as WorkshopRegistration[];
  } catch (error) {
    console.error(`Error in fetchWorkshopRegistrations:`, error);
    throw error;
  }
};

export const deleteRegistration = async (registrationId: string): Promise<void> => {
  try {
    // First get the registration to get the workshop ID
    const { data: registration, error: getError } = await supabase
      .from('workshop_registrations')
      .select('workshop_id')
      .eq('id', registrationId)
      .maybeSingle(); // Using maybeSingle instead of single for more robustness
      
    if (getError) {
      console.error(`Error getting registration ${registrationId}:`, getError);
      throw getError;
    }
    
    if (!registration) {
      console.warn(`Registration ${registrationId} not found, may have been already deleted`);
      return;
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

// New function to get count of registrations per user
export const fetchUserRegistrationCounts = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('user_id, count')
      .select()
      .count()
      .group('user_id');
    
    if (error) {
      console.error("Error fetching registration counts:", error);
      throw error;
    }
    
    // Transform to a map of user_id -> count
    const countMap: Record<string, number> = {};
    data?.forEach(item => {
      countMap[item.user_id] = parseInt(item.count);
    });
    
    return countMap;
  } catch (error) {
    console.error("Error in fetchUserRegistrationCounts:", error);
    return {};
  }
};

// Find registrations with missing user profiles
export const findOrphanedRegistrations = async (): Promise<WorkshopRegistration[]> => {
  try {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .not('user_id', 'in', supabase.from('user_profiles').select('id'));
    
    if (error) {
      console.error("Error finding orphaned registrations:", error);
      throw error;
    }
    
    return (data || []) as WorkshopRegistration[];
  } catch (error) {
    console.error("Error in findOrphanedRegistrations:", error);
    return [];
  }
};

// Find duplicate registrations (same user_id and workshop_id)
export const findDuplicateRegistrations = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('find_duplicate_registrations');
    
    if (error) {
      console.error("Error finding duplicate registrations:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in findDuplicateRegistrations:", error);
    return [];
  }
};
