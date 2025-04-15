import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <div className="relative h-[600px] bg-[#3B49DF] overflow-hidden">
      <div className="absolute inset-0 flex">
        <div className="w-24 bg-[#2D3BBA]" />
        <div className="flex-1">
          <img
            src="/lovable-uploads/bfb1fc0a-8b07-4699-bd9d-b3580c646c44.png"
            alt="Workshop Environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3B49DF] bg-opacity-80" />
        </div>
      </div>

      <div className="wirashna-container relative h-full">
        <div className="pt-32 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            اكتشف ورش عمل متخصصة في صناعة المحتوى والذكاء الاصطناعي
          </h1>
          <p className="text-lg text-white/90 mb-8">
            منصة تعليمية متكاملة تقدم ورش عمل احترافية مع خبراء في المجال
          </p>
          <div className="flex gap-4">
            <Button variant="default" className="bg-white text-[#3B49DF] hover:bg-white/90">
              استكشف الورش
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0">
          <div className="bg-white p-4 rounded-lg shadow-lg flex gap-4">
            <div className="flex-1">
              <input
                type="search"
                placeholder="ابحث عن ورشة عمل..."
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="w-48">
              <select className="w-full p-2 border rounded-md">
                <option>جميع التصنيفات</option>
              </select>
            </div>
            <div className="w-48">
              <select className="w-full p-2 border rounded-md">
                <option>السعر</option>
              </select>
            </div>
            <Button type="submit" className="!px-8">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
