
export const formatTimeWithPeriod = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  
  return date.toLocaleTimeString('ar-SA', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
};
