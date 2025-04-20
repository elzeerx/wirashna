
import { Calendar, Clock, Users } from "lucide-react";
import { Workshop } from "@/types/supabase";

type WorkshopPreviewProps = {
  workshop: Workshop;
};

const WorkshopPreview = ({ workshop }: WorkshopPreviewProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-8">
      <img 
        src={workshop.cover_image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c"} 
        alt={workshop.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{workshop.title}</h1>
          {/* Removed the badge */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>تاريخ البدء: {workshop.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>المدة: {workshop.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>المقاعد المتبقية: {workshop.available_seats} من {workshop.total_seats}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopPreview;
