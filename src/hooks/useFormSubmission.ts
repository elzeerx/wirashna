
import { useState } from 'react';
import { useLoadingState } from './useLoadingState';
import { useToast } from './use-toast';

interface UseFormSubmissionOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}

export function useFormSubmission<T>({ 
  onSubmit, 
  successMessage = 'تم الحفظ بنجاح',
  errorMessage = 'حدث خطأ أثناء حفظ البيانات'
}: UseFormSubmissionOptions<T>) {
  const { isLoading, wrapAsync } = useLoadingState({ errorMessage });
  const { toast } = useToast();

  const handleSubmit = async (data: T) => {
    const result = await wrapAsync(async () => {
      await onSubmit(data);
      toast({
        title: "نجاح",
        description: successMessage,
      });
    });

    return result !== null;
  };

  return {
    isLoading,
    handleSubmit,
  };
}

