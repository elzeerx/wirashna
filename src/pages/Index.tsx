
import HeroSection from "@/components/HeroSection";
import WorkshopShowcaseBento from "@/components/WorkshopShowcaseBento";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WorkshopShowcaseBento />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
