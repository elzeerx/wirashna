
import { supabase } from "@/integrations/supabase/client";
import { PageData, PageSection } from "@/types/page";
import { Json } from "@/integrations/supabase/types";

// Helper functions to convert between PageSection[] and Json
const convertJsonToPageSections = (jsonData: Json): PageSection[] => {
  if (Array.isArray(jsonData)) {
    // Properly map each JSON object to a PageSection object
    return jsonData.map(item => {
      // Ensure the item has all required properties of PageSection
      if (typeof item === 'object' && item !== null && 
          'id' in item && 'type' in item && 
          'content' in item && 'settings' in item) {
        return {
          id: String(item.id),
          type: String(item.type),
          content: String(item.content),
          settings: item.settings as Record<string, any>
        };
      }
      return null;
    }).filter((item): item is PageSection => item !== null);
  }
  return [];
};

const convertPageSectionsToJson = (sections: PageSection[]): Json => {
  return sections as unknown as Json;
};

export const fetchPages = async (): Promise<PageData[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }

  // Convert the Json content to PageSection[]
  const pagesData = data.map(page => ({
    ...page,
    content: convertJsonToPageSections(page.content)
  })) as PageData[];

  return pagesData || [];
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

  // Convert the Json content to PageSection[]
  return {
    ...data,
    content: convertJsonToPageSections(data.content)
  } as PageData;
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

  // Convert the Json content to PageSection[]
  return {
    ...data,
    content: convertJsonToPageSections(data.content)
  } as PageData;
};

export const savePage = async (page: PageData): Promise<PageData> => {
  // Convert PageSection[] to Json before saving
  const pageToSave = {
    ...page,
    content: convertPageSectionsToJson(page.content)
  };

  // If the page has an ID, update it, otherwise insert a new page
  const { data, error } = page.id
    ? await supabase
        .from('pages')
        .update(pageToSave)
        .eq('id', page.id)
        .select()
        .single()
    : await supabase
        .from('pages')
        .insert(pageToSave)
        .select()
        .single();

  if (error) {
    console.error("Error saving page:", error);
    throw error;
  }

  // Convert the Json content back to PageSection[] before returning
  return {
    ...data,
    content: convertJsonToPageSections(data.content)
  } as PageData;
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
