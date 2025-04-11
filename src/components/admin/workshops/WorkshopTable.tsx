
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Workshop } from "@/types/supabase";

interface WorkshopTableProps {
  workshops: Workshop[];
  onView: (id: string) => void;
  onEdit: (workshop: Workshop) => void;
  onDelete: (workshop: Workshop) => void;
}

const WorkshopTable = ({ workshops, onView, onEdit, onDelete }: WorkshopTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>عنوان الورشة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>المكان</TableHead>
            <TableHead>المقاعد المتاحة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workshops.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                لا توجد ورش حالياً. أضف ورشة جديدة لتظهر هنا.
              </TableCell>
            </TableRow>
          ) : (
            workshops.map((workshop) => (
              <TableRow key={workshop.id}>
                <TableCell className="font-medium">{workshop.title}</TableCell>
                <TableCell>{workshop.date}</TableCell>
                <TableCell>{workshop.venue}</TableCell>
                <TableCell>{workshop.available_seats}/{workshop.total_seats}</TableCell>
                <TableCell>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onView(workshop.id)}
                      title="عرض الورشة"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(workshop)}
                      title="تعديل الورشة"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(workshop)}
                      className="text-red-500 hover:text-red-700"
                      title="حذف الورشة"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkshopTable;
