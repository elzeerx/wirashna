
import { useState, useEffect } from "react";
import { Users, Calendar, Award, ActivitySquare } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWorkshops } from "@/services/workshopService";
import { Workshop } from "@/types/supabase";

const SupervisorDashboard = () => {
  const { userProfile } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error("Error loading workshops:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate statistics for supervisor dashboard with corrected logic
  const totalWorkshops = workshops.length;
  const totalSeats = workshops.reduce((sum, w) => sum + w.total_seats, 0);
  
  // Use confirmed seats only for calculations
  const confirmedSeats = workshops.reduce((sum, w) => sum + (w.total_seats - w.available_seats), 0);
  
  const upcomingWorkshops = workshops.filter(w => w.date.includes('٢٠٢٥')).length;

  return (
    <DashboardLayout title={`لوحة المشرف - ${userProfile?.full_name || ''}`} requireRole="supervisor">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatisticsCard
          title="إجمالي الورش"
          value={totalWorkshops}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatisticsCard
          title="إجمالي المقاعد"
          value={totalSeats}
          icon={<Users className="h-4 w-4" />}
        />
        <StatisticsCard
          title="نسبة الحجز"
          value={`${totalSeats > 0 ? Math.round((confirmedSeats / totalSeats) * 100) : 0}%`}
          icon={<Award className="h-4 w-4" />}
          description={`${confirmedSeats} من ${totalSeats} مقعد`}
        />
        <StatisticsCard
          title="الورش القادمة"
          value={upcomingWorkshops}
          icon={<ActivitySquare className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">آخر التسجيلات</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="wirashna-loader"></div>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المشترك</TableHead>
                      <TableHead>الورشة</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample data - in a real app, this would come from API */}
                    <TableRow>
                      <TableCell>أحمد محمد</TableCell>
                      <TableCell>تطوير الويب</TableCell>
                      <TableCell><Badge className="bg-green-500">مؤكد</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>سارة أحمد</TableCell>
                      <TableCell>تصميم الجرافيك</TableCell>
                      <TableCell><Badge className="bg-yellow-500">معلق</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>خالد عبدالله</TableCell>
                      <TableCell>التسويق الإلكتروني</TableCell>
                      <TableCell><Badge className="bg-green-500">مؤكد</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">توزيع المشتركين حسب الورش</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="wirashna-loader"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {workshops.slice(0, 5).map((workshop) => (
                  <div key={workshop.id} className="flex items-center">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{workshop.title}</div>
                    </div>
                    <div className="w-1/3">
                      <div className="text-right text-sm">{workshop.total_seats - workshop.available_seats} / {workshop.total_seats}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-wirashna-accent h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.round(((workshop.total_seats - workshop.available_seats) / workshop.total_seats) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الورش القادمة</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="wirashna-loader"></div>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الورشة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المكان</TableHead>
                    <TableHead>المقاعد المتاحة</TableHead>
                    <TableHead>نسبة الحجز</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshops
                    .filter(w => w.date.includes('٢٠٢٥'))
                    .map((workshop) => (
                      <TableRow key={workshop.id}>
                        <TableCell className="font-medium">{workshop.title}</TableCell>
                        <TableCell>{workshop.date}</TableCell>
                        <TableCell>{workshop.venue}</TableCell>
                        <TableCell>{workshop.available_seats}/{workshop.total_seats}</TableCell>
                        <TableCell>
                          {Math.round(((workshop.total_seats - workshop.available_seats) / workshop.total_seats) * 100)}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;
