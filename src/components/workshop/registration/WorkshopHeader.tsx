
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WorkshopHeader = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className="mb-6"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="ml-2" />
      عودة
    </Button>
  );
};

export default WorkshopHeader;
