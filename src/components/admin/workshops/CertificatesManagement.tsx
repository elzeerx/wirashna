
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Trash2, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  fetchCertificates, 
  addCertificate, 
  deleteCertificate 
} from "@/services/workshops/registrationManagement";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CertificatesManagementProps {
  workshopId: string;
}

const CertificatesManagement = ({ workshopId }: CertificatesManagementProps) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Fetch certificates for this workshop
  const { 
    data: certificates = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["certificates", workshopId],
    queryFn: async () => {
      const data = await fetchCertificates({ workshopId });
      return data;
    }
  });

  // Fetch registrations for this workshop to show users without certificates
  const { 
    data: registrations = [] 
  } = useQuery({
    queryKey: ["registrations_for_certificates", workshopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select('*, user_profiles:user_id(*)')
        .eq('workshop_id', workshopId)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Find users who have paid for the workshop but don't have certificates yet
  const usersWithoutCertificates = registrations.filter(reg => {
    return !certificates.some(cert => cert.user_id === reg.user_id);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadCertificate = async () => {
    if (!selectedUserId || !selectedFile) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار مستخدم وملف للرفع",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${workshopId}_${selectedUserId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('workshop-certificates')
        .upload(filePath, selectedFile, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('workshop-certificates')
        .getPublicUrl(filePath);

      // Save certificate info to database
      await addCertificate(
        workshopId,
        selectedUserId,
        publicUrlData.publicUrl
      );

      // Success
      toast({
        title: "تم بنجاح",
        description: "تم رفع الشهادة بنجاح",
      });

      // Close dialog and refresh data
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setSelectedUserId(null);
      refetch();

    } catch (error) {
      console.error("Error uploading certificate:", error);
      toast({
        title: "خطأ في رفع الشهادة",
        description: "حدث خطأ أثناء رفع الشهادة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (certificate: any) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCertificate) return;

    try {
      // Extract filename from URL
      const url = new URL(selectedCertificate.certificate_url);
      const filePath = url.pathname.split('/').pop();

      // Delete from storage
      if (filePath) {
        await supabase.storage
          .from('workshop-certificates')
          .remove([filePath]);
      }

      // Delete from database
      await deleteCertificate(selectedCertificate.id);

      toast({
        title: "تم بنجاح",
        description: "تم حذف الشهادة بنجاح",
      });

      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast({
        title: "خطأ في حذف الشهادة",
        description: "حدث خطأ أثناء حذف الشهادة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>شهادات المشاركين</span>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="ml-2 h-4 w-4" /> رفع شهادة جديدة
          </Button>
        </CardTitle>
        <CardDescription>
          إدارة شهادات المشاركين في الورشة
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="wirashna-loader"></div>
          </div>
        ) : certificates.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المشارك</TableHead>
                <TableHead>تاريخ الإصدار</TableHead>
                <TableHead>الشهادة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>
                    {certificate.registrations?.full_name || "غير محدد"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(certificate.issue_date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <a
                      href={certificate.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      عرض الشهادة
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(certificate)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            لا توجد شهادات مسجلة لهذه الورشة بعد
          </div>
        )}

        {usersWithoutCertificates.length > 0 && (
          <Alert className="mt-6 bg-amber-50 text-amber-800 border-amber-200">
            <AlertDescription>
              يوجد {usersWithoutCertificates.length} مشارك لم يتم رفع شهادة لهم بعد
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Certificate Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>رفع شهادة جديدة</DialogTitle>
              <DialogDescription>
                قم باختيار المشارك وملف الشهادة للرفع
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user">المشارك</Label>
                <select
                  id="user"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedUserId || ""}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">اختر المشارك</option>
                  {usersWithoutCertificates.map((reg) => (
                    <option key={reg.id} value={reg.user_id}>
                      {reg.full_name} ({reg.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate">ملف الشهادة</Label>
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500">
                  يمكنك رفع ملفات بصيغة PDF أو JPG أو PNG
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-center">{Math.round(uploadProgress)}%</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
                disabled={isUploading}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleUploadCertificate}
                disabled={!selectedUserId || !selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  "رفع الشهادة"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف الشهادة</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رغبتك في حذف هذه الشهادة؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default CertificatesManagement;
