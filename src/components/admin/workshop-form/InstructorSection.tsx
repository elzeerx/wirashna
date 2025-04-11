
import React from "react";
import { FormSection } from "./FormSection";

export const InstructorSection = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSection
          name="instructor"
          label="اسم المدرب"
          placeholder="اسم المدرب"
          required
        />

        <FormSection
          name="image"
          label="رابط الصورة الرئيسية"
          placeholder="أدخل رابط الصورة"
          required
        />
      </div>

      <FormSection
        name="instructorBio"
        label="نبذة عن المدرب"
        placeholder="نبذة عن المدرب"
        required
        isTextarea
      />
    </>
  );
};
