import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { createWorkshop } from "@/services/workshops";
import { useAuth } from "@/contexts/AuthContext";
import { BasicInformationStep } from "@/components/admin/workshop-form/BasicInformationStep";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const CreateWorkshopPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
    }
  });

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
      
      await createWorkshop({
        ...data,
        available_seats: data.total_seats,
      });
      
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <BasicInformationStep />
        </form>
      </Form>
    </AdminDashboardLayout>
  );
};

export default CreateWorkshopPage;
