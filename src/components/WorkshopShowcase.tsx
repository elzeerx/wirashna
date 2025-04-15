
import { useState, useEffect } from "react";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";
import WorkshopCard, { workshopToCardProps } from "./WorkshopCard";

const WorkshopShowcase = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="wirashna-container">
        <h2 className="text-2xl font-bold mb-8">الورش المتاحة</h2>
        
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
            {workshops.map((workshop) => (
              <div key={workshop.id}>
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
