
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { verifyTapPayment } from "@/services/payment";
import { recalculateWorkshopSeats } from "@/services/workshops";

interface UsePaymentVerificationProps {
  tapId: string | null;
  status: string | null;
  workshopId: string | null;
}

export const usePaymentVerification = ({ tapId, status, workshopId }: UsePaymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!tapId) {
          setPaymentStatus("error");
          toast({
            title: "خطأ في التحقق من الدفع",
            description: "لم يتم العثور على معرف عملية الدفع",
            variant: "destructive",
          });
          return;
        }

        if (status === "CAPTURED") {
          setPaymentStatus("success");
          
          const result = await verifyTapPayment(tapId);
          
          if (workshopId) {
            try {
              await recalculateWorkshopSeats(workshopId);
            } catch (error) {
              console.error("Error recalculating seats:", error);
            }
          }
          
          toast({
            title: "تمت عملية الدفع بنجاح",
            description: "تم تأكيد تسجيلك في الورشة",
          });
          return;
        }

        let maxAttempts = 2;
        let attempts = 0;
        let success = false;
        
        while (!success && attempts < maxAttempts) {
          attempts++;
          setVerificationAttempts(prev => prev + 1);
          console.log(`Verification attempt ${attempts} for payment ${tapId}`);
          
          if (attempts > 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
          
          const result = await verifyTapPayment(tapId);
          
          if (result.success) {
            success = true;
            if (result.status === "CAPTURED") {
              setPaymentStatus("success");
              
              if (workshopId) {
                try {
                  await recalculateWorkshopSeats(workshopId);
                } catch (error) {
                  console.error("Error recalculating seats:", error);
                }
              }
              
              toast({
                title: "تمت عملية الدفع بنجاح",
                description: "تم تأكيد تسجيلك في الورشة",
              });
            } else {
              setPaymentStatus("failed");
              toast({
                title: "فشلت عملية الدفع",
                description: "لم يتم اكتمال عملية الدفع بنجاح",
                variant: "destructive",
              });
            }
          } else if (attempts >= maxAttempts) {
            setPaymentStatus("error");
            toast({
              title: "خطأ في التحقق من الدفع",
              description: result.error || "حدث خطأ أثناء التحقق من حالة الدفع",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus("error");
        toast({
          title: "خطأ في التحقق من الدفع",
          description: "حدث خطأ أثناء التحقق من حالة الدفع",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [tapId, status, workshopId, toast]);

  return {
    isVerifying,
    paymentStatus,
    verificationAttempts
  };
};
