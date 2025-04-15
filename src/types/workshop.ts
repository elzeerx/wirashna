
export interface WorkshopDate {
  date: string;
  time: string;
  endTime: string;
  displayTime: string;
}

export interface WorkshopFormData extends Omit<Workshop, 'date' | 'time'> {
  dates: WorkshopDate[];
  tempDate: Date | null;
  tempTime: string;
  duration: string;
}
