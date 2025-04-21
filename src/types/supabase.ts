
import { Database } from "@/integrations/supabase/types";

export type Workshop = Database["public"]["Tables"]["workshops"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type WorkshopRegistration = Database["public"]["Tables"]["workshop_registrations"]["Row"];
export type WorkshopMaterial = Database["public"]["Tables"]["workshop_materials"]["Row"];
export type WorkshopCertificate = Database["public"]["Tables"]["workshop_certificates"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type PaymentLog = Database["public"]["Tables"]["payment_logs"]["Row"];
