
export interface TapPayload {
  amount: number;
  currency: string;
  threeDSecure: boolean;
  save_card: boolean;
  description: string;
  statement_descriptor: string;
  metadata: {
    workshopId: string;
    userId: string;
  };
  reference: {
    transaction: string;
    order: string;
  };
  receipt: {
    email: boolean;
    sms: boolean;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: {
      country_code: string;
      number: string;
    };
  };
  source: { id: string };
  redirect: { url: string };
}

export interface PaymentActionLog {
  action: string;
  status: string;
  payment_id?: string | null;
  amount?: number | null;
  userId?: string | null;
  workshopId?: string | null;
  response_data?: any | null;
  error_message?: string | null;
  ip_address?: string | null;
}

