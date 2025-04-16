
import { useState, useEffect } from 'react';
import { Workshop } from '@/types/supabase';
import { fetchWorkshops } from '@/services/workshops';
import { useToast } from '@/hooks/use-toast';

export const useWorkshopLoad = (workshopId?: string) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(workshopId || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    loadWorkshops();
  }, []);

  return {
    workshops,
    selectedWorkshopId,
    setSelectedWorkshopId,
    isLoading
  };
};
