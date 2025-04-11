
import { useState, useEffect } from "react";
import WorkshopCard, { workshopToCardProps } from "./WorkshopCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchWorkshops } from "@/services/workshopService";
import { Workshop } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

const WorkshopShowcase = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();
  const workshopsPerPage = 3;
  
  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error("Error loading workshops:", error);
        toast({
          title: "خطأ في تحميل الورش",
          description: "حدث خطأ أثناء تحميل بيانات الورش. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkshops();
  }, [toast]);
  
  const totalPages = Math.ceil(workshops.length / workshopsPerPage);
  
  const displayedWorkshops = workshops
    .slice(
      currentPage * workshopsPerPage,
      (currentPage + 1) * workshopsPerPage
    );
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % Math.max(1, totalPages));
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + Math.max(1, totalPages)) % Math.max(1, totalPages));
  };

  return (
    <section className="wirashna-section bg-wirashna-primary">
      <div className="wirashna-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">الورش القادمة</h2>
          
          <div className="flex space-x-2 space-x-reverse">
            <button 
              onClick={prevPage}
              className="p-2 rounded-full bg-wirashna-secondary hover:bg-wirashna-accent hover:text-white transition-colors"
              aria-label="Previous page"
              disabled={workshops.length === 0}
            >
              <ArrowRight size={20} />
            </button>
            
            <button 
              onClick={nextPage}
              className="p-2 rounded-full bg-wirashna-secondary hover:bg-wirashna-accent hover:text-white transition-colors"
              aria-label="Next page"
              disabled={workshops.length === 0}
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="wirashna-loader"></div>
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">لا توجد ورش متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedWorkshops.map((workshop) => (
              <div key={workshop.id} className="flex justify-center">
                <WorkshopCard {...workshopToCardProps(workshop)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkshopShowcase;
