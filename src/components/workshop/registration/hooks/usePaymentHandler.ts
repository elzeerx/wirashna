
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createTapPayment } from "@/services/payment";
import { recalculateWorkshopSeats } from "@/services/workshops";

interface PaymentHandlerProps {
  workshopId: string;
  userId: string;
  price: number;
  isRetry: boolean;
}

export const usePaymentHandler = ({ workshopId, userId, price, isRetry }: PaymentHandlerProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (values: { fullName: string; email: string; phone: string }) => {
    setIsProcessing(true);
    try {
      console.log("Processing payment for amount:", price);
      const paymentResult = await createTapPayment(
        price,
        workshopId,
        userId,
        {
          name: values.fullName,
          email: values.email,
          phone: values.phone
        },
        isRetry
      );
      
      if (paymentResult.success && paymentResult.redirect_url) {
        console.log("Payment created successfully, redirecting to:", paymentResult.redirect_url);
        window.location.href = paymentResult.redirect_url;
        return true;
      } else {
        console.error("Payment creation failed:", paymentResult.error);
        await recalculateWorkshopSeats(workshopId);
        
        toast({
          title: "خطأ في معالجة الدفع",
          description: paymentResult.error || "حدث خطأ أثناء إنشاء عملية الدفع",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      await recalculateWorkshopSeats(workshopId);
      
      toast({
        title: "خطأ في معالجة الدفع",
        description: error.message || "حدث خطأ أثناء معالجة عملية الدفع",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};
