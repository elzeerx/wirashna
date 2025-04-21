import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, BarChart2, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Workshop } from "@/types/supabase";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemoizedWorkshops } from "@/hooks/useMemoizedWorkshops";
import SkeletonLoader from "@/components/ui/skeleton-loader";

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [latestUsers, setLatestUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch workshops
        const { data: workshopsData, error: workshopsError } = await supabase
          .from('workshops')
          .select('*')
          .order('created_at', { ascending: false });

        if (workshopsError) {
          console.error("Error fetching workshops:", workshopsError);
        } else {
          setWorkshops(workshopsData || []);
        }

        // Fetch latest users
        const { data: usersData, error: usersError } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (usersError) {
          console.error("Error fetching latest users:", usersError);
        } else {
          setLatestUsers(usersData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const { statistics, nextWorkshops } = useMemoizedWorkshops(workshops);
  const { totalWorkshops, confirmedParticipants, confirmedRevenue } = statistics;

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">لوحة المعلومات</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <SkeletonLoader key={i} className="h-28" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader className="h-64" />
            <SkeletonLoader className="h-64" />
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">لوحة المعلومات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatisticsCard
            title="إجمالي الورش"
            value={totalWorkshops}
            icon={<Calendar className="h-4 w-4" />}
            description="ورشة مسجلة في النظام"
          />
          <StatisticsCard
            title="عدد المشاركين"
            value={confirmedParticipants}
            icon={<Users className="h-4 w-4" />}
            description="مشارك في جميع الورش"
          />
          <StatisticsCard
            title="الإيرادات"
            value={`${confirmedRevenue} د.ك`}
            icon={<DollarSign className="h-4 w-4" />}
            description="إجمالي الإيرادات من الورش"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">الورش القادمة</CardTitle>
            </CardHeader>
            <CardContent>
              {nextWorkshops.length > 0 ? (
                <div className="space-y-4">
                  {nextWorkshops.map((workshop) => (
                    <div key={workshop.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{workshop.title}</p>
                        <p className="text-sm text-muted-foreground">{workshop.date} | {workshop.time}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Link to={`/admin/workshops/${workshop.id}`}>عرض التفاصيل</Link>
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    <Link to="/admin/workshops">عرض جميع الورش</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">لا توجد ورش قادمة</p>
                  <Button variant="outline" className="mt-2">
                    <Link to="/admin/workshops/create">إضافة ورشة جديدة</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">آخر المسجلين</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الإسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {latestUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name || "غير محدد"}</TableCell>
                    <TableCell>{user.email || "غير محدد"}</TableCell>
                    <TableCell>{format(new Date(user.created_at), "dd/MM/yyyy")}</TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
