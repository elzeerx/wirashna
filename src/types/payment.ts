
export interface UserDetails {
  name: string;
  email: string;
  phone?: string;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  redirectUrl?: string;
  paymentId?: string;
}

export interface PaymentCallbackQuery {
  tap_id: string;
  status?: string;
}

export interface PaymentLogData {
  amount: number;
  payment_id: string;
  status: string;
  response_data?: any;
  error_message?: string;
}
