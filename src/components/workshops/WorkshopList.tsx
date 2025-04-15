
import { Link } from "react-router-dom";
import { Eye, Award, FileText, CalendarCheck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkshopRegistration } from "@/types/supabase";

interface WorkshopListProps {
  workshops: (WorkshopRegistration & { workshops?: any })[];
  type: "upcoming" | "past";
  hasCertificate?: (workshopId: string) => boolean;
}

const WorkshopList = ({ workshops, type, hasCertificate }: WorkshopListProps) => {
  if (workshops.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          {type === "upcoming" ? "لا توجد ورش قادمة حالياً" : "لا توجد ورش سابقة"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workshops.map(registration => (
        <div 
          key={registration.id} 
          className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center"
        >
          <div className="md:w-16 md:h-16 h-12 w-full md:ml-4 mb-4 md:mb-0">
            <img 
              src={registration.workshops?.image || "/placeholder.svg"} 
              alt={registration.workshops?.title} 
              className="w-full h-full object-cover rounded"
            />
          </div>
          
          <div className="flex-grow">
            <h3 className="font-bold text-lg mb-1">
              {registration.workshops?.title}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <CalendarCheck size={16} className="ml-1" />
                {registration.workshops?.date}
              </div>
              {type === "upcoming" ? (
                <div className="flex items-center">
                  <CalendarCheck size={16} className="ml-1" />
                  {registration.workshops?.time}
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle size={16} className="ml-1" />
                  مكتملة
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:mr-4 flex flex-wrap gap-2">
            {type === "upcoming" ? (
              <>
                <Badge className="bg-green-500">قادمة</Badge>
                <Link 
                  to={`/workshops/${registration.workshop_id}`}
                  className="text-wirashna-accent hover:underline text-sm"
                >
                  <Button variant="ghost" size="sm">
                    <Eye size={16} className="ml-1" />
                    التفاصيل
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!hasCertificate?.(registration.workshop_id)}
                  className="text-wirashna-accent hover:text-wirashna-accent/90"
                >
                  <Award size={16} className="ml-1" />
                  الشهادة
                </Button>
                
                <Button variant="outline" size="sm">
                  <FileText size={16} className="ml-1" />
                  المواد
                </Button>
                
                <Link 
                  to={`/workshops/${registration.workshop_id}`}
                  className="text-wirashna-accent hover:underline"
                >
                  <Button variant="ghost" size="sm">
                    <Eye size={16} className="ml-1" />
                    التفاصيل
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkshopList;
