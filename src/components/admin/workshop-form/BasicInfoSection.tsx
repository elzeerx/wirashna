import React from "react";
import { FormSection } from "./FormSection";
import { ImageUploader } from "./ImageUploader";
import { useFormContext } from "react-hook-form";
import { useWorkshopForm } from "@/hooks/useWorkshopForm";
import { BUCKETS } from "@/integrations/supabase/storage";

export const BasicInfoSection = () => {
  const { coverImage, setCoverImage } = useWorkshopForm();
  const { setValue, watch } = useFormContext();
  const currentCoverImage = watch("cover_image");

  // Sync coverImage with form value if they get out of sync
  React.useEffect(() => {
    if (currentCoverImage !== coverImage) {
      setCoverImage(currentCoverImage);
    }
  }, [currentCoverImage, coverImage, setCoverImage]);

  const handleImageUploaded = (url: string) => {
    console.log("Cover image uploaded:", url);
    setValue("cover_image", url, { shouldValidate: true, shouldDirty: true });
    setCoverImage(url);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">المعلومات الأساسية</h3>
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">صورة الغلاف</h4>
        <ImageUploader
          name="cover_image"
          label="صورة الغلاف"
          required={true}
          initialImageUrl={coverImage || undefined}
          bucketType="WORKSHOP_COVERS"
          onImageUploaded={handleImageUploaded}
        />
      </div>
      
      <FormSection
        name="title"
        label="عنوان الورشة"
        placeholder="أدخل عنوان الورشة"
        required
      />

      <FormSection
        name="short_description"
        label="وصف مختصر"
        placeholder="وصف مختصر للورشة"
        required
      />

      <FormSection
        name="long_description"
        label="وصف مفصل"
        placeholder="وصف مفصل للورشة"
        required
        isTextarea
      />
    </div>
  );
};
