
import React from "react";
import { FormSection } from "./FormSection";

export const BasicInfoSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">المعلومات الأساسية</h3>
      
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
