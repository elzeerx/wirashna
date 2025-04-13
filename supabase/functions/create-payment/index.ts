
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const TAP_API_KEY = Deno.env.get("TAP_SECRET_KEY");
const TAP_API_URL = "https://api.tap.company/v2/charges";

const supabaseUrl = "https://dxgscdegcjhejmqcvajc.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
    const { amount, customerDetails, workshopId, userId, redirectUrl, isRetry } = requestData;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!amount || !customerDetails || !workshopId || !userId || !redirectUrl) {
      // Log the error
      await logPaymentAction({
        action: "create_payment_attempt",
        status: "error",
        amount,
        userId,
        workshopId,
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

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If this is a retry attempt, check for existing registration in failed or processing state
    if (isRetry) {
      console.log("This is a retry attempt, checking for existing registration");
      
      const { data: existingRegistrations, error: fetchError } = await supabase
        .from("workshop_registrations")
        .select("*")
        .eq("workshop_id", workshopId)
        .eq("user_id", userId)
        .in("payment_status", ["failed", "processing", "unpaid"]);
      
      if (fetchError) {
        console.error("Error checking for existing registration:", fetchError);
      } else if (existingRegistrations && existingRegistrations.length > 0) {
        console.log("Found existing registration:", existingRegistrations[0]);
        
        // Update the existing registration to processing status
        const { error: updateError } = await supabase
          .from("workshop_registrations")
          .update({
            payment_status: "processing",
            updated_at: new Date().toISOString()
          })
          .eq("id", existingRegistrations[0].id);
        
        if (updateError) {
          console.error("Error updating existing registration:", updateError);
        } else {
          console.log("Updated existing registration to processing status");
        }
      } else {
        console.log("No existing registration found for retry, will create new one");
      }
    }

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

    // Log the payment attempt
    await logPaymentAction({
      action: "create_payment",
      status: response.ok ? "success" : "error",
      payment_id: data.id,
      amount,
      userId,
      workshopId,
      response_data: data,
      error_message: response.ok ? null : data.error || "API error",
      ip_address: ip
    });
    
    return new Response(
      JSON.stringify(data),
      {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    
    // Log the error
    try {
      await logPaymentAction({
        action: "create_payment_attempt",
        status: "error",
        error_message: error.message,
        ip_address: req.headers.get("x-forwarded-for") || "unknown"
      });
    } catch (logError) {
      console.error("Error logging payment action:", logError);
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Helper function to log payment actions
async function logPaymentAction({
  action,
  status,
  payment_id = null,
  amount = null,
  userId = null,
  workshopId = null,
  response_data = null,
  error_message = null,
  ip_address = null
}) {
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
