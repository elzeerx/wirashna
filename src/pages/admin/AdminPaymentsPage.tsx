
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { WorkshopRegistration } from "@/types/supabase";

const AdminPaymentsPage = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select(`
          *,
          workshops (
            title,
            price
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as (WorkshopRegistration & { workshops: { title: string; price: number } })[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">المدفوعات</h2>
          <p className="text-gray-500">متابعة وإدارة مدفوعات الورش</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="wirashna-loader"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المشترك</TableHead>
                  <TableHead>الورشة</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>حالة الدفع</TableHead>
                  <TableHead>التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.full_name}</TableCell>
                    <TableCell>{payment.workshops?.title}</TableCell>
                    <TableCell>{payment.workshops?.price} د.ك</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(payment.payment_status)}`}>
                        {payment.payment_status === 'paid' ? 'مدفوع' :
                         payment.payment_status === 'processing' ? 'قيد المعالجة' :
                         payment.payment_status === 'failed' ? 'فشلت العملية' : 'غير مدفوع'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(payment.created_at || ''), 'dd/MM/yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminPaymentsPage;
