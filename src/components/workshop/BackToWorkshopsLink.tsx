
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BackToWorkshopsLink = () => {
  return (
    <div className="mb-8">
      <Link to="/workshops" className="inline-flex items-center text-wirashna-accent hover:underline">
        <ArrowRight size={18} className="ml-2" />
        <span>العودة إلى الورش</span>
      </Link>
    </div>
  );
};

export default BackToWorkshopsLink;
