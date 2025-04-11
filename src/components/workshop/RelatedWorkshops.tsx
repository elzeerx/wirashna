
import WorkshopCard from "@/components/WorkshopCard";
import { Workshop } from "@/types/supabase";
import { workshopToCardProps } from "@/components/WorkshopCard";

interface RelatedWorkshopsProps {
  workshops: Workshop[];
}

const RelatedWorkshops = ({ workshops }: RelatedWorkshopsProps) => {
  if (workshops.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">ورش عمل ذات صلة</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.map((workshop) => (
          <div key={workshop.id}>
            <WorkshopCard {...workshopToCardProps(workshop)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedWorkshops;
