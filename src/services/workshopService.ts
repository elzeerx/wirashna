
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
  console.log("Creating workshop with data:", workshop);
  
  // Ensure gallery includes cover_image if available
  if (workshop.cover_image && (!workshop.gallery || workshop.gallery.length === 0)) {
    workshop.gallery = [workshop.cover_image];
  }

  // Create a clean workshop object with all fields
  const workshopData = {
    title: workshop.title,
    short_description: workshop.short_description,
    long_description: workshop.long_description,
    cover_image: workshop.cover_image,
    gallery: workshop.gallery,
    date: workshop.date,
    time: workshop.time,
    venue: workshop.venue,
    location: workshop.location,
    total_seats: workshop.total_seats,
    available_seats: workshop.available_seats || workshop.total_seats,
    price: workshop.price,
    instructor: workshop.instructor,
    instructor_bio: workshop.instructor_bio,
    instructor_image: workshop.instructor_image,
    benefits: workshop.benefits || [],
    requirements: workshop.requirements || []
  };

  console.log("Sending workshop data to database:", workshopData);

  const { data, error } = await supabase
    .from('workshops')
    .insert(workshopData)
    .select()
    .single();

  if (error) {
    console.error("Error creating workshop:", error);
    throw error;
  }

  return data;
};

export const updateWorkshop = async (id: string, workshop: Partial<Workshop>): Promise<Workshop> => {
  console.log("Updating workshop with id:", id);
  console.log("Workshop data to update:", workshop);
  
  // Ensure gallery includes cover_image if available
  if (workshop.cover_image && (!workshop.gallery || workshop.gallery.length === 0)) {
    workshop.gallery = [workshop.cover_image];
  }

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

  return data || [];
};
