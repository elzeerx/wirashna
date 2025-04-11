
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Workshop } from "@/types/supabase";
import { createWorkshop, updateWorkshop, deleteWorkshop, fetchWorkshops } from "@/services/workshopService";

interface UseWorkshopOperationsProps {
  onWorkshopsUpdated: (workshops: Workshop[]) => void;
}

export const useWorkshopOperations = ({ onWorkshopsUpdated }: UseWorkshopOperationsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async (workshopData: any) => {
    setIsLoading(true);
    try {
      console.log("Creating workshop:", workshopData);
      await createWorkshop({
        ...workshopData,
        available_seats: workshopData.total_seats,
      });
      
      toast({
        title: "تم إنشاء الورشة بنجاح",
        description: "تمت إضافة الورشة الجديدة إلى قائمة الورش",
      });
      
      // Refresh workshops list
      const updatedWorkshops = await fetchWorkshops();
      onWorkshopsUpdated(updatedWorkshops);
      
      return true;
    } catch (error: any) {
      console.error("Error creating workshop:", error);
      toast({
        title: "خطأ في إنشاء الورشة",
        description: error.message || "حدث خطأ أثناء إنشاء الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, workshopData: any) => {
    setIsLoading(true);
    try {
      await updateWorkshop(id, workshopData);
      
      toast({
        title: "تم تحديث الورشة بنجاح",
        description: "تم حفظ التغييرات بنجاح",
      });
      
      // Refresh workshops list
      const updatedWorkshops = await fetchWorkshops();
      onWorkshopsUpdated(updatedWorkshops);
      
      return true;
    } catch (error: any) {
      console.error("Error updating workshop:", error);
      toast({
        title: "خطأ في تحديث الورشة",
        description: error.message || "حدث خطأ أثناء تحديث الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteWorkshop(id);
      
      toast({
        title: "تم حذف الورشة بنجاح",
        description: "تمت إزالة الورشة من قائمة الورش",
      });
      
      // Refresh workshops list
      const updatedWorkshops = await fetchWorkshops();
      onWorkshopsUpdated(updatedWorkshops);
      
      return true;
    } catch (error: any) {
      console.error("Error deleting workshop:", error);
      toast({
        title: "خطأ في حذف الورشة",
        description: error.message || "حدث خطأ أثناء حذف الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCreate,
    handleUpdate,
    handleDelete
  };
};
