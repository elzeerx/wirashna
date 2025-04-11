
import { supabase } from "@/integrations/supabase/client";
import { WorkshopCertificate } from "@/types/supabase";

export const fetchUserCertificates = async (userId: string): Promise<WorkshopCertificate[]> => {
  const { data, error } = await supabase
    .from('workshop_certificates')
    .select(`
      *,
      workshops:workshop_id (title, date, instructor)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user certificates:", error);
    throw error;
  }

  return data || [];
};

export const generateCertificate = async (workshopId: string, userId: string): Promise<WorkshopCertificate> => {
  // In a real application, you would generate a certificate URL here
  // For now, we'll just use a placeholder URL
  const certificateUrl = `https://example.com/certificates/${workshopId}_${userId}.pdf`;
  
  const { data, error } = await supabase
    .from('workshop_certificates')
    .upsert({ 
      workshop_id: workshopId, 
      user_id: userId,
      certificate_url: certificateUrl
    })
    .select()
    .single();

  if (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }

  return data;
};

export const deleteCertificate = async (certificateId: string): Promise<void> => {
  const { error } = await supabase
    .from('workshop_certificates')
    .delete()
    .eq('id', certificateId);

  if (error) {
    console.error(`Error deleting certificate ${certificateId}:`, error);
    throw error;
  }
};
