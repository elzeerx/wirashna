
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit, CreditCard } from "lucide-react";

import { Activity, ActivityItem } from "./types";
import { ActivityItem as ActivityItemComponent } from "./ActivityItem";

export function RecentActivities({ 
  title = "النشاطات الأخيرة", 
  activities: providedActivities,
  onViewAll 
}: RecentActivitiesProps) {
  const [fetchedActivities, setFetchedActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase.rpc('dashboard_recent_activity');
      
      if (error) throw error;
      setFetchedActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error as Error);
      toast({
        title: "خطأ في تحميل النشاطات",
        description: "حدث خطأ أثناء تحميل النشاطات الأخيرة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch activities if none are provided
    if (!providedActivities) {
      fetchActivities();

      // Setup realtime subscription
      try {
        const channel = supabase.channel('dashboard')
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'workshop_registrations' 
          }, () => fetchActivities())
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'payment_logs' 
          }, () => fetchActivities())
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'workshops' 
          }, () => fetchActivities())
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
        // Don't throw here, just log the error
      }
    }
  }, [providedActivities]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-plus':
        return <UserPlus className="text-green-500" size={20} />;
      case 'credit-card':
        return <CreditCard className="text-blue-500" size={20} />;
      case 'edit':
        return <Edit className="text-amber-500" size={20} />;
      default:
        return null;
    }
  };

  // Use provided activities if available, otherwise use fetched activities
  const mapFetchedActivities = (): ActivityItem[] => {
    return fetchedActivities.map(activity => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      time: format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm'),
      icon: getIcon(activity.icon)
    }));
  };

  const displayActivities = providedActivities ?? mapFetchedActivities();

  // Handle empty state
  if (!displayActivities || displayActivities.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4 text-center">لا توجد نشاطات حديثة.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        {onViewAll && (
          <Button variant="ghost" className="text-sm" onClick={onViewAll}>
            عرض الكل
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && !providedActivities ? (
          <div className="flex justify-center py-4">
            <div className="wirashna-loader"></div>
          </div>
        ) : error && !providedActivities ? (
          <p className="text-sm text-red-500 py-2">خطأ في تحميل النشاطات. حاول مرة أخرى لاحقًا.</p>
        ) : (
          <div className="space-y-6">
            {displayActivities.map((activity) => (
              <ActivityItemComponent key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Default export for React.lazy
export default RecentActivities;

// Re-export types for external use
export type { 
  RecentActivitiesProps, 
  Activity, 
  ActivityItem 
} from "./types";
