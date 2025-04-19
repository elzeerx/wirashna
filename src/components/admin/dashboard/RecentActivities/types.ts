
import { ReactNode } from "react";

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  icon: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: ReactNode;
}

export interface RecentActivitiesProps {
  title?: string;
  activities?: ActivityItem[];
  onViewAll?: () => void;
}
