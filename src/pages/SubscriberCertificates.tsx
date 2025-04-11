
import { useState, useEffect } from "react";
import { Download, Eye } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserCertificates } from "@/services/certificateService";
import { WorkshopCertificate } from "@/types/supabase";

const SubscriberCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<(WorkshopCertificate & { workshop?: any })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewCertificate, setPreviewCertificate] = useState<string | null>(null);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await fetchUserCertificates(user.id);
        setCertificates(data);
      } catch (error) {
        console.error("Error loading certificates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificates();
  }, [user]);

  return (
    <DashboardLayout title="الشهادات" requireRole="subscriber">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="wirashna-loader"></div>
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden">
              <div className="h-48 bg-wirashna-primary/10 flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Certificate" 
                  className="h-32 w-auto"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">
                  {certificate.workshop?.title || "شهادة ورشة"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {certificate.workshop?.date || "تاريخ الورشة"}
                </p>
                <div className="flex space-x-2 space-x-reverse">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-wirashna-accent hover:text-wirashna-accent/90 ml-2"
                    onClick={() => setPreviewCertificate(certificate.certificate_url || null)}
                  >
                    <Eye size={16} className="ml-1" />
                    معاينة
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (certificate.certificate_url) {
                        window.open(certificate.certificate_url, '_blank');
                      }
                    }}
                  >
                    <Download size={16} className="ml-1" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">لا توجد شهادات متاحة حالياً</p>
          <p className="text-sm text-gray-500">
            سيتم إضافة الشهادات عند إكمال الورش بنجاح
          </p>
        </div>
      )}

      <Dialog open={!!previewCertificate} onOpenChange={() => setPreviewCertificate(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>معاينة الشهادة</DialogTitle>
          <div className="aspect-[1.4/1] bg-gray-100 rounded-lg overflow-hidden">
            {previewCertificate ? (
              <img 
                src="/placeholder.svg" 
                alt="Certificate Preview" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>لا توجد معاينة متاحة</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SubscriberCertificates;
