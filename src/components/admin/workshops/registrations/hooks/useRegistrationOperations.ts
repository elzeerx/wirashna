
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WorkshopRegistration } from "@/types/supabase";
import { 
  updateRegistrationStatus,
  deleteRegistration,
  resetRegistration,
  recalculateWorkshopSeats
} from "@/services/workshops";

export const useRegistrationOperations = (
  onRegistrationsUpdated: (updatedRegistration: WorkshopRegistration | null, action: 'update' | 'delete' | 'reset') => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleUpdateRegistration = async (registrationId: string, data: Partial<WorkshopRegistration>) => {
    try {
      setIsProcessing(true);
      
      // Log what's happening for debugging
      console.log("Updating registration:", registrationId, "with data:", data);
      
      const updatedRegistration = await updateRegistrationStatus(registrationId, data);
      
      // Recalculate seats if status or payment status is being updated
      if (data.status || data.payment_status) {
        try {
          if (updatedRegistration && updatedRegistration.workshop_id) {
            await recalculateWorkshopSeats(updatedRegistration.workshop_id);
          }
        } catch (recalcError) {
          console.error("Error recalculating seats after update:", recalcError);
          // Continue despite the error - we don't want to fail the entire operation
        }
      }
      
      toast({
        title: "تم تحديث التسجيل بنجاح",
        description: "تم تحديث بيانات التسجيل بنجاح",
      });
      
      // Pass the updated registration back to the parent component
      onRegistrationsUpdated(updatedRegistration, 'update');
      
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
      setIsProcessing(false);
    }
  };

  const handleRemoveRegistration = async (registrationId: string) => {
    try {
      setIsProcessing(true);
      
      // Log what's happening for debugging
      console.log("Deleting registration:", registrationId);
      
      await deleteRegistration(registrationId);
      
      toast({
        title: "تم حذف التسجيل بنجاح",
        description: "تم حذف التسجيل من قاعدة البيانات",
      });
      
      // Notify parent that a registration was deleted
      onRegistrationsUpdated(null, 'delete');
      
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
      setIsProcessing(false);
    }
  };

  const handleResetRegistration = async (registrationId: string) => {
    try {
      setIsProcessing(true);
      
      // Log what's happening for debugging
      console.log("Resetting registration:", registrationId);
      
      await resetRegistration(registrationId);
      
      toast({
        title: "تم إعادة ضبط التسجيل بنجاح",
        description: "تم إعادة ضبط التسجيل للسماح بإعادة التسجيل",
      });
      
      // Notify parent that a registration was reset
      onRegistrationsUpdated(null, 'reset');
      
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
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleUpdateRegistration,
    handleRemoveRegistration,
    handleResetRegistration
  };
};
