
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WorkshopNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">الورشة غير موجودة</h1>
          <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على الورشة المطلوبة.</p>
          <Link to="/workshops" className="wirashna-btn-primary inline-flex items-center">
            <ArrowRight size={18} className="ml-2" />
            <span>العودة إلى الورش</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkshopNotFound;
