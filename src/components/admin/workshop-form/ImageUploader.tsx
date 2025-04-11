
import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  name: string;
  label: string;
  required?: boolean;
  initialImageUrl?: string;
}

export const ImageUploader = ({ name, label, required = false, initialImageUrl }: ImageUploaderProps) => {
  const { register, setValue, watch } = useFormContext();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Get the current value from the form
  const currentValue = watch(name);
  const imageUrl = currentValue || initialImageUrl;

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
      setUploadProgress(0);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Create a new XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('workshop-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      // Update progress manually using the xhr.upload.addEventListener
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('workshop-images')
        .getPublicUrl(filePath);

      // Update the form value
      setValue(name, publicUrl, { shouldValidate: true, shouldDirty: true });

      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم رفع الصورة وإضافتها إلى الورشة",
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

  // Remove the current image
  const handleRemoveImage = () => {
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
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
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500">اضغط للاختيار أو اسحب الصورة هنا</span>
              </>
            )}
          </div>
        )}
        
        <input
          id={name}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*"
          disabled={isUploading}
          {...register(name, { required })}
        />
        
        {!isUploading && !imageUrl && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById(name)?.click()}
            className="w-full"
          >
            <Upload size={16} className="ml-2" />
            اختر صورة
          </Button>
        )}

        {imageUrl && (
          <input type="hidden" {...register(name, { required })} />
        )}
      </div>
    </div>
  );
};
