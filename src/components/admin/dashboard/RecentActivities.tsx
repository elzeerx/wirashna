
// This file re-exports the RecentActivities component from the new folder structure
export { RecentActivities, type RecentActivitiesProps } from './RecentActivities/index';
export { ActivityItem } from './RecentActivities/ActivityItem';
export type { Activity, ActivityItem as ActivityItemType } from './RecentActivities/types';

// Default export for React.lazy
export { default } from './RecentActivities/index';
