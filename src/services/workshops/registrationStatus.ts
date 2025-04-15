
import { supabase } from "@/integrations/supabase/client";
import { WorkshopRegistration } from "@/types/supabase";
import { recalculateWorkshopSeats } from './registrationSeats';

export const updateRegistrationStatus = async (registrationId: string, updates: Partial<WorkshopRegistration>): Promise<WorkshopRegistration> => {
  try {
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('workshop_registrations')
      .update(updatedData)
      .eq('id', registrationId)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating registration ${registrationId}:`, error);
      throw error;
    }

    // If the status is changing to 'confirmed' and payment_status to 'paid', 
    // ensure available seats are correctly calculated
    if (updatedData.status === 'confirmed' || updatedData.payment_status === 'paid') {
      try {
        // Get the workshop ID
        const workshopId = data.workshop_id;
        await recalculateWorkshopSeats(workshopId);
      } catch (recalcError) {
        console.error("Error recalculating seats after status update:", recalcError);
        // Continue despite error - we don't want to fail the update
      }
    }

    return data as WorkshopRegistration;
  } catch (error) {
    console.error(`Error in updateRegistrationStatus:`, error);
    throw error;
  }
};

export const resetRegistration = async (registrationId: string): Promise<void> => {
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
    
    // Now update the registration
    const { error } = await supabase
      .from('workshop_registrations')
      .update({ 
        status: 'canceled', 
        payment_status: 'failed',
        updated_at: new Date().toISOString(),
        admin_notes: 'Reset by admin to allow re-registration'
      })
      .eq('id', registrationId);

    if (error) {
      console.error(`Error resetting registration ${registrationId}:`, error);
      throw error;
    }
    
    // Recalculate seats after reset
    await recalculateWorkshopSeats(workshopId);
  } catch (error) {
    console.error(`Error in resetRegistration:`, error);
    throw error;
  }
};

export const cleanupFailedRegistrations = async (workshopId: string): Promise<void> => {
  try {
    // Get all registrations for this workshop with failed or processing payment status
    const { data: failedRegistrations, error: fetchError } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('workshop_id', workshopId)
      .in('payment_status', ['failed', 'processing'])
      .eq('status', 'pending');
    
    if (fetchError) {
      console.error(`Error fetching failed registrations for workshop ${workshopId}:`, fetchError);
      throw fetchError;
    }
    
    if (failedRegistrations && failedRegistrations.length > 0) {
      console.log(`Found ${failedRegistrations.length} failed registrations to cleanup`);
      
      // Update all failed registrations to canceled status
      const registrationIds = failedRegistrations.map(reg => reg.id);
      const { error: updateError } = await supabase
        .from('workshop_registrations')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .in('id', registrationIds);
      
      if (updateError) {
        console.error(`Error updating failed registrations:`, updateError);
        throw updateError;
      }
      
      console.log(`Successfully cleaned up ${failedRegistrations.length} failed registrations`);
      
      // Recalculate seats after cleanup
      await recalculateWorkshopSeats(workshopId);
    } else {
      console.log(`No failed registrations found for workshop ${workshopId}`);
    }
  } catch (error) {
    console.error(`Error cleaning up failed registrations:`, error);
    throw error;
  }
};
