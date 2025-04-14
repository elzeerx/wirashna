
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const TAP_API_KEY = Deno.env.get("TAP_SECRET_KEY");
const TAP_API_URL = "https://api.tap.company/v2/tokens";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const requestData = await req.json();
    const { check } = requestData;

    // Check if TAP_SECRET_KEY is configured
    if (!TAP_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "مفتاح TAP API غير مكوّن. يرجى إضافته إلى إعدادات الوظائف." 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If just checking for key existence, return success
    if (check === "key") {
      return new Response(
        JSON.stringify({ success: true, message: "مفتاح TAP API موجود" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Test the key validity with a simple API call
    const response = await fetch(TAP_API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${TAP_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const status = response.status;
    
    if (status === 200 || status === 401) {
      // 401 is expected for GET /tokens without a token ID
      // This means the key is valid but we're not authorized for this specific operation
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "مفتاح TAP API صالح",
          status: status
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `مفتاح TAP API غير صالح. رمز الحالة: ${status}`,
          status: status
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error checking TAP API key:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `حدث خطأ أثناء التحقق من مفتاح TAP API: ${error.message}`,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
