
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDashboardLoading } from "./AdminDashboardLoading";
import { AdminDashboardContent } from "./AdminDashboardContent";

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const AdminDashboardLayout = ({ children, isLoading = false }: AdminDashboardLayoutProps) => {
  return (
    <SidebarProvider>
      {isLoading ? <AdminDashboardLoading /> : <AdminDashboardContent>{children}</AdminDashboardContent>}
    </SidebarProvider>
  );
};

export default AdminDashboardLayout;
