
import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  time: string;
  activity: string;
}

interface WorkshopScheduleProps {
  schedule: ScheduleItem[];
  className?: string;
}

const WorkshopSchedule = ({ schedule, className }: WorkshopScheduleProps) => {
  if (!schedule || schedule.length === 0) {
    return null;
  }

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-wirashna-accent" size={20} />
        <h2 className="text-xl font-bold">جدول الورشة</h2>
      </div>
      
      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-4">
          {schedule.map((item, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="relative">
                {/* Time bubble */}
                <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-wirashna-accent text-white text-xs">
                  <Clock size={16} />
                </div>
                
                {/* Content */}
                <div className="mr-12 rounded-lg border bg-white p-4 shadow-sm animate-fade-in">
                  <div className="mb-2 text-wirashna-accent font-bold">{item.time}</div>
                  <div>{item.activity}</div>
                </div>
                
                {/* Connecting line */}
                {index < schedule.length - 1 && (
                  <div className="absolute top-8 right-4 bottom-0 w-[2px] bg-wirashna-accent/20 h-8" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkshopSchedule;
