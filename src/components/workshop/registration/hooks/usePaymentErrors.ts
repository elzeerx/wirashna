
import { useToast } from "@/hooks/use-toast";
import { recalculateWorkshopSeats } from "@/services/workshops";

export const usePaymentErrors = (workshopId: string) => {
  const { toast } = useToast();

  const handlePaymentError = async (error: any) => {
    console.error("Payment processing error:", error);
    
    try {
      await recalculateWorkshopSeats(workshopId);
    } catch (seatError) {
      console.error("Error recalculating seats:", seatError);
    }
    
    toast({
      title: "خطأ في معالجة الدفع",
      description: error.message || "حدث خطأ أثناء معالجة عملية الدفع",
      variant: "destructive",
    });
    
    return false;
  };

  return { handlePaymentError };
};
