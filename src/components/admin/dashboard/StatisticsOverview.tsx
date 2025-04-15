
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgClass: string;
}

interface StatisticsOverviewProps {
  stats: StatItem[];
}

const StatisticsOverview = ({ stats }: StatisticsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden p-5 border-none shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.color)}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsOverview;
