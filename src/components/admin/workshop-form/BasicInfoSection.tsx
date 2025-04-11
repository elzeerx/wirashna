
import React from "react";
import { FormSection } from "./FormSection";

export const BasicInfoSection = () => {
  return (
    <>
      <FormSection
        name="title"
        label="عنوان الورشة"
        placeholder="أدخل عنوان الورشة"
        required
      />

      <FormSection
        name="description"
        label="وصف مختصر"
        placeholder="وصف مختصر للورشة"
        required
      />

      <FormSection
        name="longDescription"
        label="وصف مفصل"
        placeholder="وصف مفصل للورشة"
        required
        isTextarea
      />
    </>
  );
};
