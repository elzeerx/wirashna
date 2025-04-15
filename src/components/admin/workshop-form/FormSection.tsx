
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

interface FormSectionProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  isTextarea?: boolean;
  options?: { value: string; label: string }[];
}

export const FormSection = ({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  min,
  isTextarea = false,
  options = [],
}: FormSectionProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "select" ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : isTextarea ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                required={required}
                className="min-h-[100px]"
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
