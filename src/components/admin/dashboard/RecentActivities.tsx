
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  icon: React.ReactNode;
}

interface RecentActivitiesProps {
  title: string;
  activities: Activity[];
  onViewAll: () => void;
}

const RecentActivities = ({ title, activities, onViewAll }: RecentActivitiesProps) => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        <Button variant="ghost" onClick={onViewAll} className="text-sm">
          عرض الكل
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">لا توجد نشاطات حديثة</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="mt-1 ml-4">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{activity.title}</h4>
                    <span className="text-sm text-gray-500">
                      {format(new Date(activity.created_at), 'PPp', { locale: ar })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
