
import { WorkshopDate } from '@/types/workshop';
import { Json } from '@/integrations/supabase/types';

export type Workshop = {
  id: string;
  title: string;
  short_description: string;
  long_description?: string;
  cover_image?: string;
  gallery?: string[];
  date: string;
  time: string;
  end_time?: string;
  dates?: WorkshopDate[] | Json;
  venue: string;
  location: string;
  total_seats: number;
  available_seats: number;
  price: number;
  instructor: string;
  instructor_bio?: string;
  instructor_image?: string;
  requirements?: string[];
  benefits?: string[];
  objectives?: string[];
  target_audience?: string[];
  session_duration?: number;
  created_at: string;
  updated_at: string;
};

export type WorkshopRegistration = {
  id: string;
  workshop_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'attended';
  payment_status: 'unpaid' | 'processing' | 'paid' | 'refunded' | 'failed';
  payment_id?: string;
  admin_notes?: string;
};

export type UserProfile = {
  id: string;
  full_name?: string;
  created_at: string;
  is_admin: boolean;
  role: 'admin' | 'supervisor' | 'subscriber';
};

export type WorkshopCertificate = {
  id: string;
  workshop_id: string;
  user_id: string;
  certificate_url?: string;
  created_at: string;
};

export type WorkshopMaterial = {
  id: string;
  workshop_id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
};
