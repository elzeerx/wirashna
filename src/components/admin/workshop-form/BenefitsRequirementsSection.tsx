
import React from "react";
import { FormSection } from "./FormSection";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export const BenefitsRequirementsSection = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">مميزات ومتطلبات الورشة</h3>
      
      <FormField
        control={form.control}
        name="benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>مميزات الورشة</FormLabel>
            <FormControl>
              <Textarea
                placeholder="أدخل مميزات الورشة (سطر لكل ميزة)"
                className="h-32"
                {...field}
                value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''}
                onChange={(e) => {
                  const benefitsArray = e.target.value
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                  field.onChange(benefitsArray);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>متطلبات الورشة</FormLabel>
            <FormControl>
              <Textarea
                placeholder="أدخل متطلبات الورشة (سطر لكل متطلب)"
                className="h-32"
                {...field}
                value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''}
                onChange={(e) => {
                  const requirementsArray = e.target.value
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                  field.onChange(requirementsArray);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
