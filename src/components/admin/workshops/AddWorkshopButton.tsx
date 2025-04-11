
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddWorkshopButtonProps {
  onClick: () => void;
}

const AddWorkshopButton = ({ onClick }: AddWorkshopButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="bg-[#512b81] hover:bg-[#512b81]/90"
    >
      <Plus size={16} className="ml-2" />
      إضافة ورشة جديدة
    </Button>
  );
};

export default AddWorkshopButton;
