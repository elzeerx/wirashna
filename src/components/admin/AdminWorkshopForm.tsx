
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm, FormProvider } from "react-hook-form";
import { BasicInfoSection } from "./workshop-form/BasicInfoSection";
import { DateTimeSection } from "./workshop-form/DateTimeSection";
import { LocationSection } from "./workshop-form/LocationSection";
import { CapacityPriceSection } from "./workshop-form/CapacityPriceSection";
import { InstructorSection } from "./workshop-form/InstructorSection";
import { ImageUploader } from "./workshop-form/ImageUploader";

interface AdminWorkshopFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AdminWorkshopForm = ({ initialData, onSubmit, onCancel }: AdminWorkshopFormProps) => {
  const isEditMode = !!initialData;
  
  // Initialize form with default values or initial data
  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      short_description: initialData?.short_description || "",
      long_description: initialData?.long_description || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      venue: initialData?.venue || "",
      location: initialData?.location || "",
      available_seats: initialData?.available_seats || 0,
      total_seats: initialData?.total_seats || 0,
      price: initialData?.price || 0,
      instructor: initialData?.instructor || "",
      instructor_bio: initialData?.instructor_bio || "",
      image: initialData?.image || "",
      benefits: initialData?.benefits || [],
      requirements: initialData?.requirements || [],
    },
  });

  const handleSubmit = (data: any) => {
    // If in edit mode, preserve the ID
    if (isEditMode) {
      data.id = initialData.id;
    }
    
    // Convert numeric string inputs to numbers
    data.available_seats = Number(data.available_seats);
    data.total_seats = Number(data.total_seats);
    data.price = Number(data.price);
    
    // Add default gallery if not provided
    if (!data.gallery) {
      data.gallery = data.image ? [data.image] : [];
    }
    
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoSection />
        <DateTimeSection />
        <LocationSection />
        <CapacityPriceSection />
        <InstructorSection />

        <div className="flex justify-end space-x-2 space-x-reverse pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit" className="bg-[#512b81] hover:bg-[#512b81]/90">
            {isEditMode ? "حفظ التغييرات" : "إضافة الورشة"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AdminWorkshopForm;
