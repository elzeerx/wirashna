
import HeroSection from "@/components/HeroSection";
import WorkshopShowcase from "@/components/WorkshopShowcase";
import AboutSection from "@/components/AboutSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WorkshopShowcase />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
