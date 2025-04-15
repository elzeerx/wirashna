
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserRegistrations, fetchUserCertificates } from "@/services/workshopService";
import { WorkshopRegistration } from "@/types/supabase";

export const useWorkshopRegistrations = () => {
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
