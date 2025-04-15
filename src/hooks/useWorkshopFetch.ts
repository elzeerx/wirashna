
import { useState, useEffect } from 'react';
import { Workshop } from '@/types/supabase';
import { fetchWorkshopById } from '@/services/workshops';
import { useLoadingState } from './useLoadingState';
import { useToast } from './use-toast';

export function useWorkshopFetch(id: string | undefined) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const { isLoading, wrapAsync } = useLoadingState({
    errorMessage: "حدث خطأ أثناء تحميل بيانات الورشة. الرجاء المحاولة مرة أخرى."
  });

  useEffect(() => {
    if (!id) return;

    wrapAsync(async () => {
      const workshopData = await fetchWorkshopById(id);
      setWorkshop(workshopData);
    });
  }, [id, wrapAsync]);

  return { workshop, isLoading };
}
