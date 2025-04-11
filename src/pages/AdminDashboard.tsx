
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from "@/services/workshopService";

const AdminDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const data = await fetchWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error("Error loading workshops:", error);
        toast({
          title: "خطأ في تحميل الورش",
          description: "حدث خطأ أثناء تحميل بيانات الورش. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkshops();
  }, [toast]);

  useEffect(() => {
    // Redirect non-admin users
    if (!isAdmin && !isLoading) {
      navigate("/");
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
    }
  }, [isAdmin, isLoading, navigate, toast]);

  const handleCreateWorkshop = async (workshopData: any) => {
    try {
      await createWorkshop({
        ...workshopData,
        available_seats: workshopData.totalSeats,
      });
      
      toast({
        title: "تم إنشاء الورشة بنجاح",
        description: "تمت إضافة الورشة الجديدة إلى قائمة الورش",
      });
      
      // Refresh workshops list
      const updatedWorkshops = await fetchWorkshops();
      setWorkshops(updatedWorkshops);
      
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating workshop:", error);
      toast({
        title: "خطأ في إنشاء الورشة",
        description: error.message || "حدث خطأ أثناء إنشاء الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleEditWorkshop = async (workshopData: any) => {
    if (!selectedWorkshop) return;
    
    try {
      await updateWorkshop(selectedWorkshop.id, workshopData);
      
      toast({
        title: "تم تحديث الورشة بنجاح",
        description: "تم حفظ التغييرات بنجاح",
      });
      
      // Refresh workshops list
      const updatedWorkshops = await fetchWorkshops();
      setWorkshops(updatedWorkshops);
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating workshop:", error);
      toast({
        title: "خطأ في تحديث الورشة",
        description: error.message || "حدث خطأ أثناء تحديث الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkshop = async () => {
    if (!selectedWorkshop) return;
    
    try {
      await deleteWorkshop(selectedWorkshop.id);
      
      toast({
        title: "تم حذف الورشة بنجاح",
        description: "تمت إزالة الورشة من قائمة الورش",
      });
      
      // Refresh workshops list
      const updatedWorkshops = await fetchWorkshops();
      setWorkshops(updatedWorkshops);
      
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting workshop:", error);
      toast({
        title: "خطأ في حذف الورشة",
        description: error.message || "حدث خطأ أثناء حذف الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsDeleteDialogOpen(true);
  };

  const viewWorkshop = (id: string) => {
    navigate(`/workshops/${id}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="wirashna-container py-12 flex justify-center items-center">
            <div className="wirashna-loader"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">لوحة إدارة الورش</h1>
              <p className="text-gray-600">مرحبًا {user?.email}</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                تسجيل الخروج
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#512b81] hover:bg-[#512b81]/90"
              >
                <Plus size={16} className="ml-2" />
                إضافة ورشة جديدة
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عنوان الورشة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المكان</TableHead>
                  <TableHead>المقاعد المتاحة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      لا توجد ورش حالياً. أضف ورشة جديدة لتظهر هنا.
                    </TableCell>
                  </TableRow>
                ) : (
                  workshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell className="font-medium">{workshop.title}</TableCell>
                      <TableCell>{workshop.date}</TableCell>
                      <TableCell>{workshop.venue}</TableCell>
                      <TableCell>{workshop.available_seats}/{workshop.total_seats}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2 space-x-reverse">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewWorkshop(workshop.id)}
                            title="عرض الورشة"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditDialog(workshop)}
                            title="تعديل الورشة"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openDeleteDialog(workshop)}
                            className="text-red-500 hover:text-red-700"
                            title="حذف الورشة"
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
        </div>
      </main>

      {/* Create Workshop Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle>إضافة ورشة جديدة</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الورشة الجديدة.
          </DialogDescription>
          <AdminWorkshopForm 
            onSubmit={handleCreateWorkshop}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Workshop Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle>تعديل الورشة</DialogTitle>
          <DialogDescription>
            قم بتعديل تفاصيل الورشة.
          </DialogDescription>
          <AdminWorkshopForm 
            initialData={selectedWorkshop}
            onSubmit={handleEditWorkshop}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Workshop Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>حذف الورشة</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من أنك تريد حذف الورشة "{selectedWorkshop?.title}"؟
            <br />
            لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
          <div className="flex justify-end space-x-2 space-x-reverse mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteWorkshop}
            >
              تأكيد الحذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
