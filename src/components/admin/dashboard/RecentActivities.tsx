
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
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
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mt-1 ml-4">
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
