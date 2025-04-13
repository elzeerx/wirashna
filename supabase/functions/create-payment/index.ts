
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const TAP_API_KEY = Deno.env.get("TAP_SECRET_KEY");
const TAP_API_URL = "https://api.tap.company/v2/charges";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TAP_API_KEY) {
      throw new Error("TAP_SECRET_KEY is not set");
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const requestData = await req.json();
    const { amount, customerDetails, workshopId, userId, redirectUrl } = requestData;

    if (!amount || !customerDetails || !workshopId || !userId || !redirectUrl) {
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
      redirectUrl
    });

    // Create the charge request to Tap
    const tapPayload = {
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

    console.log("Tap payload:", JSON.stringify(tapPayload));

    // Make the request to Tap API
    const response = await fetch(TAP_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TAP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tapPayload),
    });

    const data = await response.json();
    console.log("Tap API response:", JSON.stringify(data));
    
    return new Response(
      JSON.stringify(data),
      {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
