
import React from "react";
import { FormSection } from "./FormSection";

export const CapacityPriceSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormSection
        name="availableSeats"
        label="المقاعد المتاحة"
        type="number"
        min="0"
        required
      />

      <FormSection
        name="totalSeats"
        label="إجمالي المقاعد"
        type="number"
        min="0"
        required
      />

      <FormSection
        name="price"
        label="السعر"
        placeholder="مثال: ١٢٠ دينار كويتي"
        required
      />
    </div>
  );
};
