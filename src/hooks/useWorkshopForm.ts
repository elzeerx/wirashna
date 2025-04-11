
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Workshop } from "@/types/supabase";

interface UseWorkshopFormProps {
  initialData?: Partial<Workshop>;
  onSubmit: (data: any) => void;
}

export const useWorkshopForm = ({ initialData, onSubmit }: UseWorkshopFormProps) => {
  const isEditMode = !!initialData?.id;
  
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
      data.id = initialData?.id;
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

  return {
    form,
    isEditMode,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
