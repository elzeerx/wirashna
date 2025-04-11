
import React from "react";
import { FormSection } from "./FormSection";

export const LocationSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormSection
        name="venue"
        label="المدينة"
        placeholder="مثال: الكويت، دبي، الرياض"
        required
      />

      <FormSection
        name="location"
        label="العنوان التفصيلي"
        placeholder="مثال: فندق الشيراتون، قاعة الفردوس"
        required
      />
    </div>
  );
};
