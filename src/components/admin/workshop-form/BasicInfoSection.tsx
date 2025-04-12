
import React from "react";
import { FormSection } from "./FormSection";
import { ImageUploader } from "./ImageUploader";
import { useFormContext } from "react-hook-form";
import { useWorkshopForm } from "@/hooks/useWorkshopForm";

export const BasicInfoSection = () => {
  const { coverImage, setCoverImage } = useWorkshopForm({} as any);
  const { setValue } = useFormContext();

  const handleImageUploaded = (url: string) => {
    setValue("image", url, { shouldValidate: true });
    setCoverImage(url);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">المعلومات الأساسية</h3>
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">صورة الغلاف</h4>
        <ImageUploader
          name="image"
          label="صورة الغلاف"
          required={true}
          initialImageUrl={coverImage || undefined}
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
