
import React from "react";
import { ActivityItem as ActivityItemType } from "./types";

interface ActivityItemProps {
  activity: ActivityItemType;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-start">
      <div className="mt-1 ml-4">
        {activity.icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{activity.title}</h4>
          <span className="text-sm text-gray-500">
            {activity.time}
          </span>
        </div>
        <p className="text-sm text-gray-600">{activity.description}</p>
      </div>
    </div>
  );
}
