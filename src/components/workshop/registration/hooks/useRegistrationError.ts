
import { useToast } from "@/hooks/use-toast";

export const useRegistrationError = () => {
  const { toast } = useToast();

  const handleDuplicateError = (isRetry: boolean) => {
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
  };

  const handleGeneralError = (error: Error) => {
    toast({
      title: "خطأ في التسجيل",
      description: error.message || "حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى.",
      variant: "destructive",
    });
  };

  const isDuplicateError = (error: Error) => {
    return error.name === "DuplicateRegistrationError" || 
      (error.message && error.message.includes("duplicate key"));
  };

  return {
    handleDuplicateError,
    handleGeneralError,
    isDuplicateError
  };
};
