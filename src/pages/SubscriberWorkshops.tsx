
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Award, FileText, CalendarCheck, CheckCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserRegistrations } from "@/services/workshopService";
import { fetchUserCertificates } from "@/services/certificateService";
import { WorkshopRegistration } from "@/types/supabase";

const SubscriberWorkshops = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<(WorkshopRegistration & { workshops?: any })[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [registrationsData, certificatesData] = await Promise.all([
          fetchUserRegistrations(user.id),
          fetchUserCertificates(user.id)
        ]);
        
        setRegistrations(registrationsData);
        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Separate registrations by upcoming vs past workshops
  const today = new Date();
  const upcomingWorkshops = registrations.filter(reg => {
    // Since we're storing date as a string like "١٥ مايو ٢٠٢٥"
    // This is a simple approach - in a real app you'd use proper date parsing
    return reg.workshops?.date?.includes('٢٠٢٥');
  });
  
  const pastWorkshops = registrations.filter(reg => {
    return !reg.workshops?.date?.includes('٢٠٢٥');
  });

  // Check if a workshop has a certificate
  const hasCertificate = (workshopId: string) => {
    return certificates.some(cert => cert.workshop_id === workshopId);
  };

  return (
    <DashboardLayout title="الورش المسجلة" requireRole="subscriber">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="wirashna-loader"></div>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">الورش القادمة</TabsTrigger>
            <TabsTrigger value="past">الورش السابقة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingWorkshops.length > 0 ? (
              <div className="space-y-4">
                {upcomingWorkshops.map(registration => (
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
                        <div className="flex items-center">
                          <Clock size={16} className="ml-1" />
                          {registration.workshops?.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:mr-4 flex flex-row md:flex-col items-center md:items-end gap-2">
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">لا توجد ورش قادمة حالياً</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastWorkshops.length > 0 ? (
              <div className="space-y-4">
                {pastWorkshops.map(registration => (
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
                        <div className="flex items-center">
                          <CheckCircle size={16} className="ml-1" />
                          مكتملة
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:mr-4 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!hasCertificate(registration.workshop_id)}
                        className="text-wirashna-accent hover:text-wirashna-accent/90"
                      >
                        <Award size={16} className="ml-1" />
                        الشهادة
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">لا توجد ورش سابقة</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default SubscriberWorkshops;
