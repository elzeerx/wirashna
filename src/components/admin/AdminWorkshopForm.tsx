
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm, FormProvider } from "react-hook-form";
import { BasicInfoSection } from "./workshop-form/BasicInfoSection";
import { DateTimeSection } from "./workshop-form/DateTimeSection";
import { LocationSection } from "./workshop-form/LocationSection";
import { CapacityPriceSection } from "./workshop-form/CapacityPriceSection";
import { InstructorSection } from "./workshop-form/InstructorSection";

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
      description: initialData?.description || "",
      longDescription: initialData?.longDescription || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      venue: initialData?.venue || "",
      location: initialData?.location || "",
      availableSeats: initialData?.availableSeats || 0,
      totalSeats: initialData?.totalSeats || 0,
      price: initialData?.price || "",
      instructor: initialData?.instructor || "",
      instructorBio: initialData?.instructorBio || "",
      image: initialData?.image || "",
    },
  });

  const handleSubmit = (data: any) => {
    // If in edit mode, preserve the ID
    if (isEditMode) {
      data.id = initialData.id;
    } else {
      // For new workshops, generate a dummy ID (in a real app, the backend would do this)
      data.id = Date.now().toString();
    }
    
    // Convert numeric string inputs to numbers
    data.availableSeats = Number(data.availableSeats);
    data.totalSeats = Number(data.totalSeats);
    
    // Add default gallery if not provided
    if (!data.gallery) {
      data.gallery = [data.image];
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
