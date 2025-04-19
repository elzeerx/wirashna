
import React from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";

export const AdminDashboardLoading = () => {
  return (
    <MainLayout>
      <div className="pt-20 flex justify-center items-center">
        <div className="wirashna-loader"></div>
      </div>
    </MainLayout>
  );
};
