
import { supabase } from "@/integrations/supabase/client";
import { Workshop, WorkshopRegistration } from "@/types/supabase";

export const fetchWorkshops = async (): Promise<Workshop[]> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching workshops:", error);
    throw error;
  }

  return data || [];
};

export const fetchWorkshopById = async (id: string): Promise<Workshop | null> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching workshop ${id}:`, error);
    return null;
  }

  return data;
};

export const createWorkshop = async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>): Promise<Workshop> => {
  const { data, error } = await supabase
    .from('workshops')
    .insert(workshop)
    .select()
    .single();

  if (error) {
    console.error("Error creating workshop:", error);
    throw error;
  }

  return data;
};

export const updateWorkshop = async (id: string, workshop: Partial<Workshop>): Promise<Workshop> => {
  const { data, error } = await supabase
    .from('workshops')
    .update(workshop)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating workshop ${id}:`, error);
    throw error;
  }

  return data;
};

export const deleteWorkshop = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('workshops')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting workshop ${id}:`, error);
    throw error;
  }
};

export const registerForWorkshop = async (registration: Omit<WorkshopRegistration, 'id' | 'created_at'>): Promise<WorkshopRegistration> => {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .insert(registration)
    .select()
    .single();

  if (error) {
    console.error("Error registering for workshop:", error);
    throw error;
  }

  return data;
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

  return data || [];
};

export const cancelRegistration = async (registrationId: string): Promise<void> => {
  const { error } = await supabase
    .from('workshop_registrations')
    .delete()
    .eq('id', registrationId);

  if (error) {
    console.error(`Error canceling registration ${registrationId}:`, error);
    throw error;
  }
};
