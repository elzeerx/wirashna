
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
      .select('user_id, payment_status');
    
    if (error) {
      console.error("Error fetching registration counts:", error);
      throw error;
    }
    
    // Transform to a map of user_id -> count, only counting paid registrations
    const countMap: Record<string, number> = {};
    
    // Group by user_id and count occurrences of paid registrations
    if (data) {
      data.forEach(item => {
        if (item.user_id && item.payment_status === 'paid') {
          if (!countMap[item.user_id]) {
            countMap[item.user_id] = 0;
          }
          countMap[item.user_id]++;
        }
      });
    }
    
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
    // Supabase JS client doesn't support GROUP BY directly in the same way as raw SQL
    // Instead, we'll fetch all registrations and do the grouping in JS
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('user_id, workshop_id');
    
    if (error) {
      console.error("Error fetching registrations for duplicate check:", error);
      throw error;
    }
    
    // Group registrations by user_id + workshop_id combination
    const groupedRegistrations = new Map<string, number>();
    
    data?.forEach(reg => {
      const key = `${reg.user_id}-${reg.workshop_id}`;
      groupedRegistrations.set(key, (groupedRegistrations.get(key) || 0) + 1);
    });
    
    // Find combinations with more than one registration
    const duplicates = [];
    
    for (const [key, count] of groupedRegistrations.entries()) {
      if (count > 1) {
        const [userId, workshopId] = key.split('-');
        duplicates.push({
          user_id: userId,
          workshop_id: workshopId,
          count: count
        });
      }
    }
    
    return duplicates;
  } catch (error) {
    console.error("Error in findDuplicateRegistrations:", error);
    return [];
  }
};

// New function to fetch certificates for a user or workshop
export const fetchCertificates = async (params: { userId?: string; workshopId?: string; }): Promise<any[]> => {
  try {
    const query = supabase
      .from('workshop_certificates')
      .select('*, workshops:workshop_id(*), registrations:registration_id(*)');
    
    if (params.userId) {
      query.eq('user_id', params.userId);
    }
    
    if (params.workshopId) {
      query.eq('workshop_id', params.workshopId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching certificates:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchCertificates:", error);
    return [];
  }
};

// Add a certificate for a workshop registration
export const addCertificate = async (
  workshopId: string, 
  userId: string, 
  certificateUrl: string
): Promise<any> => {
  try {
    // First find the registration ID for this user and workshop
    const { data: registration, error: regError } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', userId)
      .eq('payment_status', 'paid')
      .maybeSingle();
    
    if (regError) {
      console.error("Error finding registration:", regError);
      throw regError;
    }
    
    if (!registration) {
      throw new Error("No paid registration found for this user and workshop");
    }
    
    // Now insert the certificate
    const { data, error } = await supabase
      .from('workshop_certificates')
      .insert({
        registration_id: registration.id,
        workshop_id: workshopId,
        user_id: userId,
        certificate_url: certificateUrl
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding certificate:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in addCertificate:", error);
    throw error;
  }
};

// Delete a certificate
export const deleteCertificate = async (certificateId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workshop_certificates')
      .delete()
      .eq('id', certificateId);
    
    if (error) {
      console.error("Error deleting certificate:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteCertificate:", error);
    throw error;
  }
};

// Fix registration status and recalculate seats
export const fixRegistrationStatus = async (workshopId: string): Promise<void> => {
  try {
    // Update registrations with processing status for more than 1 hour to failed
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { error } = await supabase
      .from('workshop_registrations')
      .update({ 
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('workshop_id', workshopId)
      .eq('payment_status', 'processing')
      .lt('created_at', oneHourAgo.toISOString());
    
    if (error) {
      console.error("Error fixing registration status:", error);
      throw error;
    }
    
    // Recalculate seats
    await recalculateWorkshopSeats(workshopId);
  } catch (error) {
    console.error("Error in fixRegistrationStatus:", error);
    throw error;
  }
};
