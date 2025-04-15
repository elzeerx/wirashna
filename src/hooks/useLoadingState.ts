
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseLoadingStateOptions {
  errorMessage?: string;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const handleError = useCallback((error: Error) => {
    console.error('Operation failed:', error);
    setError(error);
    toast({
      title: "خطأ",
      description: options.errorMessage || 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.',
      variant: "destructive",
    });
  }, [options.errorMessage, toast]);

  const wrapAsync = useCallback(async <T,>(asyncFn: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      return result;
    } catch (e) {
      handleError(e as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    isLoading,
    error,
    wrapAsync,
    setIsLoading,
    setError
  };
}
