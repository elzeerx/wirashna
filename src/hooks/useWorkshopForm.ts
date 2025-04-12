
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Workshop } from "@/types/supabase";

interface UseWorkshopFormProps {
  initialData?: Partial<Workshop>;
  onSubmit: (data: any) => void;
}

export const useWorkshopForm = (props?: Partial<UseWorkshopFormProps>) => {
  const initialData = props?.initialData || {};
  const onSubmit = props?.onSubmit || (() => {});
  
  const isEditMode = !!initialData?.id;
  
  // Store images in state for caching
  const [instructorImage, setInstructorImage] = useState<string | null>(
    initialData?.instructor_image || null
  );
  
  const [coverImage, setCoverImage] = useState<string | null>(
    initialData?.cover_image || null
  );
  
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
      instructor_image: initialData?.instructor_image || "",
      cover_image: initialData?.cover_image || "",
      gallery: initialData?.gallery || [],
      benefits: initialData?.benefits || [],
      requirements: initialData?.requirements || [],
    },
  });

  const handleSubmit = (data: any) => {
    console.log("Form submit data before processing:", data);
    
    // If in edit mode, preserve the ID
    if (isEditMode) {
      data.id = initialData?.id;
    }
    
    // Convert numeric string inputs to numbers
    data.available_seats = Number(data.available_seats);
    data.total_seats = Number(data.total_seats);
    data.price = Number(data.price);
    
    // Make sure image URLs from state are included in submission
    // This ensures they don't get lost if the form state doesn't have them
    if (coverImage && !data.cover_image) {
      data.cover_image = coverImage;
    }
    
    if (instructorImage && !data.instructor_image) {
      data.instructor_image = instructorImage;
    }
    
    // Add default gallery if not provided
    if (!data.gallery || data.gallery.length === 0) {
      data.gallery = data.cover_image ? [data.cover_image] : [];
    }
    
    console.log("Final form data to submit:", data);
    onSubmit(data);
  };

  // Sync images with form values if needed
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'cover_image' && value.cover_image !== coverImage) {
        setCoverImage(value.cover_image || null);
      }
      if (name === 'instructor_image' && value.instructor_image !== instructorImage) {
        setInstructorImage(value.instructor_image || null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, coverImage, instructorImage]);

  return {
    form,
    isEditMode,
    instructorImage,
    setInstructorImage,
    coverImage,
    setCoverImage,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
