
import type { Database } from "@/integrations/supabase/types";

// Re-export common types from the database
export type Workshop = Database["public"]["Tables"]["workshops"]["Row"];
export type WorkshopRegistration = Database["public"]["Tables"]["workshop_registrations"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type WorkshopCertificate = Database["public"]["Tables"]["workshop_certificates"]["Row"];
export type WorkshopMaterial = Database["public"]["Tables"]["workshop_materials"]["Row"];
export type PaymentLog = Database["public"]["Tables"]["payment_logs"]["Row"];

// Common interface for workshop dates
export interface WorkshopDate {
  date: string;
  time: string;
  endTime: string;
  displayTime: string;
}

// Form data interface extending Workshop type
export interface WorkshopFormData extends Omit<Workshop, 'date' | 'time'> {
  dates: WorkshopDate[];
  tempDate: Date | null;
  tempTime: string;
  duration: string;
  sessionDuration: string;
}

// Re-export payment types
export interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentResult {
  success: boolean;
  redirect_url?: string;
  status?: string;
  error?: string;
}

export interface PaymentCallbackQuery {
  tap_id?: string;
  status?: string;
}

export interface PaymentLogData {
  action: string;
  status: string;
  payment_id?: string | null;
  amount?: number | null;
  userId?: string | null;
  workshopId?: string | null;
  response_data?: any | null;
  error_message?: string | null;
}

// Gallery props interface
export interface WorkshopGalleryProps {
  mainImage?: string;
  gallery?: string[];
  title: string;
}

// Sidebar props interface
export interface WorkshopSidebarProps {
  dates: WorkshopDate[];
  venue: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  price: string | number;
  workshopId: string;
}

// Details section props interface
export interface WorkshopDetailsSectionProps {
  objectives?: string[];
  benefits?: string[];
  requirements?: string[];
  targetAudience?: string[];
}
