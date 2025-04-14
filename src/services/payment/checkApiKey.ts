
import { supabase } from "@/integrations/supabase/client";
import { logPaymentAction } from './paymentLogs';

/**
 * Checks if the TAP API key is configured and valid
 */
export const checkTapApiKey = async (): Promise<{
  success: boolean;
  message: string;
  error?: any;
}> => {
  try {
    console.log("Checking TAP API configuration");

    // Log the check attempt client-side
    await logPaymentAction({
      action: "check_tap_api_key",
      status: "pending"
    });

    // Call the Supabase Edge Function to check the API key
    const { data, error } = await supabase.functions.invoke("check-payment-api", {
      body: { check: "key" }
    });

    if (error) {
      console.error("Error checking TAP API key:", error);
      
      // Log the error
      await logPaymentAction({
        action: "check_tap_api_key",
        status: "error",
        error_message: error.message
      });
      
      return { 
        success: false, 
        message: "فشل الاتصال بخدمة فحص مفتاح API. يرجى التحقق من وجود مفتاح TAP API في إعدادات الوظائف.",
        error: error.message 
      };
    }

    if (data.success) {
      // Log successful check
      await logPaymentAction({
        action: "check_tap_api_key",
        status: "success"
      });
      
      return { 
        success: true, 
        message: "تم التحقق من مفتاح TAP API بنجاح." 
      };
    } else {
      // Log failed check
      await logPaymentAction({
        action: "check_tap_api_key",
        status: "error",
        error_message: data.message || "مفتاح API غير صالح أو غير مكوّن بشكل صحيح"
      });
      
      return { 
        success: false, 
        message: data.message || "مفتاح API غير صالح أو غير مكوّن بشكل صحيح" 
      };
    }
  } catch (error) {
    console.error("Error checking TAP API key:", error);
    
    // Log the exception
    try {
      await logPaymentAction({
        action: "check_tap_api_key",
        status: "error",
        error_message: error.message
      });
    } catch (logError) {
      console.error("Error logging API key check:", logError);
    }
    
    return { 
      success: false, 
      message: "حدث خطأ أثناء التحقق من مفتاح TAP API", 
      error: error 
    };
  }
};
