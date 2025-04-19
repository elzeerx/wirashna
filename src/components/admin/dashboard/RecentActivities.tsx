
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Edit, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  icon: string;
}

interface RecentActivitiesProps {
  title?: string;
  onViewAll?: () => void;
}

export function RecentActivities({ title = "النشاطات الأخيرة", onViewAll }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase.rpc('dashboard_recent_activity');
      if (error) throw error;
      setActivities(data);
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
  }, []);

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
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mt-1 ml-4">
                {getIcon(activity.icon)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-sm text-gray-500">
                    {format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm')}
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

// Add default export to resolve the lazy loading issue
export default RecentActivities;
