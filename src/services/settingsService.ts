
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id?: string;
  site_name: string;
  site_description: string;
  contact_email: string;
  logo_url?: string;
  primary_color?: string;
  enable_registrations: boolean;
  footer_text?: string;
  social_links?: Record<string, string>;
}

export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
    console.error("Error fetching site settings:", error);
    throw error;
  }

  return data as SiteSettings;
};

export const updateSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  // Check if settings already exist
  const { data: existingSettings } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1);

  let response;

  if (existingSettings && existingSettings.length > 0) {
    // Update existing settings
    response = await supabase
      .from('site_settings')
      .update(settings as any)
      .eq('id', existingSettings[0].id)
      .select()
      .single();
  } else {
    // Insert new settings
    response = await supabase
      .from('site_settings')
      .insert(settings as any)
      .select()
      .single();
  }

  if (response.error) {
    console.error("Error updating site settings:", response.error);
    throw response.error;
  }

  return response.data as SiteSettings;
};
