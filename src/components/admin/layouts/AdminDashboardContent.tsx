
import React from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminSidebar } from "./AdminSidebar";

interface AdminDashboardContentProps {
  children: React.ReactNode;
}

export const AdminDashboardContent = ({ children }: AdminDashboardContentProps) => {
  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="pt-20 md:pr-64 flex-1">{children}</main>
      </div>
    </MainLayout>
  );
};
