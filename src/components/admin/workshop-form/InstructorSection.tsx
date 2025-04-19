import React from "react";
import { FormSection } from "./FormSection";
import { ImageUploader } from "./ImageUploader";
import { useFormContext } from "react-hook-form";
import { useWorkshopForm } from "@/hooks/useWorkshopForm";

export const InstructorSection = () => {
  const { instructorImage, setInstructorImage } = useWorkshopForm();
  const { setValue, watch } = useFormContext();
  const currentInstructorImage = watch("instructor_image");

  React.useEffect(() => {
    if (currentInstructorImage !== instructorImage) {
      setInstructorImage(currentInstructorImage);
    }
  }, [currentInstructorImage, instructorImage, setInstructorImage]);

  const handleImageUploaded = (url: string) => {
    console.log("Instructor image uploaded:", url);
    setValue("instructor_image", url, { shouldValidate: true, shouldDirty: true });
    setInstructorImage(url);
  };

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

        <div>
          <h4 className="text-md font-medium mb-2">صورة المدرب</h4>
          <ImageUploader 
            name="instructor_image"
            label="صورة المدرب"
            required
            prefix="instructors"
            initialImageUrl={instructorImage || undefined}
            onImageUploaded={handleImageUploaded}
          />
        </div>
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
