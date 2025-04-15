
import { CheckCircle2, Target, ClipboardList, Users } from "lucide-react";
import CollapsibleSection from "./CollapsibleSection";

interface WorkshopDetailsSectionProps {
  objectives?: string[];
  benefits?: string[];
  requirements?: string[];
  targetAudience?: string[];
}

const WorkshopDetailsSection = ({
  objectives,
  benefits,
  requirements,
  targetAudience
}: WorkshopDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      {objectives && objectives.length > 0 && (
        <CollapsibleSection
          title="أهداف الورشة"
          items={objectives}
          icon={<Target />}
          defaultOpen={true}
        />
      )}
      
      {benefits && benefits.length > 0 && (
        <CollapsibleSection
          title="مميزات الورشة"
          items={benefits}
          icon={<CheckCircle2 />}
          defaultOpen={true}
        />
      )}
      
      {requirements && requirements.length > 0 && (
        <CollapsibleSection
          title="متطلبات الورشة"
          items={requirements}
          icon={<ClipboardList />}
        />
      )}
      
      {targetAudience && targetAudience.length > 0 && (
        <CollapsibleSection
          title="الفئة المستهدفة"
          items={targetAudience}
          icon={<Users />}
        />
      )}
    </div>
  );
};

export default WorkshopDetailsSection;
