
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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { fetchUserRegistrationCounts } from "@/services/workshops";
import { Badge } from "@/components/ui/badge";

const AdminSubscribersPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});

  const { data: subscribers, isLoading, refetch } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Get registration counts for all users
        const counts = await fetchUserRegistrationCounts();
        setRegistrationCounts(counts);
        
        // Display all users (not just those with subscriber role)
        // This ensures we see newly registered users regardless of role
        return (data as unknown) as UserProfile[];
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        return [];
      }
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">المشتركين</h2>
            <p className="text-gray-500">إدارة حسابات المشتركين في المنصة</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex gap-2 items-center"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              تحديث
            </Button>
            <AddUserDialog onUserAdded={refetch} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="wirashna-loader"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {subscribers && subscribers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الإسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                    <TableHead>الورش المسجلة</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers?.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.full_name || 'غير محدد'}</TableCell>
                      <TableCell>{subscriber.email || 'غير محدد'}</TableCell>
                      <TableCell>
                        {format(new Date(subscriber.created_at || ''), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {registrationCounts[subscriber.id] ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            {registrationCounts[subscriber.id]}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            0
                          </Badge>
                        )}
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
            ) : (
              <div className="py-8 text-center text-gray-500">
                لا يوجد مشتركين حالياً
              </div>
            )}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSubscribersPage;
