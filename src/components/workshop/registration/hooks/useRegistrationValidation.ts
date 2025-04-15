
import { useToast } from "@/hooks/use-toast";
import { UserFormData } from "../UserDetailsForm";

export const useRegistrationValidation = () => {
  const { toast } = useToast();

  const validateRegistration = (workshopId?: string, userId?: string) => {
    if (!workshopId || !userId) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى تسجيل الدخول والتأكد من اختيار ورشة صحيحة",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { validateRegistration };
};
