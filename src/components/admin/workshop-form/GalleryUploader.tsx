
import { useState } from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryUploaderProps {
  name: string;
  label: string;
  required?: boolean;
}

export const GalleryUploader = ({ name, label, required = false }: GalleryUploaderProps) => {
  const { setValue, watch } = useFormContext();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Get the current gallery value from the form
  const gallery = watch(name) || [];

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
      const fileName = `gallery-${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
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

      // Update the form value by adding the new image to the gallery
      const updatedGallery = [...gallery, publicUrl];
      setValue(name, updatedGallery, { shouldValidate: true, shouldDirty: true });

      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم إضافة الصورة إلى معرض الورشة",
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
    <div className="space-y-2">
      <label htmlFor={`${name}-upload`} className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {/* Display existing gallery images */}
        {gallery.map((imageUrl: string, index: number) => (
          <div key={index} className="relative">
            <img 
              src={imageUrl} 
              alt={`Gallery image ${index + 1}`} 
              className="w-full h-32 object-cover rounded-md border border-gray-300"
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
        
        {/* Add new image button */}
        <div 
          className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => document.getElementById(`${name}-upload`)?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
          ) : (
            <>
              <Plus className="h-8 w-8 text-gray-500 mb-2" />
              <span className="text-sm text-gray-500">إضافة صورة</span>
            </>
          )}
        </div>
      </div>
      
      <input
        id={`${name}-upload`}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*"
        disabled={isUploading}
      />
      
      {/* Hidden input to store gallery value */}
      <input type="hidden" name={name} />
    </div>
  );
};
