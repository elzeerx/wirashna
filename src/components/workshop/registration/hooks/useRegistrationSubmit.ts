
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UserFormData } from "../UserDetailsForm";
import { useRegistrationValidation } from "./useRegistrationValidation";
import { useRegistrationHandler } from "./useRegistrationHandler";
import { usePaymentHandler } from "./usePaymentHandler";

type UseRegistrationSubmitProps = {
  workshopId?: string;
  workshopPrice?: number;
  isRetry?: boolean;
};

export const useRegistrationSubmit = ({
  workshopId,
  workshopPrice = 0,
  isRetry = false
}: UseRegistrationSubmitProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateRegistration } = useRegistrationValidation();
  
  const userId = "user?.id"; // This will be replaced by the actual user ID from auth context
  
  const { handleRegistration, isProcessing: isRegistrationProcessing } = 
    useRegistrationHandler({ workshopId: workshopId!, userId, isRetry });
  
  const { handlePayment, isProcessing: isPaymentProcessing } = 
    usePaymentHandler({ workshopId: workshopId!, userId, price: workshopPrice, isRetry });

  const handleSubmit = async (values: UserFormData) => {
    if (!validateRegistration(workshopId, userId)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationSuccess = await handleRegistration(values);
      
      if (!registrationSuccess) {
        setIsSubmitting(false);
        return;
      }

      if (workshopPrice > 0) {
        await handlePayment(values);
      } else {
        // Free workshop, just show success message and redirect
        toast({
          title: "تم تسجيل طلبك بنجاح",
          description: "شكراً لتسجيلك في الورشة",
        });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting: isSubmitting || isRegistrationProcessing || isPaymentProcessing,
    handleSubmit
  };
};
