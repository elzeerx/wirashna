
import { memo, useCallback } from "react";
import { Workshop } from "@/types/supabase";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useElementSize } from "@/hooks/useElementSize";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VirtualizedWorkshopTableProps {
  workshops: Workshop[];
  onEdit: (workshop: Workshop) => void;
  onDelete: (workshop: Workshop) => void;
  onSelect: (workshop: Workshop) => void;
}

const VirtualizedWorkshopTable = memo(({
  workshops,
  onEdit,
  onDelete,
  onSelect
}: VirtualizedWorkshopTableProps) => {
  const [parentRef, { width, height }] = useElementSize();
  
  const rowVirtualizer = useVirtualizer({
    count: workshops.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // approximate row height
    overscan: 5
  });

  // Memoize handlers to prevent recreation on each render
  const handleEdit = useCallback((workshop: Workshop) => {
    onEdit(workshop);
  }, [onEdit]);

  const handleDelete = useCallback((workshop: Workshop) => {
    onDelete(workshop);
  }, [onDelete]);

  const handleSelect = useCallback((workshop: Workshop) => {
    onSelect(workshop);
  }, [onSelect]);

  return (
    <div 
      ref={parentRef} 
      className="overflow-auto border rounded-md"
      style={{ height: 'calc(100vh - 300px)', width: '100%' }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>عنوان الورشة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>المشاركين</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const workshop = workshops[virtualRow.index];
              return (
                <TableRow
                  key={workshop.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TableCell className="font-medium">{workshop.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
                      {workshop.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="ml-2 h-4 w-4 text-gray-500" />
                      {workshop.total_seats - workshop.available_seats}/{workshop.total_seats}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="ml-2 h-4 w-4 text-gray-500" />
                      {workshop.price} د.ك
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSelect(workshop)}
                      >
                        التسجيلات
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(workshop)}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleDelete(workshop)}
                      >
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </div>
        </TableBody>
      </Table>
    </div>
  );
});

VirtualizedWorkshopTable.displayName = 'VirtualizedWorkshopTable';

export default VirtualizedWorkshopTable;
