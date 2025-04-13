
import { supabase } from "@/integrations/supabase/client";
import { PaymentLogData } from './types';

/**
 * Helper function to log payment actions on the client side
 */
export async function logPaymentAction({
  action,
  status,
  payment_id = null,
  amount = null,
  userId = null,
  workshopId = null,
  response_data = null,
  error_message = null
}: PaymentLogData) {
  try {
    const { data, error } = await supabase
      .from("payment_logs")
      .insert({
        action,
        status,
        payment_id,
        amount,
        user_id: userId,
        workshop_id: workshopId,
        response_data,
        error_message
      });
      
    if (error) {
      console.error("Error logging payment action:", error);
    }
    
    return { success: !error };
  } catch (error) {
    console.error("Exception logging payment action:", error);
    return { success: false };
  }
}
