
// Re-export existing types for broader usage
export type { UserDetails, PaymentResult, PaymentCallbackQuery } from '@/types/payment';

// Internal types for payment logging
export interface PaymentLogData {
  action: string;
  status: string;
  payment_id?: string | null;
  amount?: number | null;
  userId?: string | null;
  workshopId?: string | null;
  response_data?: any | null;
  error_message?: string | null;
}
