
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heading, TextIcon, Image, Square } from "lucide-react";

interface ElementPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (elementType: string) => void;
}

const ElementPicker = ({ isOpen, onClose, onSelect }: ElementPickerProps) => {
  const elements = [
    {
      type: "heading",
      label: "عنوان",
      icon: <Heading className="w-8 h-8" />,
      description: "عنوان رئيسي أو فرعي للمحتوى"
    },
    {
      type: "text",
      label: "نص",
      icon: <TextIcon className="w-8 h-8" />,
      description: "فقرة نصية أو مقال"
    },
    {
      type: "image",
      label: "صورة",
      icon: <Image className="w-8 h-8" />,
      description: "صورة مع إمكانية تحميلها"
    },
    {
      type: "spacer",
      label: "مساحة فارغة",
      icon: <Square className="w-8 h-8" />,
      description: "مساحة فارغة بين العناصر"
    }
  ];

  const handleSelect = (type: string) => {
    onSelect(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>اختر نوع العنصر</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {elements.map((element) => (
            <Button
              key={element.type}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
              onClick={() => handleSelect(element.type)}
            >
              <div className="text-wirashna-accent">
                {element.icon}
              </div>
              <div className="font-medium">{element.label}</div>
              <p className="text-xs text-gray-500 text-center">{element.description}</p>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ElementPicker;
