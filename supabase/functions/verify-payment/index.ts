
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

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
    const { tap_id } = requestData;

    if (!tap_id) {
      return new Response(
        JSON.stringify({ error: "Missing charge ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Verifying payment with ID: ${tap_id}`);

    // Verify the payment status with Tap
    const response = await fetch(`${TAP_API_URL}/${tap_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${TAP_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const paymentData = await response.json();
    console.log(`Payment verification response: ${JSON.stringify(paymentData)}`);
    
    // Check if the payment was successful
    if (paymentData.status === "CAPTURED") {
      // Create Supabase client
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Update the registration record in the database
      const { workshopId, userId } = paymentData.metadata || {};
      
      if (workshopId && userId) {
        console.log(`Updating registration for workshop: ${workshopId}, user: ${userId}`);
        
        const { data, error } = await supabase
          .from("workshop_registrations")
          .update({ 
            payment_status: "paid",
            payment_id: tap_id,
            updated_at: new Date().toISOString()
          })
          .eq("workshop_id", workshopId)
          .eq("user_id", userId)
          .eq("payment_status", "processing");
          
        if (error) {
          console.error("Error updating registration:", error);
        } else {
          console.log("Registration updated successfully:", data);
        }
      } else {
        console.error("Missing metadata in payment response: workshopId or userId not found");
      }
    } else {
      console.log(`Payment not captured. Status: ${paymentData.status}`);
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
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
