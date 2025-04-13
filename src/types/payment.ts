
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
