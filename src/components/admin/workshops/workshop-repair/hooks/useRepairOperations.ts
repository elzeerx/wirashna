
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { recalculateWorkshopSeats, cleanupFailedRegistrations } from '@/services/workshops';

export const useRepairOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanupCompleted, setCleanupCompleted] = useState(false);
  const [recalculationCompleted, setRecalculationCompleted] = useState(false);
  const [operationResults, setOperationResults] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleCleanupRegistrations = async (workshopId: string, autoCleanup: boolean) => {
    if (!workshopId) return;

    setIsProcessing(true);
    setCleanupCompleted(false);
    setOperationResults(null);
    
    try {
      await cleanupFailedRegistrations(workshopId);
      setCleanupCompleted(true);
      
      if (autoCleanup) {
        await recalculateWorkshopSeats(workshopId);
        setRecalculationCompleted(true);
      }
      
      setOperationResults({
        success: true,
        message: "تم تنظيف التسجيلات الفاشلة بنجاح" + (autoCleanup ? " وإعادة حساب المقاعد" : "")
      });
      
      toast({
        title: "تم التنظيف بنجاح",
        description: "تم تنظيف التسجيلات الفاشلة بنجاح" + (autoCleanup ? " وإعادة حساب المقاعد" : ""),
      });
    } catch (error) {
      console.error("Error cleaning up registrations:", error);
      setOperationResults({
        success: false,
        message: "حدث خطأ أثناء تنظيف التسجيلات الفاشلة"
      });
      
      toast({
        title: "خطأ في التنظيف",
        description: "حدث خطأ أثناء تنظيف التسجيلات الفاشلة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecalculateSeats = async (workshopId: string) => {
    if (!workshopId) return;

    setIsProcessing(true);
    setRecalculationCompleted(false);
    setOperationResults(null);
    
    try {
      await recalculateWorkshopSeats(workshopId);
      setRecalculationCompleted(true);
      setOperationResults({
        success: true,
        message: "تم إعادة حساب المقاعد المتاحة بنجاح"
      });
      
      toast({
        title: "تم إعادة الحساب بنجاح",
        description: "تم إعادة حساب عدد المقاعد المتاحة بنجاح",
      });
    } catch (error) {
      console.error("Error recalculating seats:", error);
      setOperationResults({
        success: false,
        message: "حدث خطأ أثناء إعادة حساب المقاعد المتاحة"
      });
      
      toast({
        title: "خطأ في إعادة الحساب",
        description: "حدث خطأ أثناء إعادة حساب المقاعد المتاحة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    cleanupCompleted,
    recalculationCompleted,
    operationResults,
    handleCleanupRegistrations,
    handleRecalculateSeats
  };
};
