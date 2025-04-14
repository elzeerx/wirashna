
import { supabase } from "@/integrations/supabase/client";
import { PaymentResult } from './types';
import { logPaymentAction } from './paymentLogs';

/**
 * Verifies a payment with the Tap payment gateway
 */
export const verifyTapPayment = async (tapId: string): Promise<PaymentResult> => {
  try {
    console.log("Verifying payment with ID:", tapId);
    
    // Log the verification attempt client-side
    await logPaymentAction({
      action: "client_verify_payment_attempt",
      status: "pending",
      payment_id: tapId
    });

    // Call the Supabase Edge Function to verify the payment
    const { data, error } = await supabase.functions.invoke("verify-payment", {
      body: { tap_id: tapId }
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

    // Check if the payment was successful
    if (data.payment && data.payment.status === "CAPTURED") {
      // Log successful payment verification
      await logPaymentAction({
        action: "client_verify_payment_success",
        status: "success",
        payment_id: tapId
      });
      
      return { success: true, status: "CAPTURED" };
    }
    
    // If payment wasn't captured, return the status
    await logPaymentAction({
      action: "client_verify_payment_not_captured",
      status: "warning",
      payment_id: tapId,
      error_message: `Payment not captured: ${data.payment?.status || 'Unknown status'}`
    });
    
    return { 
      success: true, 
      status: data.payment?.status || 'UNKNOWN' 
    };
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
