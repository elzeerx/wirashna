
import { useState, useEffect, useMemo } from "react";
import { WorkshopRegistration } from "@/types/supabase";

export const useRegistrationsFilters = (registrations: WorkshopRegistration[]) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize filtered registrations to avoid recalculation on every render
  const filteredRegistrations = useMemo(() => {
    let result = [...registrations];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(reg => reg.status === statusFilter);
    }
    
    // Apply payment status filter
    if (paymentStatusFilter !== "all") {
      result = result.filter(reg => reg.payment_status === paymentStatusFilter);
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        reg =>
          reg.full_name.toLowerCase().includes(query) ||
          reg.email.toLowerCase().includes(query) ||
          (reg.phone && reg.phone.includes(query))
      );
    }
    
    return result;
  }, [registrations, statusFilter, paymentStatusFilter, searchQuery]);

  const resetFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setSearchQuery("");
  };

  return {
    filteredRegistrations,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    searchQuery,
    setSearchQuery,
    resetFilters
  };
};
