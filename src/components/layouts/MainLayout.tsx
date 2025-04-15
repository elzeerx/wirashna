
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className = '' }: MainLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Navbar />
      <ErrorBoundary>
        <main className="flex-grow">
          {children}
        </main>
      </ErrorBoundary>
      <Footer />
    </div>
  );
};

