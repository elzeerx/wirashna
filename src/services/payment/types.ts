
// We'll redefine these types directly instead of importing from database
export interface UserDetails {
  name: string;
  email: string;
  phone?: string;
}

export interface PaymentResult {
  success: boolean;
  message?: string;
  error?: string;
  redirect_url?: string;
  status?: string;
}

export interface PaymentCallbackQuery {
  tap_id: string;
  status?: string;
}

export interface PaymentLogData {
  action: string;
  status: string;
  payment_id?: string | null;
  amount?: number | null;
  userId?: string | null;
  workshopId?: string | null;
  response_data?: any;
  error_message?: string | null;
}
