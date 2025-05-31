
import { EnhancedBentoCard } from "@/components/ui/enhanced-bento-grid";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsBentoCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon: LucideIcon;
  gradient?: "ai" | "marketing" | "content" | "live" | "analytics" | "success" | "warning" | "default";
  size?: "xs" | "small" | "medium" | "large";
  loading?: boolean;
}

const AnalyticsBentoCard = ({
  title,
  value,
  change,
  icon: Icon,
  gradient = "default",
  size = "small",
  loading = false
}: AnalyticsBentoCardProps) => {
  return (
    <EnhancedBentoCard size={size} gradient={gradient} loading={loading}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
          <Icon className="w-5 h-5 text-wirashna-accent" />
        </div>
      </div>
      
      {change && (
        <div className="mt-auto">
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-sm font-medium",
              change.value >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {change.value >= 0 ? "+" : ""}{change.value}%
            </span>
            <span className="text-xs text-gray-500">من {change.period}</span>
          </div>
        </div>
      )}
    </EnhancedBentoCard>
  );
};

export default AnalyticsBentoCard;
