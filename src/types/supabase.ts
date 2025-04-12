
export type Workshop = {
  id: string;
  title: string;
  short_description: string;
  long_description?: string;
  cover_image?: string;
  gallery?: string[];
  date: string;
  time: string;
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
