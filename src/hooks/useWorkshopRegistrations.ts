
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserRegistrations } from "@/services/workshops";
import { fetchUserCertificates } from "@/services/certificateService";
import { WorkshopRegistration } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

export const useWorkshopRegistrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<(WorkshopRegistration & { workshops?: any })[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !user.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const [registrationsData, certificatesData] = await Promise.all([
          fetchUserRegistrations(user.id),
          fetchUserCertificates(user.id)
        ]);
        
        // Remove any duplicate registrations (same workshop_id)
        const uniqueRegistrations = Array.from(
          new Map(registrationsData.map(reg => [reg.workshop_id, reg])).values()
        );
        
        setRegistrations(uniqueRegistrations);
        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل بيانات الورش. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  const today = new Date();
  const upcomingWorkshops = registrations.filter(reg => 
    reg.workshops?.date?.includes('٢٠٢٥')
  );
  
  const pastWorkshops = registrations.filter(reg => 
    !reg.workshops?.date?.includes('٢٠٢٥')
  );

  const hasCertificate = (workshopId: string) => {
    return certificates.some(cert => cert.workshop_id === workshopId);
  };

  return {
    isLoading,
    upcomingWorkshops,
    pastWorkshops,
    hasCertificate
  };
};
