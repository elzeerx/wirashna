import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Workshop } from "@/types/supabase";
import { WorkshopFormData } from "@/types/workshop";

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
  const form = useForm<WorkshopFormData>({
    defaultValues: {
      title: initialData?.title || "",
      short_description: initialData?.short_description || "",
      long_description: initialData?.long_description || "",
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
      objectives: initialData?.objectives || [],
      target_audience: initialData?.target_audience || [],
      tempDate: null,
      tempTime: "",
      duration: "1",
      sessionDuration: initialData?.session_duration?.toString() || "1",
      dates: [],
    },
  });

  const handleSubmit = (data: WorkshopFormData) => {
    console.log("Form submit data before processing:", data);
    
    // If in edit mode, preserve the ID
    if (isEditMode) {
      data.id = initialData?.id;
    }
    
    // Convert numeric string inputs to numbers
    data.available_seats = Number(data.available_seats);
    data.total_seats = Number(data.total_seats);
    data.price = Number(data.price);
    data.session_duration = Number(data.sessionDuration);
    
    // Make sure image URLs from state are included in submission
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

    // Clean up temporary date selection fields
    const { tempDate, tempTime, sessionDuration, duration, ...cleanedData } = data;
    
    console.log("Final form data to submit:", cleanedData);
    onSubmit(cleanedData);
  };

  // Sync images with form values if needed
  useEffect(() => {
    const subscription = form.watch((value: any, { name }: { name?: string }) => {
      if (name === 'cover_image' && value.cover_image !== coverImage) {
        setCoverImage(value.cover_image || null);
      }
      if (name === 'instructor_image' && value.instructor_image !== instructorImage) {
        setInstructorImage(value.instructor_image || null);
      }
    });
    
    return () => {
      if (subscription && typeof subscription === 'function') {
        subscription();
      }
    };
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
