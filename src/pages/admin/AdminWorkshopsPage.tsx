
import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import AdminWorkshopList from "@/components/admin/workshops/AdminWorkshopList";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshops";
import { useLoadingState } from "@/hooks/useLoadingState";

const AdminWorkshopsPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);
  const { isLoading, wrapAsync } = useLoadingState({
    errorMessage: "حدث خطأ أثناء تحميل الورش. الرجاء المحاولة مرة أخرى."
  });

  const loadWorkshops = async () => {
    wrapAsync(async () => {
      const data = await fetchWorkshops();
      setWorkshops(data);
    });
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const handleWorkshopsUpdated = (updatedWorkshops: Workshop[]) => {
    setWorkshops(updatedWorkshops);
  };

  const handleWorkshopSelect = (workshopId: string) => {
    setSelectedWorkshopId(workshopId);
  };

  return (
    <AdminDashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">إدارة الورش</h2>
        <p className="text-gray-600">إدارة وتحرير الورش والتسجيلات.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="wirashna-loader"></div>
        </div>
      ) : (
        <AdminWorkshopList 
          workshops={workshops} 
          onWorkshopsUpdated={handleWorkshopsUpdated}
          onWorkshopSelect={handleWorkshopSelect}
        />
      )}
    </AdminDashboardLayout>
  );
};

export default AdminWorkshopsPage;
