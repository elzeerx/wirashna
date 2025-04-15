
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { PaymentActionLog } from './payment-types.ts';

const supabaseUrl = "https://dxgscdegcjhejmqcvajc.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export async function logPaymentAction({
  action,
  status,
  payment_id = null,
  amount = null,
  userId = null,
  workshopId = null,
  response_data = null,
  error_message = null,
  ip_address = null
}: PaymentActionLog) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
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
        error_message,
        ip_address
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

