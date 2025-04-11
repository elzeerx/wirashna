
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  items?: string[];
  defaultOpen?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const CollapsibleSection = ({ 
  title, 
  items = [], 
  defaultOpen = false,
  children,
  icon
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-8 border rounded-lg overflow-hidden"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-wirashna-secondary hover:bg-wirashna-secondary/80 transition-colors">
        <div className="flex items-center gap-2">
          {icon && <span className="text-wirashna-accent">{icon}</span>}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="text-wirashna-accent">
          {isOpen ? <X size={20} /> : <ArrowRight size={20} />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        {children ? (
          children
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;
