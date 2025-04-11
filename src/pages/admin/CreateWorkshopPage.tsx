
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { createWorkshop, fetchWorkshops } from "@/services/workshopService";

const CreateWorkshopPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Ensure available_seats matches total_seats for new workshops
      await createWorkshop({
        ...data,
        available_seats: data.total_seats,
      });
      
      toast({
        title: "تم إنشاء الورشة بنجاح",
        description: "تمت إضافة الورشة الجديدة إلى قائمة الورش",
      });
      
      // Navigate back to admin dashboard after successful creation
      navigate("/admin");
    } catch (error: any) {
      console.error("Error creating workshop:", error);
      toast({
        title: "خطأ في إنشاء الورشة",
        description: error.message || "حدث خطأ أثناء إنشاء الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <AdminDashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">إضافة ورشة جديدة</h2>
        <p className="text-gray-600">أدخل تفاصيل الورشة الجديدة.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <AdminWorkshopForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default CreateWorkshopPage;
