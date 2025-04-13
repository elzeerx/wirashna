
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { registerForWorkshop } from "@/services/workshops";
import { createTapPayment } from "@/services/payment";
import { UserFormData } from "../UserDetailsForm";

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
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UserFormData) => {
    if (!workshopId || !user) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى تسجيل الدخول والتأكد من اختيار ورشة صحيحة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Register for the workshop first (or update existing registration if it's a retry)
      // The updated registerForWorkshop function will handle retry logic internally
      const registration = await registerForWorkshop({
        workshop_id: workshopId,
        user_id: user.id,
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        notes: isRetry ? "Payment Retry" : "Payment Method: credit"
      });
      
      // Process online payment
      if (workshopPrice > 0) {
        const paymentResult = await createTapPayment(
          workshopPrice,
          workshopId,
          user.id,
          {
            name: values.fullName,
            email: values.email,
            phone: values.phone
          },
          isRetry
        );
        
        if (paymentResult.success && paymentResult.redirect_url) {
          // Redirect to Tap payment page
          window.location.href = paymentResult.redirect_url;
          return;
        } else {
          toast({
            title: "خطأ في معالجة الدفع",
            description: paymentResult.error || "حدث خطأ أثناء إنشاء عملية الدفع",
            variant: "destructive",
          });
        }
      } else {
        // Free workshop, just show success message and redirect
        toast({
          title: "تم تسجيل طلبك بنجاح",
          description: "شكراً لتسجيلك في الورشة",
        });
        
        // Redirect to home page after successful registration
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // If it's a DuplicateRegistrationError, show a specific message
      if (error.name === "DuplicateRegistrationError") {
        toast({
          title: "لا يمكن التسجيل مرة أخرى",
          description: error.message || "لقد قمت بالتسجيل في هذه الورشة مسبقاً ولا يمكن التسجيل مرة أخرى.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطأ في التسجيل",
          description: error.message || "حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
