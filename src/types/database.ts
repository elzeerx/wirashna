
// Common database types
export interface Workshop {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  price: number;
  total_seats: number;
  available_seats: number;
  instructor_name?: string;
  image_url?: string;
  status: 'active' | 'cancelled' | 'completed' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  email: string;
  phone?: string;
  role: 'admin' | 'supervisor' | 'subscriber';
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
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
