
import React, { useState } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminSidebar } from "./AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const AdminDashboardLayout = ({ children, isLoading = false }: AdminDashboardLayoutProps) => {
  if (isLoading) {
    return (
      <SidebarProvider>
        <MainLayout>
          <div className="wirashna-container py-12 flex justify-center items-center">
            <div className="wirashna-loader"></div>
          </div>
        </MainLayout>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <MainLayout>
        <div className="flex min-h-[calc(100vh-4rem)]">
          <AdminSidebar />
          <main className="flex-1 p-6 lg:pr-64">
            {children}
          </main>
        </div>
      </MainLayout>
    </SidebarProvider>
  );
};

export default AdminDashboardLayout;
