
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { workshopObjectives, targetAudience } from "@/data/workshopSections";

export const ObjectivesTargetSection = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">أهداف الورشة والفئة المستهدفة</h3>
      
      <FormField
        control={form.control}
        name="objectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>أهداف الورشة</FormLabel>
            <FormControl>
              <Textarea
                placeholder="أدخل أهداف الورشة (سطر لكل هدف)"
                className="h-32 rtl"
                {...field}
                value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''}
                onChange={(e) => {
                  const objectivesArray = e.target.value
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                  field.onChange(objectivesArray);
                }}
              />
            </FormControl>
            <div className="text-sm text-muted-foreground mt-1">
              <details>
                <summary className="cursor-pointer hover:text-primary">أمثلة على أهداف الورشة</summary>
                <ul className="list-disc mr-6 mt-2 space-y-1">
                  {workshopObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </details>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="target_audience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الفئة المستهدفة</FormLabel>
            <FormControl>
              <Textarea
                placeholder="أدخل الفئات المستهدفة (سطر لكل فئة)"
                className="h-32 rtl"
                {...field}
                value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''}
                onChange={(e) => {
                  const audienceArray = e.target.value
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                  field.onChange(audienceArray);
                }}
              />
            </FormControl>
            <div className="text-sm text-muted-foreground mt-1">
              <details>
                <summary className="cursor-pointer hover:text-primary">أمثلة على الفئات المستهدفة</summary>
                <ul className="list-disc mr-6 mt-2 space-y-1">
                  {targetAudience.map((audience, index) => (
                    <li key={index}>{audience}</li>
                  ))}
                </ul>
              </details>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
