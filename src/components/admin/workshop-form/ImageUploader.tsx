
import { useState, useEffect } from "react";
import { Upload, X, Loader2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BUCKETS, getRandomFileName, getStoragePath } from "@/integrations/supabase/storage";

interface ImageUploaderProps {
  name: string;
  label: string;
  required?: boolean;
  initialImageUrl?: string;
  bucketType: keyof typeof BUCKETS;
  onImageUploaded?: (url: string) => void;
}

export const ImageUploader = ({ 
  name, 
  label, 
  required = false, 
  initialImageUrl,
  bucketType,
  onImageUploaded 
}: ImageUploaderProps) => {
  const { register, setValue, watch } = useFormContext();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [storedImages, setStoredImages] = useState<string[]>([]);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  
  const currentValue = watch(name);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  
  useEffect(() => {
    // Fetch stored images from the specified bucket
    const fetchStoredImages = async () => {
      const { data, error } = await supabase.storage
        .from(BUCKETS[bucketType])
        .list();
      
      if (error) {
        console.error("Error fetching stored images:", error);
        return;
      }

      const publicUrls = data.map(file => 
        supabase.storage.from(BUCKETS[bucketType]).getPublicUrl(file.name).data.publicUrl
      );
      
      setStoredImages(publicUrls);
    };

    fetchStoredImages();
  }, [bucketType]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ في رفع الملف",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ في رفع الملف",
        description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop() || '';
      const fileName = getRandomFileName(fileExt);
      const bucketId = BUCKETS[bucketType];
      const filePath = getStoragePath(bucketType.toLowerCase().replace('_', '-'), fileName);
      
      const { data, error } = await supabase.storage
        .from(bucketId)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      setValue(name, publicUrl, { shouldValidate: true, shouldDirty: true });
      
      if (onImageUploaded) {
        onImageUploaded(publicUrl);
      }

      // Update stored images list
      setStoredImages(prev => [...prev, publicUrl]);

      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم رفع الصورة وإضافتها إلى المخزن",
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "خطأ في رفع الملف",
        description: error.message || "حدث خطأ أثناء رفع الصورة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFromStorage = (selectedImage: string) => {
    setImageUrl(selectedImage);
    setValue(name, selectedImage, { shouldValidate: true, shouldDirty: true });
    
    if (onImageUploaded) {
      onImageUploaded(selectedImage);
    }

    setIsStorageDialogOpen(false);
  };

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    if (onImageUploaded) {
      onImageUploaded("");
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="mt-1 flex flex-col items-center space-y-4">
        {imageUrl ? (
          <div className="relative w-full">
            <img 
              src={imageUrl} 
              alt={label} 
              className="w-full h-40 object-cover rounded-md border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500">اضغط للاختيار أو اسحب الصورة هنا</span>
              </>
            )}
          </div>
        )}
        
        <div className="flex space-x-2 w-full">
          <input
            id={name}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*"
            disabled={isUploading}
          />
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById(name)?.click()}
            className="flex-1"
            disabled={isUploading}
          >
            <Upload size={16} className="ml-2" />
            رفع صورة
          </Button>

          <Dialog open={isStorageDialogOpen} onOpenChange={setIsStorageDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                disabled={isUploading || storedImages.length === 0}
              >
                <Folder size={16} className="ml-2" />
                اختر من المخزن
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>اختر صورة من المخزن</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                {storedImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => handleSelectFromStorage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Stored Image ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              {storedImages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  لا توجد صور في المخزن
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <input 
          type="hidden" 
          {...register(name, { required })} 
          value={imageUrl || ""}
        />
      </div>
    </div>
  );
};
