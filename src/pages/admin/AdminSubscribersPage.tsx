
import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { AddUserDialog } from "@/components/admin/subscribers/AddUserDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const AdminSubscribersPage = () => {
  const { data: subscribers, isLoading, refetch } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'subscriber')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      // Consistent type assertion approach
      return (data as unknown) as UserProfile[];
    }
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">المشتركين</h2>
            <p className="text-gray-500">إدارة حسابات المشتركين في المنصة</p>
          </div>
          <AddUserDialog onUserAdded={refetch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="wirashna-loader"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الإسم</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers?.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.full_name || 'غير محدد'}</TableCell>
                    <TableCell>
                      {format(new Date(subscriber.created_at || ''), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">
                        نشط
                      </span>
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

export default AdminSubscribersPage;
