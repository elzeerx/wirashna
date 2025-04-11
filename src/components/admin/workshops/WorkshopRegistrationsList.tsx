
import { useState, useEffect } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { fetchWorkshopRegistrations } from "@/services/workshopService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface WorkshopRegistrationsListProps {
  workshopId: string;
}

const WorkshopRegistrationsList = ({ workshopId }: WorkshopRegistrationsListProps) => {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!workshopId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchWorkshopRegistrations(workshopId);
        setRegistrations(data);
      } catch (error) {
        console.error("Error loading workshop registrations:", error);
        toast({
          title: "خطأ في تحميل بيانات التسجيلات",
          description: "حدث خطأ أثناء تحميل بيانات التسجيلات. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, [workshopId, toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>التسجيلات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="wirashna-loader"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (registrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>التسجيلات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-gray-500">لا توجد تسجيلات لهذه الورشة حتى الآن</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>التسجيلات ({registrations.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="font-medium">{registration.full_name}</TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.phone || "—"}</TableCell>
                  <TableCell>
                    <span title={new Date(registration.created_at).toLocaleString("ar")}>
                      {formatDistanceToNow(new Date(registration.created_at), { 
                        addSuffix: true,
                        locale: ar 
                      })}
                    </span>
                  </TableCell>
                  <TableCell>{registration.notes || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopRegistrationsList;
