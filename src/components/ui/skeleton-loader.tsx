
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
  height?: string;
}

const SkeletonLoader = ({ count = 3, className = "", height = "h-14" }: SkeletonLoaderProps) => {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <Skeleton 
            key={index} 
            className={`w-full ${height} mb-2 ${className}`} 
          />
        ))}
    </>
  );
};

export default SkeletonLoader;
