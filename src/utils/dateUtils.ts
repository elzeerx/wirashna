
export const formatTimeWithPeriod = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  
  // Configure Arabic locale with proper formatting
  return date.toLocaleTimeString('ar-EG', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
};

export const calculateEndTime = (startTime: string, durationHours: number): Date => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);
  return addHours(date, durationHours);
};
