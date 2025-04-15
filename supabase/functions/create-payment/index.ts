
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { TapService } from "../_shared/tap-service.ts";
import { logPaymentAction } from "../_shared/payment-logger.ts";
import type { TapPayload } from "../_shared/payment-types.ts";

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

    const { amount, customerDetails, workshopId, userId, redirectUrl, isRetry } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!amount || !customerDetails || !workshopId || !userId || !redirectUrl) {
      await logPaymentAction({
        action: "create_payment_attempt",
        status: "error",
        error_message: "Missing required parameters",
        ip_address: ip
      });

      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Creating Tap payment with data:", {
      amount,
      workshopId,
      userId,
      redirectUrl,
      isRetry
    });

    const tapPayload: TapPayload = {
      amount,
      currency: "KWD",
      threeDSecure: true,
      save_card: false,
      description: `Workshop Registration Payment`,
      statement_descriptor: "Wirashna Workshop",
      metadata: {
        workshopId,
        userId,
      },
      reference: {
        transaction: `ws-${workshopId}-${Date.now()}`,
        order: `order-${Date.now()}`
      },
      receipt: {
        email: true,
        sms: true
      },
      customer: {
        first_name: customerDetails.name.split(" ")[0],
        last_name: customerDetails.name.split(" ").slice(1).join(" ") || " ",
        email: customerDetails.email,
        phone: {
          country_code: "965",
          number: customerDetails.phone.replace(/[^0-9]/g, "")
        }
      },
      source: { id: "src_kw.knet" },
      redirect: { url: redirectUrl }
    };

    const tapService = new TapService(TAP_API_KEY);
    const data = await tapService.createCharge(tapPayload);

    await logPaymentAction({
      action: "create_payment",
      status: data.id ? "success" : "error",
      payment_id: data.id,
      amount,
      userId,
      workshopId,
      response_data: data,
      error_message: data.error || null,
      ip_address: ip
    });
    
    return new Response(
      JSON.stringify(data),
      {
        status: data.id ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    
    await logPaymentAction({
      action: "create_payment_attempt",
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

