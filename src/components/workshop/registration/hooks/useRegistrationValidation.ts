
import { useToast } from "@/hooks/use-toast";

export const useRegistrationValidation = () => {
  const { toast } = useToast();

  const validateRegistration = (workshopId?: string, userId?: string) => {
    if (!workshopId) {
      toast({
        title: "خطأ في التسجيل",
        description: "لم يتم تحديد الورشة المطلوبة",
        variant: "destructive",
      });
      return false;
    }

    if (!userId) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى تسجيل الدخول قبل محاولة التسجيل في الورشة",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateRegistration };
};
