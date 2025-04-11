
import React from "react";
import { Workshop } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Users, FileText } from "lucide-react";

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
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">الصورة</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الوقت</TableHead>
            <TableHead>المكان</TableHead>
            <TableHead>المقاعد المتاحة</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workshops.map((workshop) => (
            <TableRow key={workshop.id}>
              <TableCell>
                {workshop.image ? (
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    لا توجد صورة
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{workshop.title}</TableCell>
              <TableCell>{workshop.date}</TableCell>
              <TableCell>{workshop.time}</TableCell>
              <TableCell>{workshop.venue}</TableCell>
              <TableCell>
                {workshop.available_seats} / {workshop.total_seats}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(workshop.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(workshop)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => onDelete(workshop)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  {onViewRegistrations && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-500"
                      onClick={() => onViewRegistrations(workshop)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onManageMaterials && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-500"
                      onClick={() => onManageMaterials(workshop)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {workshops.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                لا توجد ورش متاحة حالياً
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkshopTable;
