
import { useMemo } from 'react';
import { Workshop } from '@/types/supabase';

export function useMemoizedWorkshops(workshops: Workshop[]) {
  // Memoize upcoming workshops
  const upcomingWorkshops = useMemo(() => {
    const currentDate = new Date();
    return workshops
      .filter(workshop => {
        const workshopDate = new Date(workshop.date);
        return workshopDate >= currentDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [workshops]);

  // Memoize total statistics
  const statistics = useMemo(() => {
    const totalWorkshops = workshops.length;
    
    const confirmedParticipants = workshops.reduce((sum, workshop) => {
      const confirmedSeats = workshop.total_seats - workshop.available_seats;
      return sum + confirmedSeats;
    }, 0);
    
    const confirmedRevenue = workshops.reduce((sum, workshop) => {
      const confirmedSeats = workshop.total_seats - workshop.available_seats;
      return sum + (workshop.price * confirmedSeats);
    }, 0);
    
    const totalSeats = workshops.reduce((sum, w) => sum + w.total_seats, 0);
    const occupancyRate = totalSeats > 0 
      ? Math.round((confirmedParticipants / totalSeats) * 100)
      : 0;
      
    return {
      totalWorkshops,
      confirmedParticipants,
      confirmedRevenue,
      totalSeats,
      occupancyRate
    };
  }, [workshops]);

  // Memoize next workshops
  const nextWorkshops = useMemo(() => {
    return upcomingWorkshops.slice(0, 3);
  }, [upcomingWorkshops]);

  return {
    upcomingWorkshops,
    statistics,
    nextWorkshops
  };
}
