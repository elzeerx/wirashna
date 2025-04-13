
import { supabase } from "@/integrations/supabase/client";
import { UserDetails } from "@/types/payment";

export const createTapPayment = async (
  amount: number,
  workshopId: string,
  userId: string,
  customerDetails: UserDetails
): Promise<{ success: boolean; redirect_url?: string; error?: string }> => {
  try {
    // Get the current URL to use as the base for the redirect
    const baseUrl = window.location.origin;
    const redirectUrl = `${baseUrl}/payment/callback`;

    // Call the Supabase Edge Function to create a payment
    const { data, error } = await supabase.functions.invoke("create-payment", {
      body: {
        amount,
        workshopId,
        userId,
        customerDetails,
        redirectUrl,
      },
    });

    if (error) {
      console.error("Error creating payment:", error);
      return { success: false, error: error.message };
    }

    if (data && data.transaction && data.transaction.url) {
      // Update the registration status to processing
      await supabase
        .from("workshop_registrations")
        .update({
          payment_status: "processing",
          payment_id: data.id,
          updated_at: new Date().toISOString(),
        })
        .eq("workshop_id", workshopId)
        .eq("user_id", userId);

      return { success: true, redirect_url: data.transaction.url };
    }

    return { success: false, error: "Failed to create payment link" };
  } catch (error) {
    console.error("Error in createTapPayment:", error);
    return { success: false, error: error.message };
  }
};

export const verifyTapPayment = async (
  tapId: string
): Promise<{ success: boolean; status?: string; error?: string }> => {
  try {
    // Call the Supabase Edge Function to verify payment
    const { data, error } = await supabase.functions.invoke("verify-payment", {
      body: { tap_id: tapId },
    });

    if (error) {
      console.error("Error verifying payment:", error);
      return { success: false, error: error.message };
    }

    if (data && data.payment && data.payment.status) {
      return { success: true, status: data.payment.status };
    }

    return { success: false, error: "Failed to verify payment status" };
  } catch (error) {
    console.error("Error in verifyTapPayment:", error);
    return { success: false, error: error.message };
  }
};
