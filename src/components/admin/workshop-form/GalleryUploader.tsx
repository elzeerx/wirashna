
import { useState } from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryUploaderProps {
  name: string;
  label: string;
}

export const GalleryUploader = ({ name, label }: GalleryUploaderProps) => {
  const { register, setValue, watch } = useFormContext();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Get the current value from the form
  const gallery = watch(name) as string[] || [];

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ في رفع الملف",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
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

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('workshop-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('workshop-images')
        .getPublicUrl(filePath);

      // Add the new image URL to the gallery array
      const updatedGallery = [...gallery, publicUrl];
      setValue(name, updatedGallery, { shouldValidate: true, shouldDirty: true });

      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم إضافة الصورة إلى معرض الصور",
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

  // Remove an image from the gallery
  const handleRemoveImage = (index: number) => {
    const updatedGallery = [...gallery];
    updatedGallery.splice(index, 1);
    setValue(name, updatedGallery, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">{label}</label>
        <input
          id={`${name}-input`}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*"
          disabled={isUploading}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => document.getElementById(`${name}-input`)?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          ) : (
            <Plus size={16} className="ml-2" />
          )}
          إضافة صورة
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((imageUrl, index) => (
          <div key={index} className="relative h-40 rounded-md overflow-hidden border border-gray-300">
            <img 
              src={imageUrl} 
              alt={`Gallery ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {gallery.length === 0 && (
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm">
            لا توجد صور في المعرض
          </div>
        )}
      </div>
      
      <input 
        type="hidden" 
        {...register(name)}
      />
    </div>
  );
};
