// Common database types
export interface Workshop {
  id: string;
  title: string;
  short_description: string;
  long_description?: string;
  venue: string;
  location: string;
  total_seats: number;
  available_seats: number;
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
  date: string;
  time: string;
  end_time?: string;
  dates?: any;
  session_duration?: number;
  created_at: string;
  updated_at: string;
  // These fields are used for type compatibility
  start_date?: string;
  end_date?: string;
  status?: 'active' | 'cancelled' | 'completed' | 'draft';
}

export interface UserProfile {
  id: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'supervisor' | 'subscriber';
  is_admin?: boolean;
  status?: 'active' | 'suspended' | 'pending';
  created_at: string;
  updated_at?: string;
}

export interface WorkshopRegistration {
  id: string;
  workshop_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed' | 'processing';
  payment_id?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkshopMaterial {
  id: string;
  workshop_id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  registration_id: string;
  workshop_id: string;
  user_id: string;
  issue_date: string;
  certificate_url: string;
  created_at: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  user_id?: string;
  related_id?: string;
  icon: string;
  created_at: string;
}

// Re-export payment types
export type { 
  UserDetails, 
  PaymentResult, 
  PaymentCallbackQuery,
  PaymentLogData 
} from '@/services/payment/types';
