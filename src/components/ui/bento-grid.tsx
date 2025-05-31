
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  size?: "small" | "medium" | "large" | "wide" | "tall" | "featured";
  gradient?: "ai" | "marketing" | "content" | "live" | "default";
  hover?: boolean;
  onClick?: () => void;
}

const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6",
      "auto-rows-[minmax(200px,auto)]",
      className
    )}>
      {children}
    </div>
  );
};

const BentoCard = ({ 
  children, 
  className, 
  size = "medium", 
  gradient = "default",
  hover = true,
  onClick 
}: BentoCardProps) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-1",
    large: "col-span-1 md:col-span-2 lg:col-span-3 row-span-2",
    wide: "col-span-1 md:col-span-2 lg:col-span-4 row-span-1",
    tall: "col-span-1 md:col-span-2 row-span-2",
    featured: "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6 row-span-2",
  };

  const gradientClasses = {
    ai: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    marketing: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    content: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
    live: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
    default: "bg-white border-gray-200",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-sm transition-all duration-300",
        sizeClasses[size],
        gradientClasses[gradient],
        hover && "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { BentoGrid, BentoCard };
