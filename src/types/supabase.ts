
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

