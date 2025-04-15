
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { createWorkshop } from "@/services/workshops";
import { useAuth } from "@/contexts/AuthContext";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";

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

    if (userRole !== 'admin' && userRole !== 'supervisor') {
      toast({
        title: "غير مصرح",
        description: "لا تملك الصلاحيات اللازمة لإنشاء ورشة جديدة",
        variant: "destructive",
      });
      return;
    }

    if (!data.dates || data.dates.length === 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يجب إضافة موعد واحد على الأقل للورشة",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting workshop data:", data);
      
      // Submit each date as a separate workshop
      for (const dateInfo of data.dates) {
        await createWorkshop({
          ...data,
          date: dateInfo.date,
          time: dateInfo.time,
        });
      }
      
      toast({
        title: "تم إنشاء الورشة بنجاح",
        description: "تمت إضافة الورشة الجديدة إلى قائمة الورش",
      });
      
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

  return (
    <AdminDashboardLayout>
      <AdminWorkshopForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate("/admin")}
        isSubmitting={isSubmitting}
      />
    </AdminDashboardLayout>
  );
};

export default CreateWorkshopPage;
