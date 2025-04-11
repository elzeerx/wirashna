
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Workshop } from "@/types/supabase";
import EditWorkshopDialog from "./EditWorkshopDialog";
import DeleteWorkshopDialog from "./DeleteWorkshopDialog";
import WorkshopTable from "./WorkshopTable";
import AddWorkshopButton from "./AddWorkshopButton";
import { useWorkshopOperations } from "@/hooks/useWorkshopOperations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkshopMaterialsManager from "./WorkshopMaterialsManager";

interface AdminWorkshopListProps {
  workshops: Workshop[];
  onWorkshopsUpdated: (workshops: Workshop[]) => void;
  onWorkshopSelect?: (workshopId: string) => void;
}

const AdminWorkshopList = ({ workshops, onWorkshopsUpdated, onWorkshopSelect }: AdminWorkshopListProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [activeTab, setActiveTab] = useState("workshops");
  const navigate = useNavigate();
  
  const { isLoading, handleUpdate, handleDelete } = useWorkshopOperations({
    onWorkshopsUpdated
  });

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

  const handleViewRegistrations = (workshop: Workshop) => {
    if (onWorkshopSelect) {
      onWorkshopSelect(workshop.id);
    }
  };

  const handleManageMaterials = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setActiveTab("materials");
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="workshops">قائمة الورش</TabsTrigger>
          {selectedWorkshop && (
            <TabsTrigger value="materials">إدارة المواد التعليمية</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="workshops">
          <div className="flex justify-end mb-6">
            <AddWorkshopButton />
          </div>

          <WorkshopTable 
            workshops={workshops}
            onView={handleViewWorkshop}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
            onViewRegistrations={onWorkshopSelect ? handleViewRegistrations : undefined}
            onManageMaterials={handleManageMaterials}
          />
        </TabsContent>
        
        <TabsContent value="materials">
          {selectedWorkshop && (
            <div>
              <h2 className="text-xl font-bold mb-6">إدارة المواد التعليمية - {selectedWorkshop.title}</h2>
              <WorkshopMaterialsManager workshopId={selectedWorkshop.id} />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
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
