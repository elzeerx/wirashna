
import { useCallback, useState } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  updateRegistrationStatus, 
  deleteRegistration, 
  resetRegistration 
} from "@/services/workshops";

export const useRegistrationOperations = (
  registrations: WorkshopRegistration[],
  setRegistrations: React.Dispatch<React.SetStateAction<WorkshopRegistration[]>>,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  // Add a local operation state to prevent concurrent operations
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  const handleUpdateRegistration = useCallback(async (registrationId: string, data: Partial<WorkshopRegistration>) => {
    if (!registrationId || isOperationInProgress) return false;
    
    try {
      setIsOperationInProgress(true);
      setIsProcessing(true);
      
      await updateRegistrationStatus(registrationId, data);
      
      // Update the local registrations list
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(reg => 
          reg.id === registrationId ? { ...reg, ...data } : reg
        )
      );
      
      toast({
        title: "تم تحديث التسجيل بنجاح",
        description: "تم تحديث بيانات التسجيل بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating registration:", error);
      toast({
        title: "خطأ في تحديث التسجيل",
        description: "حدث خطأ أثناء تحديث بيانات التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsOperationInProgress(false);
      setIsProcessing(false);
    }
  }, [setRegistrations, setIsProcessing, toast, isOperationInProgress]);

  const handleRemoveRegistration = useCallback(async (registrationId: string) => {
    if (!registrationId || isOperationInProgress) return false;
    
    try {
      setIsOperationInProgress(true);
      setIsProcessing(true);
      
      await deleteRegistration(registrationId);
      
      // Update the local registrations list
      setRegistrations(prevRegistrations => 
        prevRegistrations.filter(reg => reg.id !== registrationId)
      );
      
      toast({
        title: "تم حذف التسجيل بنجاح",
        description: "تم حذف التسجيل من قاعدة البيانات",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "خطأ في حذف التسجيل",
        description: "حدث خطأ أثناء حذف التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsOperationInProgress(false);
      setIsProcessing(false);
    }
  }, [setRegistrations, setIsProcessing, toast, isOperationInProgress]);

  const handleResetConfirmation = useCallback(async (registrationId: string) => {
    if (!registrationId || isOperationInProgress) return false;
    
    try {
      setIsOperationInProgress(true);
      setIsProcessing(true);
      
      await resetRegistration(registrationId);
      
      // Update the local registrations list with proper type casting
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(reg => 
          reg.id === registrationId ? { 
            ...reg, 
            status: 'canceled' as const, 
            payment_status: 'failed' as const,
            admin_notes: 'Reset by admin to allow re-registration' 
          } : reg
        )
      );
      
      toast({
        title: "تم إعادة ضبط التسجيل بنجاح",
        description: "يمكن للمستخدم الآن التسجيل في الورشة مرة أخرى",
      });
      
      return true;
    } catch (error) {
      console.error("Error resetting registration:", error);
      toast({
        title: "خطأ في إعادة ضبط التسجيل",
        description: "حدث خطأ أثناء إعادة ضبط التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsOperationInProgress(false);
      setIsProcessing(false);
    }
  }, [setRegistrations, setIsProcessing, toast, isOperationInProgress]);

  return {
    handleUpdateRegistration,
    handleRemoveRegistration,
    handleResetConfirmation
  };
};
