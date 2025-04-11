
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface FormSectionProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  isTextarea?: boolean;
}

export const FormSection = ({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  min,
  isTextarea = false,
}: FormSectionProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isTextarea ? (
              <textarea
                {...field}
                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                required={required}
              />
            ) : (
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                required={required}
                min={min}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
