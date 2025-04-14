import { supabase } from "@/integrations/supabase/client";
import { WorkshopRegistration } from "@/types/supabase";

export const registerForWorkshop = async (registration: Omit<WorkshopRegistration, 'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status' | 'payment_id' | 'admin_notes'>): Promise<WorkshopRegistration> => {
  try {
    // First check if this user already has a registration for this workshop
    const { data: existingRegistration, error: checkError } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('user_id', registration.user_id)
      .eq('workshop_id', registration.workshop_id)
      .maybeSingle();  // Use maybeSingle() instead of single()

    if (checkError) {
      console.error("Error checking existing workshop registration:", checkError);
      throw checkError;
    }

    // If there's an existing registration with a failed or unpaid payment status,
    // or the registration was canceled, update it to allow re-registration
    if (existingRegistration && 
        (existingRegistration.status === 'canceled' || 
         ['failed', 'unpaid', 'processing'].includes(existingRegistration.payment_status))) {
      console.log("Updating existing registration with status:", existingRegistration.status, 
                 "payment status:", existingRegistration.payment_status);
      
      const { data, error } = await supabase
        .from('workshop_registrations')
        .update({
          full_name: registration.full_name,
          email: registration.email,
          phone: registration.phone,
          notes: registration.notes,
          status: 'pending',
          payment_status: 'unpaid',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRegistration.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating existing workshop registration:", error);
        throw error;
      }

      return data as WorkshopRegistration;
    }
    
    // If there's an existing registration in a completed state, throw a duplicate error
    if (existingRegistration && existingRegistration.payment_status === 'paid') {
      console.log("Found existing paid registration with payment status:", existingRegistration.payment_status);
      const duplicateError = new Error("لقد قمت بالتسجيل في هذه الورشة مسبقاً ولا يمكن التسجيل مرة أخرى");
      duplicateError.name = "DuplicateRegistrationError";
      throw duplicateError;
    }
    
    // Create a new registration if no existing one was found
    console.log("Creating new registration for workshop:", registration.workshop_id, "and user:", registration.user_id);
    const registrationData = {
      ...registration,
      status: 'pending' as const,
      payment_status: 'unpaid' as const
    };

    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      console.error("Error registering for workshop:", error);
      
      // If the error is about a duplicate, provide a more helpful error message
      if (error.message && error.message.includes("duplicate key value violates unique constraint")) {
        const duplicateError = new Error("لقد قمت بالتسجيل في هذه الورشة مسبقاً ولا يمكن التسجيل مرة أخرى");
        duplicateError.name = "DuplicateRegistrationError";
        throw duplicateError;
      }
      
      throw error;
    }

    return data as WorkshopRegistration;
  } catch (error) {
    console.error("Registration service error:", error);
    throw error;
  }
};

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

export const cancelRegistration = async (registrationId: string): Promise<void> => {
  const { error } = await supabase
    .from('workshop_registrations')
    .update({ status: 'canceled' as const })
    .eq('id', registrationId);

  if (error) {
    console.error(`Error canceling registration ${registrationId}:`, error);
    throw error;
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

export const updateRegistrationStatus = async (registrationId: string, updates: Partial<WorkshopRegistration>): Promise<WorkshopRegistration> => {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .update(updates)
    .eq('id', registrationId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating registration ${registrationId}:`, error);
    throw error;
  }

  return data as WorkshopRegistration;
};

export const resetRegistration = async (registrationId: string): Promise<void> => {
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
};

export const deleteRegistration = async (registrationId: string): Promise<void> => {
  const { error } = await supabase
    .from('workshop_registrations')
    .delete()
    .eq('id', registrationId);

  if (error) {
    console.error(`Error deleting registration ${registrationId}:`, error);
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
    } else {
      console.log(`No failed registrations found for workshop ${workshopId}`);
    }
  } catch (error) {
    console.error(`Error cleaning up failed registrations:`, error);
    throw error;
  }
};

export const recalculateWorkshopSeats = async (workshopId: string): Promise<void> => {
  try {
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
    
    // Count confirmed registrations
    const { count, error: countError } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('status', 'confirmed')
      .eq('payment_status', 'paid');
    
    if (countError) {
      console.error(`Error counting confirmed registrations:`, countError);
      throw countError;
    }
    
    const totalSeats = workshop.total_seats;
    const confirmedRegistrations = count || 0;
    const availableSeats = Math.max(0, totalSeats - confirmedRegistrations);
    
    console.log(`Workshop ${workshopId}: Total seats ${totalSeats}, Confirmed registrations ${confirmedRegistrations}, Available seats ${availableSeats}`);
    
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
