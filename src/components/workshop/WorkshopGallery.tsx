
import { useState } from "react";
import { X } from "lucide-react";

interface WorkshopGalleryProps {
  mainImage: string [];
  gallery: string[];
  title: string;
}

const WorkshopGallery = ({ mainImage, gallery, title }: WorkshopGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  return (
    <>
      <div className="relative h-72 mb-6 rounded-lg overflow-hidden">
        <img 
          src={mainImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {gallery.map((image, index) => (
          <div 
            key={index} 
            className="h-24 rounded-lg overflow-hidden cursor-pointer border-2 hover:border-wirashna-accent transition-colors"
            onClick={() => setSelectedImage(image)}
          >
            <img 
              src={image} 
              alt={`Gallery ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Workshop image" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WorkshopGallery;
