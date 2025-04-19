
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Edit, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  icon: React.ReactNode;
}

export interface RecentActivitiesProps {
  title?: string;
  activities?: ActivityItem[];
  onViewAll?: () => void;
}

export function RecentActivities({ 
  title = "النشاطات الأخيرة", 
  activities: providedActivities,
  onViewAll 
}: RecentActivitiesProps) {
  const [fetchedActivities, setFetchedActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase.rpc('dashboard_recent_activity');
      if (error) throw error;
      setFetchedActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "خطأ في تحميل النشاطات",
        description: "حدث خطأ أثناء تحميل النشاطات الأخيرة",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Only fetch activities if none are provided
    if (!providedActivities) {
      fetchActivities();

      // Subscribe to realtime changes
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
  const displayActivities = providedActivities || fetchedActivities.map(activity => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    time: format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm'),
    icon: getIcon(activity.icon)
  }));

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
        <div className="space-y-6">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start">
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivities;

