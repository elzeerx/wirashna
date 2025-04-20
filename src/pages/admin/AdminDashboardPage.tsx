import { useState, useEffect } from "react";
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
import { fetchUserRegistrations } from "@/services/workshopService";
import { UserProfile, Workshop, WorkshopRegistration } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const workshopsData = await fetchWorkshops();
        const registrationsData = await fetchUserRegistrations('');
      
        const processedWorkshops = workshopsData.map(w => ({
          ...w,
          start_date: w.date,
          end_date: w.date,
          status: 'active' as const
        }));
      
        setWorkshops(processedWorkshops);
        setRegistrations(registrationsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    },
  });

  const totalRevenue = workshops.reduce((sum, workshop) => sum + workshop.price * (workshop.total_seats - workshop.available_seats), 0);

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
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
            <CardContent className="text-2xl font-bold">{users?.length || 0}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجمالي التسجيلات</CardTitle>
              <CardDescription>عدد التسجيلات في الورش المختلفة</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{registrations.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجمالي الإيرادات</CardTitle>
              <CardDescription>إجمالي الإيرادات المتوقعة من الورش</CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{totalRevenue} KWD</CardContent>
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
              ) : (
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
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.slice(0, 5).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || "غير محدد"}</TableCell>
                        <TableCell>{user.email || "غير محدد"}</TableCell>
                        <TableCell>
                          {format(new Date(user.created_at || ''), "dd/MM/yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
