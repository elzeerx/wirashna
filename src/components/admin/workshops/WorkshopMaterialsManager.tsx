
import React, { useState, useEffect } from "react";
import { Plus, FileText, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkshopMaterial } from "@/types/supabase";
import { fetchWorkshopMaterials, addWorkshopMaterial, deleteWorkshopMaterial } from "@/services/materialService";

interface WorkshopMaterialsManagerProps {
  workshopId: string;
}

const WorkshopMaterialsManager = ({ workshopId }: WorkshopMaterialsManagerProps) => {
  const [materials, setMaterials] = useState<WorkshopMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMaterials();
  }, [workshopId]);

  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      const workshopMaterials = await fetchWorkshopMaterials(workshopId);
      setMaterials(workshopMaterials);
    } catch (error) {
      console.error("Error loading materials:", error);
      toast({
        title: "خطأ في تحميل المواد",
        description: "حدث خطأ أثناء تحميل المواد التعليمية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadMaterial = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "خطأ في الملف",
        description: "الرجاء اختيار ملف للرفع",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `materials/${workshopId}/${fileName}`;
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('workshop-materials')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('workshop-materials')
        .getPublicUrl(filePath);

      // Add material to database
      const newMaterial: Omit<WorkshopMaterial, 'id' | 'created_at'> = {
        workshop_id: workshopId,
        title: materialTitle,
        description: materialDescription || undefined,
        file_url: publicUrl
      };

      await addWorkshopMaterial(newMaterial);
      
      // Reset form and close dialog
      setMaterialTitle("");
      setMaterialDescription("");
      setSelectedFile(null);
      setIsAddDialogOpen(false);
      
      // Reload materials
      await loadMaterials();
      
      toast({
        title: "تم إضافة المادة بنجاح",
        description: "تمت إضافة المادة التعليمية بنجاح",
      });
    } catch (error) {
      console.error("Error uploading material:", error);
      toast({
        title: "خطأ في رفع المادة",
        description: "حدث خطأ أثناء رفع المادة التعليمية",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      await deleteWorkshopMaterial(materialId);
      await loadMaterials();
      
      toast({
        title: "تم حذف المادة بنجاح",
        description: "تمت إزالة المادة التعليمية بنجاح",
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "خطأ في حذف المادة",
        description: "حدث خطأ أثناء حذف المادة التعليمية",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">المواد التعليمية</h3>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center"
        >
          <Plus className="ml-2 h-4 w-4" />
          إضافة مادة
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="ml-4 p-2 bg-gray-100 rounded-lg">
                    {getFileIcon(material.file_url)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{material.title}</h3>
                    {material.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {material.description}
                      </p>
                    )}
                    <div className="flex mt-2 space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(material.file_url, '_blank')}
                      >
                        عرض الملف
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <Trash2 className="ml-1 h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">لا توجد مواد تعليمية لهذه الورشة</p>
          <p className="text-sm text-gray-500 mt-2">
            يمكنك إضافة مواد تعليمية مثل ملفات PDF والعروض التقديمية والمستندات
          </p>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة مادة تعليمية</DialogTitle>
            <DialogDescription>
              أضف مادة تعليمية جديدة للورشة. يمكن رفع ملفات PDF أو مستندات Word أو عروض تقديمية.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadMaterial}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان المادة</Label>
                <Input
                  id="title"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="أدخل عنوان المادة"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">وصف المادة (اختياري)</Label>
                <Textarea
                  id="description"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  placeholder="أدخل وصف للمادة"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="file">الملف</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 mt-2">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>اختر ملف</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          onChange={handleFileSelect}
                          required
                        />
                      </label>
                      <p className="pr-1">أو اسحب وأفلت</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, Word, PowerPoint, Excel
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        تم اختيار: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isUploading}
              >
                إلغاء
              </Button>
              <Button 
                type="submit"
                disabled={!materialTitle || !selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  <>رفع المادة</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkshopMaterialsManager;
