
import { type Database } from "@/integrations/supabase/types";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type UserProfile = {
  id: string;
  user_id?: string;
  email?: string; 
  phone?: string;
  full_name?: string;
  role: 'admin' | 'supervisor' | 'subscriber';
  is_admin?: boolean;
  status?: 'active' | 'suspended' | 'pending';
  created_at: string;
  updated_at?: string;
};
export type WorkshopMaterial = Tables<'workshop_materials'>;
export type Workshop = Tables<'workshops'> & {
  registration_closed?: boolean; // Add the new field
};
export type WorkshopRegistration = Tables<'workshop_registrations'>;
export type WorkshopCertificate = Tables<'workshop_certificates'>;
export type Activity = Tables<'payment_logs'>;
