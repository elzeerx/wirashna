
export { type Database } from "@/integrations/supabase/types";
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type UserProfile = Tables<'user_profiles'>;
export type WorkshopMaterial = Tables<'workshop_materials'>;
export type Workshop = Tables<'workshops'>;
export type WorkshopRegistration = Tables<'workshop_registrations'>;
export type Certificate = Tables<'workshop_certificates'>;
export type Activity = Tables<'payment_logs'>;
