
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTapPayment } from "@/services/payment";
import { useToast } from "@/hooks/use-toast";
import { UserDetails } from "@/services/payment/types";
import { supabase } from "@/integrations/supabase/client";

type PaymentHandlerProps = {
  workshopId: string;
  userId: string;
  price: number;
  isRetry: boolean;
};

export const usePaymentHandler = ({ workshopId, userId, price, isRetry }: PaymentHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWorkshopClosed, setIsWorkshopClosed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if workshop registration is closed
  useEffect(() => {
    const checkWorkshopStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('workshops')
          .select('registration_closed')
          .eq('id', workshopId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setIsWorkshopClosed(data.registration_closed === true);
        }
      } catch (error) {
        console.error("Error checking workshop status:", error);
      }
    };
    
    checkWorkshopStatus();
  }, [workshopId]);

  const handlePayment = async (customerDetails: UserDetails) => {
    if (!userId) {
      toast({
        title: "خطأ في عملية الدفع",
        description: "يرجى تسجيل الدخول قبل المتابعة",
        variant: "destructive",
      });
      return false;
    }

    // Check if workshop is closed
    if (isWorkshopClosed) {
      toast({
        title: "التسجيل مغلق",
        description: "عذراً، التسجيل مغلق لهذه الورشة",
        variant: "destructive",
      });
      return false;
    }

    setIsProcessing(true);
    try {
      console.log("Starting payment process for workshop:", workshopId, "User:", userId, "Price:", price);
      
      const result = await createTapPayment(
        price, 
        workshopId, 
        userId, 
        customerDetails,
        isRetry
      );
      
      if (result.success && result.redirect_url) {
        console.log("Payment initiated successfully. Redirecting to payment gateway.");
        window.location.href = result.redirect_url;
        return true;
      } else {
        console.error("Payment initiation failed:", result.error);
        toast({
          title: "خطأ في عملية الدفع",
          description: result.error || "حدث خطأ أثناء تهيئة عملية الدفع. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطأ في عملية الدفع",
        description: "حدث خطأ غير متوقع أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing, isWorkshopClosed };
};
