
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EnhancedBentoGridProps {
  children: ReactNode;
  className?: string;
  variant?: "dashboard" | "admin" | "workshop" | "default";
}

interface EnhancedBentoCardProps {
  children: ReactNode;
  className?: string;
  size?: "xs" | "small" | "medium" | "large" | "wide" | "tall" | "featured" | "hero";
  gradient?: "ai" | "marketing" | "content" | "live" | "analytics" | "admin" | "success" | "warning" | "default";
  hover?: boolean;
  interactive?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const EnhancedBentoGrid = ({ children, className, variant = "default" }: EnhancedBentoGridProps) => {
  const variantClasses = {
    default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
    dashboard: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    admin: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    workshop: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-4 lg:gap-6",
      "auto-rows-[minmax(180px,auto)]",
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
};

const EnhancedBentoCard = ({ 
  children, 
  className, 
  size = "medium", 
  gradient = "default",
  hover = true,
  interactive = false,
  loading = false,
  onClick 
}: EnhancedBentoCardProps) => {
  const sizeClasses = {
    xs: "col-span-1 row-span-1",
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-1",
    large: "col-span-1 md:col-span-2 lg:col-span-3 row-span-2",
    wide: "col-span-1 md:col-span-2 lg:col-span-4 row-span-1",
    tall: "col-span-1 md:col-span-2 row-span-2",
    featured: "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6 row-span-2",
    hero: "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6 row-span-3",
  };

  const gradientClasses = {
    ai: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20",
    marketing: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20",
    content: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20",
    live: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/20 dark:to-red-800/20",
    analytics: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20",
    admin: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 dark:from-gray-900/20 dark:to-gray-800/20",
    success: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20",
    warning: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20",
    default: "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700",
  };

  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm transition-all duration-300 relative overflow-hidden",
        sizeClasses[size],
        gradientClasses[gradient],
        hover && "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1",
        interactive && "cursor-pointer hover:border-wirashna-accent",
        onClick && "cursor-pointer",
        loading && "animate-pulse",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6 h-full flex flex-col">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export { EnhancedBentoGrid, EnhancedBentoCard };
