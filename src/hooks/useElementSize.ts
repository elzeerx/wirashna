
import { useCallback, useState, useRef, useLayoutEffect } from "react";

export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });
  
  const elementRef = useRef<T>(null);
  
  const updateSize = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      const { width, height } = element.getBoundingClientRect();
      setSize({ width, height });
    }
  }, []);
  
  useLayoutEffect(() => {
    updateSize();
    
    // Set up resize observer
    const element = elementRef.current;
    if (!element) return;
    
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    
    resizeObserver.observe(element);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateSize]);
  
  return [elementRef, size] as const;
}
