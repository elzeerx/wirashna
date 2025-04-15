
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { TapService } from "../_shared/tap-service.ts";
import { logPaymentAction } from "../_shared/payment-logger.ts";
import { RegistrationService } from "../_shared/registration-service.ts";

const TAP_API_KEY = Deno.env.get("TAP_SECRET_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TAP_API_KEY) {
      throw new Error("TAP_SECRET_KEY is not set");
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { tap_id } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!tap_id) {
      await logPaymentAction({
        action: "verify_payment_attempt",
        status: "error",
        error_message: "Missing charge ID",
        ip_address: ip
      });

      return new Response(
        JSON.stringify({ error: "Missing charge ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Verifying payment with ID: ${tap_id}`);

    const tapService = new TapService(TAP_API_KEY);
    const paymentData = await tapService.verifyCharge(tap_id);

    await logPaymentAction({
      action: "verify_payment",
      status: "success",
      payment_id: tap_id,
      amount: paymentData.amount,
      userId: paymentData.metadata?.userId,
      workshopId: paymentData.metadata?.workshopId,
      response_data: paymentData,
      ip_address: ip
    });
    
    if (paymentData.status === "CAPTURED") {
      const { workshopId, userId } = paymentData.metadata || {};
      
      if (workshopId && userId) {
        console.log(`Updating registration for workshop: ${workshopId}, user: ${userId}`);
        
        const registrationService = new RegistrationService();
        
        try {
          await registrationService.updateRegistrationStatus(workshopId, userId, tap_id);
          await registrationService.recalculateWorkshopSeats(workshopId);
          
          await logPaymentAction({
            action: "update_registration",
            status: "success",
            payment_id: tap_id,
            userId,
            workshopId,
            ip_address: ip
          });
        } catch (error) {
          console.error("Error updating registration:", error);
          await logPaymentAction({
            action: "update_registration",
            status: "error",
            payment_id: tap_id,
            userId,
            workshopId,
            error_message: error.message,
            ip_address: ip
          });
        }
      } else {
        console.error("Missing metadata in payment response");
        await logPaymentAction({
          action: "update_registration_attempt",
          status: "error",
          payment_id: tap_id,
          error_message: "Missing metadata: workshopId or userId not found",
          ip_address: ip
        });
      }
    } else {
      console.log(`Payment not captured. Status: ${paymentData.status}`);
      await logPaymentAction({
        action: "payment_not_captured",
        status: "info",
        payment_id: tap_id,
        userId: paymentData.metadata?.userId,
        workshopId: paymentData.metadata?.workshopId,
        response_data: { status: paymentData.status },
        ip_address: ip
      });
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        payment: paymentData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    
    await logPaymentAction({
      action: "verify_payment_error",
      status: "error",
      error_message: error.message,
      ip_address: req.headers.get("x-forwarded-for") || "unknown"
    });
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

