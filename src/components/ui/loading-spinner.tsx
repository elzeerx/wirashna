
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className = '' }: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <div className="wirashna-loader"></div>
    </div>
  );
};

