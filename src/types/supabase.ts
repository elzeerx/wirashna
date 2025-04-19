
import type { Database } from "@/integrations/supabase/types";

// Re-export common types from the database
export type Workshop = Database["public"]["Tables"]["workshops"]["Row"];
export type WorkshopRegistration = Database["public"]["Tables"]["workshop_registrations"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type WorkshopCertificate = Database["public"]["Tables"]["workshop_certificates"]["Row"];
export type WorkshopMaterial = Database["public"]["Tables"]["workshop_materials"]["Row"];
export type PaymentLog = Database["public"]["Tables"]["payment_logs"]["Row"];

// Re-export everything else for convenience
export * from "@/integrations/supabase/types";
