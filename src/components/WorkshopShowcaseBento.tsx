
import { useState, useEffect } from "react";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Star, Play, BookOpen } from "lucide-react";

const WorkshopShowcaseBento = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWorkshops();
        setWorkshops(data.slice(0, 8)); // Show only first 8 workshops
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

  const getWorkshopGradient = (title: string) => {
    if (title.includes("ذكاء") || title.includes("AI") || title.includes("ChatGPT")) return "ai";
    if (title.includes("تسويق") || title.includes("Marketing")) return "marketing";
    if (title.includes("محتوى") || title.includes("Content")) return "content";
    return "default";
  };

  const getWorkshopIcon = (title: string) => {
    if (title.includes("ذكاء") || title.includes("AI") || title.includes("ChatGPT")) return <Star className="w-5 h-5" />;
    if (title.includes("تسويق") || title.includes("Marketing")) return <Users className="w-5 h-5" />;
    if (title.includes("محتوى") || title.includes("Content")) return <BookOpen className="w-5 h-5" />;
    return <Play className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="wirashna-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ورش العمل المتاحة</h2>
            <p className="text-gray-600 text-lg">اكتشف مجموعة متنوعة من ورش العمل التفاعلية</p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="wirashna-loader"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="wirashna-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">ورش العمل المتاحة</h2>
          <p className="text-gray-600 text-lg">اكتشف مجموعة متنوعة من ورش العمل التفاعلية</p>
        </div>
        
        {workshops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">لا توجد ورش متاحة حالياً</p>
          </div>
        ) : (
          <>
            <BentoGrid className="mb-8">
              {/* Featured Workshop - Takes full width */}
              {workshops[0] && (
                <BentoCard size="featured" gradient={getWorkshopGradient(workshops[0].title)}>
                  <div className="flex flex-col lg:flex-row items-center gap-6 h-full">
                    <div className="lg:w-1/3">
                      <img
                        src={workshops[0].cover_image || "/placeholder.svg"}
                        alt={workshops[0].title}
                        className="w-full h-48 lg:h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="lg:w-2/3 space-y-4">
                      <div className="flex items-center gap-2">
                        {getWorkshopIcon(workshops[0].title)}
                        <Badge className="bg-wirashna-accent text-white">مميزة</Badge>
                      </div>
                      <h3 className="text-2xl font-bold">{workshops[0].title}</h3>
                      <p className="text-gray-600 text-lg">{workshops[0].short_description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{workshops[0].available_seats} مقعد متاح</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{workshops[0].date}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-wirashna-accent">{workshops[0].price} د.ك</span>
                        <Link to={`/workshops/${workshops[0].id}`}>
                          <Button size="lg" className="bg-wirashna-accent hover:bg-wirashna-accent-light">
                            سجل الآن
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              )}

              {/* Regular Workshop Cards */}
              {workshops.slice(1, 7).map((workshop, index) => (
                <BentoCard 
                  key={workshop.id} 
                  size={index % 3 === 0 ? "tall" : "medium"}
                  gradient={getWorkshopGradient(workshop.title)}
                >
                  <div className="flex flex-col h-full">
                    <div className="relative mb-4">
                      <img
                        src={workshop.cover_image || "/placeholder.svg"}
                        alt={workshop.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {getWorkshopIcon(workshop.title)}
                      </div>
                    </div>
                    
                    <div className="flex-grow space-y-3">
                      <h4 className="font-bold text-lg line-clamp-2">{workshop.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{workshop.short_description}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{workshop.available_seats} متاح</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold text-wirashna-accent">{workshop.price} د.ك</span>
                      <Link to={`/workshops/${workshop.id}`}>
                        <Button size="sm" variant="outline">
                          التفاصيل
                        </Button>
                      </Link>
                    </div>
                  </div>
                </BentoCard>
              ))}

              {/* Statistics Card */}
              <BentoCard size="medium" gradient="default">
                <div className="text-center space-y-4">
                  <h4 className="font-bold text-lg">إحصائيات المنصة</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-wirashna-accent">500+</div>
                      <div className="text-sm text-gray-600">متدرب</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-wirashna-accent">50+</div>
                      <div className="text-sm text-gray-600">ورشة</div>
                    </div>
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>

            <div className="text-center">
              <Link to="/workshops">
                <Button size="lg" variant="outline" className="border-wirashna-accent text-wirashna-accent hover:bg-wirashna-accent hover:text-white">
                  استكشف جميع الورش
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WorkshopShowcaseBento;
