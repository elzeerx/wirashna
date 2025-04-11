
import { Workshop } from "@/types/supabase";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye, Users } from "lucide-react";

interface WorkshopTableProps {
  workshops: Workshop[];
  onView: (id: string) => void;
  onEdit: (workshop: Workshop) => void;
  onDelete: (workshop: Workshop) => void;
  onViewRegistrations?: (workshop: Workshop) => void;
}

const WorkshopTable = ({ 
  workshops, 
  onView, 
  onEdit, 
  onDelete,
  onViewRegistrations 
}: WorkshopTableProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>العنوان</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>المكان</TableHead>
            <TableHead>المقاعد</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workshops.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                لا توجد ورش لعرضها
              </TableCell>
            </TableRow>
          ) : (
            workshops.map((workshop) => (
              <TableRow key={workshop.id}>
                <TableCell className="font-medium">{workshop.title}</TableCell>
                <TableCell>{workshop.date}</TableCell>
                <TableCell>{workshop.venue}</TableCell>
                <TableCell>
                  {workshop.available_seats}/{workshop.total_seats}
                </TableCell>
                <TableCell>{workshop.price} د.ك</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(workshop.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => onEdit(workshop)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => onDelete(workshop)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                    
                    {onViewRegistrations && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewRegistrations(workshop)}
                        title="عرض التسجيلات"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    )}
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
