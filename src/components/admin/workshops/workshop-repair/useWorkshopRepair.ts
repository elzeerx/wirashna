
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchWorkshops, recalculateWorkshopSeats, cleanupFailedRegistrations } from "@/services/workshops";
import { Workshop } from "@/types/supabase";

export const useWorkshopRepair = (workshopId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(workshopId || "");
  const [operationResults, setOperationResults] = useState<{ success: boolean; message: string } | null>(null);
  const [cleanupCompleted, setCleanupCompleted] = useState<boolean>(false);
  const [recalculationCompleted, setRecalculationCompleted] = useState<boolean>(false);
  const [autoCleanup, setAutoCleanup] = useState<boolean>(true);
  const { toast } = useToast();

  // Load workshops if not provided with a specific one
  const loadWorkshops = async () => {
    if (workshops.length > 0) return;
    
    setIsLoading(true);
    try {
      const workshopsData = await fetchWorkshops();
      setWorkshops(workshopsData);
      
      // If a workshopId was provided in props, select it
      if (workshopId && !selectedWorkshopId) {
        setSelectedWorkshopId(workshopId);
      }
    } catch (error) {
      console.error("Error loading workshops:", error);
      toast({
        title: "خطأ في تحميل الورش",
        description: "حدث خطأ أثناء تحميل بيانات الورش. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load workshops on component mount
  useEffect(() => {
    loadWorkshops();
  }, []);

  // Handle recalculating seats for a workshop
  const handleRecalculateSeats = async () => {
    if (!selectedWorkshopId) {
      toast({
        title: "حدد ورشة",
        description: "يرجى اختيار ورشة أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecalculationCompleted(false);
    setOperationResults(null);
    
    try {
      await recalculateWorkshopSeats(selectedWorkshopId);
      setOperationResults({
        success: true,
        message: "تم إعادة حساب المقاعد المتاحة بنجاح"
      });
      setRecalculationCompleted(true);
      
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
      setIsLoading(false);
    }
  };

  // Handle cleaning up failed registrations
  const handleCleanupRegistrations = async () => {
    if (!selectedWorkshopId) {
      toast({
        title: "حدد ورشة",
        description: "يرجى اختيار ورشة أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCleanupCompleted(false);
    setOperationResults(null);
    
    try {
      await cleanupFailedRegistrations(selectedWorkshopId);
      
      // If auto cleanup is enabled, also recalculate seats
      if (autoCleanup) {
        await recalculateWorkshopSeats(selectedWorkshopId);
        setRecalculationCompleted(true);
      }
      
      setOperationResults({
        success: true,
        message: "تم تنظيف التسجيلات الفاشلة بنجاح" + (autoCleanup ? " وإعادة حساب المقاعد" : "")
      });
      setCleanupCompleted(true);
      
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
      setIsLoading(false);
    }
  };

  // Handle repair all operation (cleanup and recalculate)
  const handleRepairAll = async () => {
    if (!selectedWorkshopId) {
      toast({
        title: "حدد ورشة",
        description: "يرجى اختيار ورشة أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCleanupCompleted(false);
    setRecalculationCompleted(false);
    setOperationResults(null);
    
    try {
      // First cleanup failed registrations
      await cleanupFailedRegistrations(selectedWorkshopId);
      setCleanupCompleted(true);
      
      // Then recalculate seats
      await recalculateWorkshopSeats(selectedWorkshopId);
      setRecalculationCompleted(true);
      
      setOperationResults({
        success: true,
        message: "تم إصلاح الورشة بنجاح (تنظيف التسجيلات وإعادة حساب المقاعد)"
      });
      
      toast({
        title: "تم الإصلاح بنجاح",
        description: "تم إصلاح الورشة بنجاح (تنظيف التسجيلات وإعادة حساب المقاعد)",
      });
    } catch (error) {
      console.error("Error repairing workshop:", error);
      setOperationResults({
        success: false,
        message: "حدث خطأ أثناء إصلاح الورشة"
      });
      
      toast({
        title: "خطأ في الإصلاح",
        description: "حدث خطأ أثناء إصلاح الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workshops,
    selectedWorkshopId,
    setSelectedWorkshopId,
    isLoading,
    operationResults,
    cleanupCompleted,
    recalculationCompleted,
    autoCleanup,
    setAutoCleanup,
    handleCleanupRegistrations,
    handleRecalculateSeats,
    handleRepairAll
  };
};
