
export interface WorkshopDate {
  date: string;
  time: string;
  endTime: string;
  displayTime: string;
}

export interface WorkshopFormData {
  id?: string;
  title: string;
  short_description: string;
  long_description?: string;
  venue: string;
  location: string;
  available_seats: number;
  total_seats: number;
  price: number;
  instructor: string;
  instructor_bio?: string;
  instructor_image?: string;
  cover_image?: string;
  gallery?: string[];
  benefits?: string[];
  requirements?: string[];
  objectives?: string[];
  target_audience?: string[];
  tempDate: Date | null;
  tempTime: string;
  duration: string;
  sessionDuration: string;
  dates: WorkshopDate[];
}
