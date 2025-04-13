
import { supabase } from "@/integrations/supabase/client";
import { UserDetails } from "@/types/payment";

export const createTapPayment = async (
  amount: number,
  workshopId: string,
  userId: string,
  customerDetails: UserDetails,
  isRetry: boolean = false
): Promise<{ success: boolean; redirect_url?: string; error?: string }> => {
  try {
    // Get the current URL to use as the base for the redirect
    const baseUrl = window.location.origin;
    // Include the workshop ID in the redirect URL as a parameter
    const redirectUrl = `${baseUrl}/payment/callback?workshop_id=${workshopId}`;

    // Log the payment attempt client-side
    await logPaymentAction({
      action: isRetry ? "client_retry_payment_attempt" : "client_create_payment_attempt",
      status: "pending",
      amount,
      userId,
      workshopId
    });

    // Call the Supabase Edge Function to create a payment
    const { data, error } = await supabase.functions.invoke("create-payment", {
      body: {
        amount,
        workshopId,
        userId,
        customerDetails,
        redirectUrl,
        isRetry
      },
    });

    if (error) {
      console.error("Error creating payment:", error);
      
      // Log the error
      await logPaymentAction({
        action: "client_create_payment_error",
        status: "error",
        amount,
        userId,
        workshopId,
        error_message: error.message
      });
      
      return { success: false, error: error.message };
    }

    if (data && data.transaction && data.transaction.url) {
      // Log successful payment creation
      await logPaymentAction({
        action: "client_payment_redirect",
        status: "success",
        payment_id: data.id,
        amount,
        userId,
        workshopId
      });
      
      // Update the registration status to processing
      if (!isRetry) {
        await supabase
          .from("workshop_registrations")
          .update({
            payment_status: "processing",
            payment_id: data.id,
            updated_at: new Date().toISOString(),
          })
          .eq("workshop_id", workshopId)
          .eq("user_id", userId);
      }

      return { success: true, redirect_url: data.transaction.url };
    }

    // Log failure
    await logPaymentAction({
      action: "client_create_payment_failure",
      status: "error",
      amount,
      userId,
      workshopId,
      error_message: "Failed to create payment link"
    });

    return { success: false, error: "Failed to create payment link" };
  } catch (error) {
    console.error("Error in createTapPayment:", error);
    
    // Log the exception
    try {
      await logPaymentAction({
        action: "client_create_payment_exception",
        status: "error",
        amount,
        userId,
        workshopId,
        error_message: error.message
      });
    } catch (logError) {
      console.error("Error logging payment action:", logError);
    }
    
    return { success: false, error: error.message };
  }
};

export const verifyTapPayment = async (
  tapId: string
): Promise<{ success: boolean; status?: string; error?: string }> => {
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

// Helper function to log payment actions on the client side
async function logPaymentAction({
  action,
  status,
  payment_id = null,
  amount = null,
  userId = null,
  workshopId = null,
  response_data = null,
  error_message = null
}) {
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
