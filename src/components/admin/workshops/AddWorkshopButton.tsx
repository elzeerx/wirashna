
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AddWorkshopButton = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/admin/workshops/create");
  };

  return (
    <Button 
      onClick={handleClick}
      className="bg-[#512b81] hover:bg-[#512b81]/90"
    >
      <Plus size={16} className="ml-2" />
      إضافة ورشة جديدة
    </Button>
  );
};

export default AddWorkshopButton;
