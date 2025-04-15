
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { registerForWorkshop, cleanupFailedRegistrations, recalculateWorkshopSeats } from "@/services/workshops";

interface RegistrationHandlerProps {
  workshopId: string;
  userId: string;
  isRetry: boolean;
}

export const useRegistrationHandler = ({ workshopId, userId, isRetry }: RegistrationHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRegistration = async (values: { fullName: string; email: string; phone: string; }) => {
    setIsProcessing(true);
    try {
      console.log("Starting registration process for workshop:", workshopId, "User:", userId, "Is retry:", isRetry);
      
      if (!isRetry) {
        try {
          await cleanupFailedRegistrations(workshopId);
        } catch (cleanupError) {
          console.error("Failed to cleanup registrations, but continuing:", cleanupError);
        }
      }
      
      const registration = await registerForWorkshop({
        workshop_id: workshopId,
        user_id: userId,
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        notes: isRetry ? "Payment Retry" : "Payment Method: credit"
      });
      
      console.log("Registration successful:", registration);
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.name === "DuplicateRegistrationError" || 
          (error.message && error.message.includes("duplicate key"))) {
        if (isRetry) {
          toast({
            title: "جاري معالجة طلبك السابق",
            description: "يبدو أن لديك تسجيل سابق قيد المعالجة. يرجى الانتظار حتى اكتمال العملية أو التواصل مع الدعم الفني.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "لا يمكن التسجيل مرة أخرى",
            description: "لقد قمت بالتسجيل في هذه الورشة مسبقاً ولا يمكن التسجيل مرة أخرى.",
            variant: "destructive",
          });
        }
        return false;
      }
      
      try {
        await recalculateWorkshopSeats(workshopId);
      } catch (recalcError) {
        console.error("Failed to recalculate seats:", recalcError);
      }
      
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleRegistration, isProcessing };
};
