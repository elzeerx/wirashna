
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { createWorkshop } from "@/services/workshopService";
import { useAuth } from "@/contexts/AuthContext";

const CreateWorkshopPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "غير مصرح",
        description: "يجب تسجيل الدخول لإنشاء ورشة جديدة",
        variant: "destructive",
      });
      return;
    }

    console.log("Current user role:", userRole);
    console.log("Current user ID:", user.id);
    
    if (userRole !== 'admin' && userRole !== 'supervisor') {
      toast({
        title: "غير مصرح",
        description: "لا تملك الصلاحيات اللازمة لإنشاء ورشة جديدة",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting workshop data:", data);
      
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
    } finally {
      setIsSubmitting(false);
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
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default CreateWorkshopPage;
