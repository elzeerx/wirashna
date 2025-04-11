
import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Workshop } from "@/types/supabase";
import { createWorkshop, updateWorkshop, deleteWorkshop, fetchWorkshops } from "@/services/workshopService";
import CreateWorkshopDialog from "./CreateWorkshopDialog";
import EditWorkshopDialog from "./EditWorkshopDialog";
import DeleteWorkshopDialog from "./DeleteWorkshopDialog";

interface AdminWorkshopListProps {
  workshops: Workshop[];
  onWorkshopsUpdated: (workshops: Workshop[]) => void;
}

const AdminWorkshopList = ({ workshops, onWorkshopsUpdated }: AdminWorkshopListProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      onWorkshopsUpdated(updatedWorkshops);
      
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
      onWorkshopsUpdated(updatedWorkshops);
      
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
      onWorkshopsUpdated(updatedWorkshops);
      
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

  return (
    <>
      <div className="flex justify-end mb-6">
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

      {/* Dialogs */}
      <CreateWorkshopDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateWorkshop}
      />
      
      <EditWorkshopDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        workshop={selectedWorkshop}
        onSubmit={handleEditWorkshop}
      />
      
      <DeleteWorkshopDialog 
        isOpen={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        workshop={selectedWorkshop}
        onDelete={handleDeleteWorkshop}
      />
    </>
  );
};

export default AdminWorkshopList;
