import { supabase } from "@/integrations/supabase/client";
import { Workshop } from "@/types/supabase";
import { WorkshopDate } from "@/types/workshop";
import { Json } from "@/integrations/supabase/types";

const transformDates = (data: any): Workshop => {
  if (!data) return data;
  
  // Convert dates from Json to WorkshopDate[] if it exists
  if (data.dates) {
    try {
      data.dates = Array.isArray(data.dates) ? data.dates : JSON.parse(data.dates as string);
    } catch (e) {
      console.error("Error parsing workshop dates:", e);
      data.dates = [];
    }
  }
  return data as Workshop;
};

export const fetchWorkshops = async (): Promise<Workshop[]> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching workshops:", error);
    throw error;
  }

  return (data || []).map(transformDates);
};

export const fetchWorkshopById = async (id: string): Promise<Workshop | null> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*, workshop_materials(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching workshop ${id}:`, error);
    return null;
  }

  return transformDates(data);
};

export const createWorkshop = async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>): Promise<Workshop> => {
  console.log("Creating workshop with data:", workshop);
  
  // Ensure gallery includes cover_image if available
  if (workshop.cover_image && (!workshop.gallery || workshop.gallery.length === 0)) {
    workshop.gallery = [workshop.cover_image];
  }

  // Convert dates array to JSON string for storage
  const workshopData = {
    ...workshop,
    dates: workshop.dates ? JSON.stringify(workshop.dates) : null
  };

  const { data, error } = await supabase
    .from('workshops')
    .insert(workshopData)
    .select()
    .single();

  if (error) {
    console.error("Error creating workshop:", error);
    throw error;
  }

  return transformDates(data);
};

export const updateWorkshop = async (id: string, workshop: Partial<Workshop>): Promise<Workshop> => {
  console.log("Updating workshop with id:", id);
  console.log("Workshop data to update:", workshop);
  
  // Convert dates array to JSON string for storage
  const workshopData = {
    ...workshop,
    dates: workshop.dates ? JSON.stringify(workshop.dates) : undefined
  };

  const { data, error } = await supabase
    .from('workshops')
    .update(workshopData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating workshop ${id}:`, error);
    throw error;
  }

  return transformDates(data);
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
