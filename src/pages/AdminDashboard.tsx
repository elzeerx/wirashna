
import { useState } from "react";
import { Plus, Edit, Trash2, Eye, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { workshops } from "@/data/workshops";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";

const AdminDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateWorkshop = (workshopData: any) => {
    // In a real app, this would send data to an API/database
    console.log("Creating workshop:", workshopData);
    toast({
      title: "تم إنشاء الورشة بنجاح",
      description: "تمت إضافة الورشة الجديدة إلى قائمة الورش",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditWorkshop = (workshopData: any) => {
    // In a real app, this would update data in an API/database
    console.log("Editing workshop:", workshopData);
    toast({
      title: "تم تحديث الورشة بنجاح",
      description: "تم حفظ التغييرات بنجاح",
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteWorkshop = () => {
    // In a real app, this would delete the workshop from an API/database
    console.log("Deleting workshop:", selectedWorkshop?.id);
    toast({
      title: "تم حذف الورشة بنجاح",
      description: "تمت إزالة الورشة من قائمة الورش",
    });
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setIsDeleteDialogOpen(true);
  };

  const viewWorkshop = (id: string) => {
    navigate(`/workshops/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">لوحة إدارة الورش</h1>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-[#512b81] hover:bg-[#512b81]/90"
            >
              <Plus size={16} className="ml-2" />
              إضافة ورشة جديدة
            </Button>
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
                {workshops.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell className="font-medium">{workshop.title}</TableCell>
                    <TableCell>{workshop.date}</TableCell>
                    <TableCell>{workshop.venue}</TableCell>
                    <TableCell>{workshop.availableSeats}/{workshop.totalSeats}</TableCell>
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
                ))}
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
