
import { useState, useEffect } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { fetchWorkshopRegistrations } from "@/services/workshops";

export const useRegistrationsState = (workshopId: string) => {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!workshopId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchWorkshopRegistrations(workshopId);
        setRegistrations(data);
      } catch (error) {
        console.error("Error loading workshop registrations:", error);
        toast({
          title: "خطأ في تحميل بيانات التسجيلات",
          description: "حدث خطأ أثناء تحميل بيانات التسجيلات. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, [workshopId, toast]);

  return {
    registrations,
    setRegistrations,
    isLoading,
    isProcessing,
    setIsProcessing
  };
};
