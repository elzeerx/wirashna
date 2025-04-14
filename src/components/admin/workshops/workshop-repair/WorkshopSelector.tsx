
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Workshop } from "@/types/supabase";

interface WorkshopSelectorProps {
  workshops: Workshop[];
  selectedWorkshopId: string;
  setSelectedWorkshopId: (id: string) => void;
  isLoading: boolean;
  workshopId?: string;
  autoCleanup: boolean;
  setAutoCleanup: (value: boolean) => void;
}

const WorkshopSelector = ({
  workshops,
  selectedWorkshopId,
  setSelectedWorkshopId,
  isLoading,
  workshopId,
  autoCleanup,
  setAutoCleanup
}: WorkshopSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workshop-select">اختر ورشة</Label>
        <Select
          value={selectedWorkshopId}
          onValueChange={setSelectedWorkshopId}
          disabled={isLoading || !!workshopId} // Disable if loading or if workshopId was provided in props
        >
          <SelectTrigger id="workshop-select">
            <SelectValue placeholder="اختر ورشة لإصلاحها" />
          </SelectTrigger>
          <SelectContent>
            {workshops.map((workshop) => (
              <SelectItem key={workshop.id} value={workshop.id}>
                {workshop.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 space-x-reverse">
        <Checkbox
          id="auto-recalculate"
          checked={autoCleanup}
          onCheckedChange={(checked) => setAutoCleanup(checked as boolean)}
        />
        <Label htmlFor="auto-recalculate">إعادة حساب المقاعد تلقائياً بعد تنظيف التسجيلات</Label>
      </div>
    </div>
  );
};

export default WorkshopSelector;
