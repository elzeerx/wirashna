
import { supabase } from "@/integrations/supabase/client";
import { PageData } from "@/types/page";

export const fetchPages = async (): Promise<PageData[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }

  return data as PageData[] || [];
};

export const fetchPageById = async (id: string): Promise<PageData> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching page by ID:", error);
    throw error;
  }

  return data as PageData;
};

export const fetchPageByPath = async (path: string): Promise<PageData> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('path', path)
    .single();

  if (error) {
    console.error("Error fetching page by path:", error);
    throw error;
  }

  return data as PageData;
};

export const savePage = async (page: PageData): Promise<PageData> => {
  // If the page has an ID, update it, otherwise insert a new page
  const { data, error } = page.id
    ? await supabase
        .from('pages')
        .update(page)
        .eq('id', page.id)
        .select()
        .single()
    : await supabase
        .from('pages')
        .insert(page)
        .select()
        .single();

  if (error) {
    console.error("Error saving page:", error);
    throw error;
  }

  return data as PageData;
};

export const deletePage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting page:", error);
    throw error;
  }
};
