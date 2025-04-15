
import { Workshop } from "@/types/supabase";

export interface WorkshopDate {
  date: string;
  time: string;
  endTime: string;
  displayTime: string;
}

export interface WorkshopFormData extends Omit<Workshop, 'date' | 'time'> {
  dates: WorkshopDate[];
  tempDate: Date | null;
  tempTime: string;
  duration: string;
}

export interface WorkshopGalleryProps {
  mainImage?: string;
  gallery?: string[];
  title: string;
}

export interface WorkshopSidebarProps {
  dates: WorkshopDate[];
  venue: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  price: string | number;
  workshopId: string;
}

export interface WorkshopDetailsSectionProps {
  objectives?: string[];
  benefits?: string[];
  requirements?: string[];
  targetAudience?: string[];
}
