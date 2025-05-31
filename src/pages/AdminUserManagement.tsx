
import { useState, useEffect } from "react";
import { User, Edit, Trash2, UserCheck, UserX, Search, Plus } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/supabase";
import { EnhancedBentoGrid } from "@/components/ui/enhanced-bento-grid";
import AnalyticsBentoCard from "@/components/admin/analytics/AnalyticsBentoCard";

const AdminUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) throw error;
      setUsers(data as unknown as UserProfile[]);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "خطأ في تحميل المستخدمين",
        description: error.message || "حدث خطأ أثناء تحميل بيانات المستخدمين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          role: selectedRole as 'admin' | 'supervisor' | 'subscriber',
          is_admin: selectedRole === 'admin'
        } as any)
        .eq('id', selectedUser.id as any);

      if (error) throw error;
      
      toast({
        title: "تم تحديث دور المستخدم",
        description: "تم تحديث دور المستخدم بنجاح",
      });
      
      fetchUsers();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast({
        title: "خطأ في تحديث دور المستخدم",
        description: error.message || "حدث خطأ أثناء تحديث دور المستخدم",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <UserCheck size={16} className="text-purple-500" />;
      case 'supervisor':
        return <UserCheck size={16} className="text-blue-500" />;
      default:
        return <User size={16} className="text-gray-500" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'supervisor':
        return 'مشرف';
      default:
        return 'مشترك';
    }
  };

  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      return user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Calculate user statistics
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    supervisors: users.filter(u => u.role === 'supervisor').length,
    subscribers: users.filter(u => u.role === 'subscriber').length,
    newThisMonth: users.filter(u => {
      const createdDate = new Date(u.created_at);
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return createdDate >= thisMonth;
    }).length
  };

  return (
    <DashboardLayout title="إدارة المستخدمين" requireRole="admin">
      <div className="space-y-8">
        {/* User Statistics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">إحصائيات المستخدمين</h2>
          <EnhancedBentoGrid variant="admin">
            <AnalyticsBentoCard
              title="إجمالي المستخدمين"
              value={userStats.total}
              change={{ value: 12, period: "الشهر الماضي" }}
              icon={User}
              gradient="analytics"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="المديرون"
              value={userStats.admins}
              icon={UserCheck}
              gradient="ai"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="المشرفون"
              value={userStats.supervisors}
              icon={UserCheck}
              gradient="marketing"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="المشتركون"
              value={userStats.subscribers}
              change={{ value: 25, period: "الشهر الماضي" }}
              icon={User}
              gradient="content"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="مستخدمون جدد"
              value={userStats.newThisMonth}
              change={{ value: 18, period: "الشهر الماضي" }}
              icon={Plus}
              gradient="success"
              size="medium"
              loading={isLoading}
            />
          </EnhancedBentoGrid>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">قائمة المستخدمين</h3>
                <p className="text-gray-600">إدارة أدوار وصلاحيات المستخدمين</p>
              </div>
              
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="بحث عن مستخدم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="wirashna-loader"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          لا يوجد مستخدمين متطابقين مع معايير البحث
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.full_name || "مستخدم بدون اسم"}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString('ar-EG')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getRoleIcon(user.role)}
                              <span className="mr-2">{getRoleText(user.role)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSelectedRole(user.role);
                                  setIsEditDialogOpen(true);
                                }}
                                title="تعديل الدور"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsDeleteDialogOpen(true);
                                }}
                                title="حذف المستخدم"
                                disabled={true} // Disabled for safety in this demo
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogTitle>تعديل دور المستخدم</DialogTitle>
          <DialogDescription>
            تعديل دور {selectedUser?.full_name || "المستخدم"}
          </DialogDescription>
          
          <div className="py-4">
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="supervisor">مشرف</SelectItem>
                <SelectItem value="subscriber">مشترك</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={updateUserRole}
              className="bg-wirashna-accent hover:bg-wirashna-accent/90"
            >
              حفظ التغييرات
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog - Disabled for safety in this demo */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>حذف المستخدم</DialogTitle>
          <DialogDescription>
            هذه العملية غير متاحة في النسخة التجريبية. في التطبيق الحقيقي، ستتمكن من حذف المستخدم وجميع بياناته.
          </DialogDescription>
          
          <div className="flex justify-end space-x-2 space-x-reverse mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminUserManagement;
