
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { BasicInfoSection } from "./workshop-form/BasicInfoSection";
import { DateTimeSection } from "./workshop-form/DateTimeSection";
import { LocationSection } from "./workshop-form/LocationSection";
import { CapacityPriceSection } from "./workshop-form/CapacityPriceSection";
import { InstructorSection } from "./workshop-form/InstructorSection";
import { BenefitsRequirementsSection } from "./workshop-form/BenefitsRequirementsSection";
import { ObjectivesTargetSection } from "./workshop-form/ObjectivesTargetSection";
import { GalleryUploader } from "./workshop-form/GalleryUploader";
import { useWorkshopForm } from "@/hooks/useWorkshopForm";
import { Workshop } from "@/types/supabase";
import { Loader2 } from "lucide-react";

interface AdminWorkshopFormProps {
  initialData?: Partial<Workshop>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AdminWorkshopForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}: AdminWorkshopFormProps) => {
  console.log("AdminWorkshopForm initialData:", initialData);
  
  const formContext = useWorkshopForm({
    initialData,
    onSubmit: (data: any) => {
      console.log("AdminWorkshopForm - data to submit:", data);
      onSubmit(data);
    },
  });

  const { form, handleSubmit, isEditMode } = formContext;

  // Log when initialData changes
  useEffect(() => {
    console.log("Workshop form initialData changed:", initialData);
  }, [initialData]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInfoSection />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">معرض الصور</h3>
          <GalleryUploader name="gallery" label="صور إضافية" />
        </div>
        
        <DateTimeSection />
        <LocationSection />
        <CapacityPriceSection />
        <ObjectivesTargetSection />
        <BenefitsRequirementsSection />
        <InstructorSection />

        <div className="flex justify-end space-x-2 space-x-reverse pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button 
            type="submit" 
            className="bg-[#512b81] hover:bg-[#512b81]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              isEditMode ? "حفظ التغييرات" : "إضافة الورشة"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AdminWorkshopForm;
