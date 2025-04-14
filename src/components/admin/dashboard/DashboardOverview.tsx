
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, Users, Calendar, DollarSign, BarChart2, Plus } from "lucide-react";
import { Workshop, WorkshopRegistration } from "@/types/supabase";
import { Link } from "react-router-dom";

interface DashboardOverviewProps {
  workshops: Workshop[];
  onNavigate?: (tab: string) => void;
}

const DashboardOverview = ({ workshops, onNavigate }: DashboardOverviewProps) => {
  const currentDate = new Date();
  const upcomingWorkshops = workshops.filter(workshop => {
    const workshopDate = new Date(workshop.date);
    return workshopDate >= currentDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate some basic stats
  const totalWorkshops = workshops.length;
  
  // Calculate confirmed participants - only count confirmed and paid registrations
  const confirmedParticipants = workshops.reduce((sum, workshop) => {
    // Only count registrations with both 'confirmed' status AND 'paid' payment status
    // which is reflected by the available_seats calculation
    const confirmedSeats = workshop.total_seats - workshop.available_seats;
    return sum + confirmedSeats;
  }, 0);
  
  // Calculate revenue only from confirmed and paid registrations
  const confirmedRevenue = workshops.reduce((sum, workshop) => {
    // Revenue calculation based on confirmed paid seats
    const confirmedSeats = workshop.total_seats - workshop.available_seats;
    return sum + (workshop.price * confirmedSeats);
  }, 0);
  
  // Get next 3 upcoming workshops
  const nextWorkshops = upcomingWorkshops.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">لوحة المعلومات</h2>
        <Button asChild className="flex items-center gap-2">
          <Link to="/admin/workshops/create">
            <Plus size={16} />
            ورشة جديدة
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الورش</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkshops}</div>
            <p className="text-xs text-muted-foreground">
              ورشة مسجلة في النظام
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عدد المشاركين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedParticipants}</div>
            <p className="text-xs text-muted-foreground">
              مشارك في جميع الورش
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedRevenue} د.ك</div>
            <p className="text-xs text-muted-foreground">
              إجمالي الإيرادات من الورش
            </p>
          </CardContent>
        </Card>
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
                    <Button variant="outline" size="sm" onClick={() => onNavigate && onNavigate('workshops')}>
                      عرض التفاصيل
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => onNavigate && onNavigate('workshops')}
                >
                  عرض جميع الورش
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">لا توجد ورش قادمة</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  asChild
                >
                  <Link to="/admin/workshops/create">
                    إضافة ورشة جديدة
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">الإحصاءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">نسبة الحجوزات</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-wirashna-accent h-2.5 rounded-full"
                      style={{
                        width: `${workshops.length > 0 
                          ? Math.floor((confirmedParticipants / (workshops.reduce((sum, w) => sum + w.total_seats, 0))) * 100) 
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {workshops.length > 0 
                    ? Math.floor((confirmedParticipants / (workshops.reduce((sum, w) => sum + w.total_seats, 0))) * 100) 
                    : 0}%
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate && onNavigate('settings')}
                >
                  إعدادات الموقع
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
