
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchWorkshops,
} from "@/services/workshops";
import { fetchUserRegistrations } from "@/services/workshops";
import { UserProfile, Workshop, WorkshopRegistration } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Refactor to use a callback to prevent unnecessary re-renders
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [workshopsData, registrationsData] = await Promise.all([
        fetchWorkshops(),
        fetchUserRegistrations('') // Pass empty string to fetch all registrations
      ]);
    
      const processedWorkshops = workshopsData.map(w => ({
        ...w,
        start_date: w.date,
        end_date: w.date,
        status: 'active' as const
      }));
    
      setWorkshops(processedWorkshops);
      setRegistrations(registrationsData.filter(r => r.payment_status === 'paid'));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values in case of error
      setWorkshops([]);
      setRegistrations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetching latest users from user_profiles ordered by creation date
  const { data: latestUsers = [], isLoading: isUsersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["latest_users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        return (data as unknown) as UserProfile[];
      } catch (error) {
        console.error("Error fetching latest users:", error);
        return [];
      }
    },
  });

  // Calculate total revenue from paid registrations
  const totalRevenue = registrations
    .filter(reg => reg.payment_status === 'paid')
    .reduce((sum, reg) => {
      const workshop = workshops.find(w => w.id === reg.workshop_id);
      return sum + (workshop?.price || 0);
    }, 0);

  // Create refresh function to manually refresh data
  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        refetchUsers()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">لوحة المعلومات</h2>
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={refreshing}
            className="flex gap-2 items-center"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            تحديث البيانات
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>إجمالي الورش</CardTitle>
              <CardDescription>عدد الورشات المتوفرة في المنصة</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{workshops.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجمالي المستخدمين</CardTitle>
              <CardDescription>عدد المستخدمين المسجلين في المنصة</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{latestUsers ? latestUsers.length : 0}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجمالي التسجيلات</CardTitle>
              <CardDescription>عدد التسجيلات المؤكدة في الورش المختلفة</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{registrations.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجمالي الإيرادات</CardTitle>
              <CardDescription>إجمالي الإيرادات من الورش</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{totalRevenue.toFixed(2)} KWD</CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>أحدث الورش</CardTitle>
              <CardDescription>آخر الورش التي تمت إضافتها</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="wirashna-loader"></div>
                </div>
              ) : workshops.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الورشة</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>السعر</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workshops.slice(0, 5).map((workshop) => (
                      <TableRow key={workshop.id}>
                        <TableCell>{workshop.title}</TableCell>
                        <TableCell>
                          {format(new Date(workshop.created_at), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{workshop.price} KWD</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-4 text-center text-gray-500">لا توجد ورش حالياً</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>أحدث المستخدمين</CardTitle>
              <CardDescription>آخر المستخدمين الذين قاموا بالتسجيل</CardDescription>
            </CardHeader>
            <CardContent>
              {isUsersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="wirashna-loader"></div>
                </div>
              ) : latestUsers?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {latestUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || "غير محدد"}</TableCell>
                        <TableCell>{user.email || "غير محدد"}</TableCell>
                        <TableCell>
                          {user.created_at ? format(new Date(user.created_at), "dd/MM/yyyy") : "غير محدد"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-4 text-center text-gray-500">لا يوجد مستخدمين حالياً</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
