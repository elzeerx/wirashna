
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  title: string;
  actions: QuickActionItem[];
}

const QuickActions = ({ title, actions }: QuickActionsProps) => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-all"
              onClick={action.onClick}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", action.color)}>
                {action.icon}
              </div>
              <span className="text-center font-medium">{action.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
