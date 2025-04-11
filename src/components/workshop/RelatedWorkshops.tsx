
import WorkshopCard from "@/components/WorkshopCard";

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  availableSeats: number;
  image: string;
}

interface RelatedWorkshopsProps {
  workshops: Workshop[];
}

const RelatedWorkshops = ({ workshops }: RelatedWorkshopsProps) => {
  if (workshops.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">ورش ذات صلة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map(workshop => (
          <WorkshopCard 
            key={workshop.id} 
            id={workshop.id}
            title={workshop.title}
            description={workshop.description}
            date={workshop.date}
            time={workshop.time}
            venue={workshop.venue}
            availableSeats={workshop.availableSeats}
            image={workshop.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedWorkshops;
