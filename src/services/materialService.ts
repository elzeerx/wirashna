
import { supabase } from "@/integrations/supabase/client";
import { WorkshopMaterial } from "@/types/supabase";

export const fetchWorkshopMaterials = async (workshopId: string): Promise<WorkshopMaterial[]> => {
  const { data, error } = await supabase
    .from('workshop_materials')
    .select('*')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching materials for workshop ${workshopId}:`, error);
    throw error;
  }

  return data || [];
};

export const addWorkshopMaterial = async (material: Omit<WorkshopMaterial, 'id' | 'created_at'>): Promise<WorkshopMaterial> => {
  const { data, error } = await supabase
    .from('workshop_materials')
    .insert(material)
    .select()
    .single();

  if (error) {
    console.error("Error adding workshop material:", error);
    throw error;
  }

  return data;
};

export const updateWorkshopMaterial = async (materialId: string, updates: Partial<WorkshopMaterial>): Promise<WorkshopMaterial> => {
  const { data, error } = await supabase
    .from('workshop_materials')
    .update(updates)
    .eq('id', materialId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating material ${materialId}:`, error);
    throw error;
  }

  return data;
};

export const deleteWorkshopMaterial = async (materialId: string): Promise<void> => {
  const { error } = await supabase
    .from('workshop_materials')
    .delete()
    .eq('id', materialId);

  if (error) {
    console.error(`Error deleting material ${materialId}:`, error);
    throw error;
  }
};
