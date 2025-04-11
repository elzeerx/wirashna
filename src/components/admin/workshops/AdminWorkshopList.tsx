
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Workshop } from "@/types/supabase";
import CreateWorkshopDialog from "./CreateWorkshopDialog";
import EditWorkshopDialog from "./EditWorkshopDialog";
import DeleteWorkshopDialog from "./DeleteWorkshopDialog";
import WorkshopTable from "./WorkshopTable";
import AddWorkshopButton from "./AddWorkshopButton";
import { useWorkshopOperations } from "@/hooks/useWorkshopOperations";

interface AdminWorkshopListProps {
  workshops: Workshop[];
  onWorkshopsUpdated: (workshops: Workshop[]) => void;
}

const AdminWorkshopList = ({ workshops, onWorkshopsUpdated }: AdminWorkshopListProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const navigate = useNavigate();
  
  const { isLoading, handleCreate, handleUpdate, handleDelete } = useWorkshopOperations({
    onWorkshopsUpdated
  });

  const handleCreateWorkshop = async (workshopData: any) => {
    const success = await handleCreate(workshopData);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditWorkshop = async (workshopData: any) => {
    if (!selectedWorkshop) return;
    
    const success = await handleUpdate(selectedWorkshop.id, workshopData);
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteWorkshop = async () => {
    if (!selectedWorkshop) return;
    
    const success = await handleDelete(selectedWorkshop.id);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleViewWorkshop = (id: string) => {
    navigate(`/workshops/${id}`);
  };

  const handleOpenEditDialog = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <AddWorkshopButton onClick={() => setIsCreateDialogOpen(true)} />
      </div>

      <WorkshopTable 
        workshops={workshops}
        onView={handleViewWorkshop}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

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
