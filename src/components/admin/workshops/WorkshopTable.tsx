import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ClipboardList, FileText, Check, X } from "lucide-react";
import { Workshop } from "@/types/supabase";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface WorkshopTableProps {
  workshops: Workshop[];
  onView: (id: string) => void;
  onEdit: (workshop: Workshop) => void;
  onDelete: (workshop: Workshop) => void;
  onViewRegistrations?: (workshop: Workshop) => void;
  onManageMaterials?: (workshop: Workshop) => void;
}

const WorkshopTable = ({
  workshops,
  onView,
  onEdit,
  onDelete,
  onViewRegistrations,
  onManageMaterials
}: WorkshopTableProps) => {
  const { toast } = useToast();
  const [updatingWorkshop, setUpdatingWorkshop] = useState<string | null>(null);

  const handleToggleRegistration = async (workshop: Workshop) => {
    try {
      setUpdatingWorkshop(workshop.id);
      
      const { error } = await supabase
        .from("workshops")
        .update({ registration_closed: !workshop.registration_closed })
        .eq("id", workshop.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "تم تحديث حالة التسجيل",
        description: workshop.registration_closed 
          ? "تم فتح التسجيل للورشة بنجاح" 
          : "تم إغلاق التسجيل للورشة بنجاح",
      });
      
      workshop.registration_closed = !workshop.registration_closed;
      
    } catch (error) {
      console.error("Error updating workshop registration status:", error);
      toast({
        title: "خطأ في تحديث حالة التسجيل",
        description: "حدث خطأ أثناء تحديث حالة التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setUpdatingWorkshop(null);
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              عنوان الورشة
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التاريخ
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المقاعد
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              السعر
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التسجيل
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {workshops.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                لا توجد ورش متاحة
              </td>
            </tr>
          ) : (
            workshops.map((workshop) => {
              const primaryDate = workshop.date ?? workshop.dates?.[0]?.date;
              const primaryTime = workshop.time ?? workshop.dates?.[0]?.time;

              return (
                <tr key={workshop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {workshop.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {primaryDate ? formatDate(primaryDate, "dd/MM/yyyy") : "—"} {primaryTime || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workshop.available_seats} / {workshop.total_seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workshop.price} KWD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Switch
                        checked={!workshop.registration_closed}
                        onCheckedChange={() => handleToggleRegistration(workshop)}
                        disabled={updatingWorkshop === workshop.id}
                      />
                      <span className="mr-2">
                        {workshop.registration_closed ? 'مغلق' : 'مفتوح'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => onView(workshop.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(workshop)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(workshop)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {onViewRegistrations && (
                      <Button variant="ghost" size="icon" onClick={() => onViewRegistrations(workshop)}>
                        <ClipboardList className="w-4 h-4" />
                      </Button>
                    )}
                    {onManageMaterials && (
                      <Button variant="ghost" size="icon" onClick={() => onManageMaterials(workshop)}>
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkshopTable;
