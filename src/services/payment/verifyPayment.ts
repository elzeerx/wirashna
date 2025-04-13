
import { supabase } from "@/integrations/supabase/client";
import { PaymentResult } from './types';
import { logPaymentAction } from './paymentLogs';

/**
 * Verifies a payment status with the Tap payment gateway
 */
export const verifyTapPayment = async (
  tapId: string
): Promise<PaymentResult> => {
  try {
    // Log the verification attempt client-side
    await logPaymentAction({
      action: "client_verify_payment_attempt",
      status: "pending",
      payment_id: tapId
    });

    // Call the Supabase Edge Function to verify payment
    const { data, error } = await supabase.functions.invoke("verify-payment", {
      body: { tap_id: tapId },
    });

    if (error) {
      console.error("Error verifying payment:", error);
      
      // Log the error
      await logPaymentAction({
        action: "client_verify_payment_error",
        status: "error",
        payment_id: tapId,
        error_message: error.message
      });
      
      return { success: false, error: error.message };
    }

    if (data && data.payment && data.payment.status) {
      // Log successful verification
      await logPaymentAction({
        action: "client_verify_payment_success",
        status: "success",
        payment_id: tapId,
        response_data: { payment_status: data.payment.status }
      });
      
      return { success: true, status: data.payment.status };
    }

    // Log verification failure
    await logPaymentAction({
      action: "client_verify_payment_failure",
      status: "error",
      payment_id: tapId,
      error_message: "Failed to verify payment status"
    });

    return { success: false, error: "Failed to verify payment status" };
  } catch (error) {
    console.error("Error in verifyTapPayment:", error);
    
    // Log the exception
    try {
      await logPaymentAction({
        action: "client_verify_payment_exception",
        status: "error",
        payment_id: tapId,
        error_message: error.message
      });
    } catch (logError) {
      console.error("Error logging payment action:", logError);
    }
    
    return { success: false, error: error.message };
  }
};
