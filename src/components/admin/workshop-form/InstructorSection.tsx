
import React from "react";
import { FormSection } from "./FormSection";
import { ImageUploader } from "./ImageUploader";
import { useFormContext } from "react-hook-form";

export const InstructorSection = () => {
  const { watch } = useFormContext();
  const imageUrl = watch("image");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">معلومات المدرب</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSection
          name="instructor"
          label="اسم المدرب"
          placeholder="اسم المدرب"
          required
        />

        <ImageUploader 
          name="image"
          label="الصورة الرئيسية"
          required
          initialImageUrl={imageUrl}
        />
      </div>

      <FormSection
        name="instructor_bio"
        label="نبذة عن المدرب"
        placeholder="نبذة عن المدرب"
        required
        isTextarea
      />
    </div>
  );
};
