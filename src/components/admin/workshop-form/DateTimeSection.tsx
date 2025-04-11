
import React from "react";
import { FormSection } from "./FormSection";

export const DateTimeSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormSection
        name="date"
        label="التاريخ"
        placeholder="مثال: ١٥ مايو ٢٠٢٥"
        required
      />

      <FormSection
        name="time"
        label="الوقت"
        placeholder="مثال: ٥:٠٠ مساءًا"
        required
      />
    </div>
  );
};
