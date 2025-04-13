
import { supabase } from "@/integrations/supabase/client";
import { WorkshopRegistration } from "@/types/supabase";

export const registerForWorkshop = async (registration: Omit<WorkshopRegistration, 'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status' | 'payment_id' | 'admin_notes'>): Promise<WorkshopRegistration> => {
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
    throw error;
  }

  return data as WorkshopRegistration;
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
