
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserDetails } from "@/types/payment";
import { recalculateWorkshopSeats } from "@/services/workshops";
import { usePaymentErrors } from "./usePaymentErrors";
import { usePaymentRedirect } from "./usePaymentRedirect";

interface PaymentHandlerProps {
  workshopId: string;
  userId: string;
  price: number;
  isRetry: boolean;
}

export const usePaymentHandler = ({ 
  workshopId, 
  userId, 
  price, 
  isRetry 
}: PaymentHandlerProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { handlePaymentError } = usePaymentErrors(workshopId);
  const { redirectToPayment } = usePaymentRedirect({ 
    workshopId, 
    userId, 
    price, 
    isRetry 
  });

  const handlePayment = async (values: UserDetails) => {
    setIsProcessing(true);
    try {
      const paymentResult = await redirectToPayment(values);
      
      if (!paymentResult) {
        await recalculateWorkshopSeats(workshopId);
        toast({
          title: "خطأ في معالجة الدفع",
          description: "حدث خطأ أثناء إنشاء عملية الدفع",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error: any) {
      return handlePaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};
