
import { useState, useEffect } from "react";
import { Download, FileText, Film, Image, FileSpreadsheet, File } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserRegistrations } from "@/services/workshopService";
import { fetchWorkshopMaterials } from "@/services/materialService";
import { WorkshopMaterial } from "@/types/supabase";

// Helper function to get icon based on file type
const getFileIcon = (fileUrl: string) => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <FileText className="h-8 w-8 text-red-500" />;
    case 'mp4':
    case 'mov':
    case 'avi':
      return <Film className="h-8 w-8 text-blue-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image className="h-8 w-8 text-green-500" />;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet className="h-8 w-8 text-green-700" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

const SubscriberMaterials = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [workshopMaterials, setWorkshopMaterials] = useState<{[key: string]: WorkshopMaterial[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const regs = await fetchUserRegistrations(user.id);
        setRegistrations(regs);
        
        // Set default selected workshop if available
        if (regs.length > 0) {
          setSelectedWorkshop(regs[0].workshop_id);
          
          // Load materials for all workshops
          const materialsObj: {[key: string]: WorkshopMaterial[]} = {};
          
          await Promise.all(
            regs.map(async (reg) => {
              const materials = await fetchWorkshopMaterials(reg.workshop_id);
              materialsObj[reg.workshop_id] = materials;
            })
          );
          
          setWorkshopMaterials(materialsObj);
        }
      } catch (error) {
        console.error("Error loading materials data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getWorkshopById = (id: string) => {
    const registration = registrations.find(reg => reg.workshop_id === id);
    return registration?.workshops;
  };

  return (
    <DashboardLayout title="المواد التعليمية" requireRole="subscriber">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="wirashna-loader"></div>
        </div>
      ) : registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الورش</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {registrations.map((reg) => (
                    <li key={reg.workshop_id}>
                      <button
                        onClick={() => setSelectedWorkshop(reg.workshop_id)}
                        className={`w-full p-3 text-right hover:bg-gray-50 transition-colors ${
                          selectedWorkshop === reg.workshop_id ? 'bg-wirashna-primary/10 border-r-4 border-wirashna-accent' : ''
                        }`}
                      >
                        {reg.workshops?.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {selectedWorkshop ? (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {getWorkshopById(selectedWorkshop)?.title}
                </h2>
                
                {workshopMaterials[selectedWorkshop]?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {workshopMaterials[selectedWorkshop].map((material) => (
                      <Card key={material.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className="ml-4 p-2 bg-gray-100 rounded-lg">
                              {getFileIcon(material.file_url)}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">{material.title}</h3>
                              {material.description && (
                                <p className="text-sm text-gray-600 mt-1 mb-3">
                                  {material.description}
                                </p>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => window.open(material.file_url, '_blank')}
                              >
                                <Download size={16} className="ml-1" />
                                تحميل
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">لا توجد مواد متاحة لهذه الورشة</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">يرجى اختيار ورشة لعرض موادها</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">لا توجد ورش مسجلة حالياً</p>
          <p className="text-sm text-gray-500">
            سجل في إحدى الورش للوصول إلى المواد التعليمية
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SubscriberMaterials;
