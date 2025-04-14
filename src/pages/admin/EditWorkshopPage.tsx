
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { fetchWorkshopById, updateWorkshop } from "@/services/workshops";
import { Workshop } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";
import WorkshopNotFound from "@/components/workshop/WorkshopNotFound";

const EditWorkshopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadWorkshop = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchWorkshopById(id);
        
        if (!data) {
          setNotFound(true);
          return;
        }
        
        setWorkshop(data);
      } catch (error) {
        console.error("Error loading workshop:", error);
        toast({
          title: "خطأ في تحميل الورشة",
          description: "حدث خطأ أثناء تحميل بيانات الورشة. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      loadWorkshop();
    } else {
      setIsLoading(false);
    }
  }, [id, toast, isAdmin]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateWorkshop(id, data);
      
      toast({
        title: "تم تحديث الورشة بنجاح",
        description: "تم حفظ التغييرات بنجاح",
      });
      
      navigate("/admin");
    } catch (error: any) {
      console.error("Error updating workshop:", error);
      toast({
        title: "خطأ في تحديث الورشة",
        description: error.message || "حدث خطأ أثناء تحديث الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  if (notFound) {
    return <WorkshopNotFound />;
  }

  return (
    <AdminDashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">تعديل الورشة</h2>
        <p className="text-gray-600">تعديل تفاصيل الورشة.</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="wirashna-loader"></div>
        </div>
      ) : workshop ? (
        <div className="bg-white rounded-lg shadow p-6">
          <AdminWorkshopForm 
            initialData={workshop}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          لم يتم العثور على الورشة المطلوبة
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default EditWorkshopPage;
