
import { useState } from "react";
import { registerForWorkshop } from "@/services/workshops";
import { useRegistrationCleanup } from "./useRegistrationCleanup";
import { useRegistrationError } from "./useRegistrationError";

interface RegistrationHandlerProps {
  workshopId: string;
  userId: string;
  isRetry: boolean;
}

export const useRegistrationHandler = ({ workshopId, userId, isRetry }: RegistrationHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { cleanupRegistrations, handleSeatsRecalculation } = useRegistrationCleanup();
  const { handleDuplicateError, handleGeneralError, isDuplicateError } = useRegistrationError();

  const handleRegistration = async (values: { fullName: string; email: string; phone: string }) => {
    setIsProcessing(true);
    try {
      console.log("Starting registration process for workshop:", workshopId, "User:", userId, "Is retry:", isRetry);
      
      if (!isRetry) {
        await cleanupRegistrations(workshopId);
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
      
      if (isDuplicateError(error)) {
        handleDuplicateError(isRetry);
      } else {
        await handleSeatsRecalculation(workshopId);
        handleGeneralError(error);
      }
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleRegistration, isProcessing };
};
