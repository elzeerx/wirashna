
import React from "react";
import { Button } from "@/components/ui/button";

interface GoogleSignInButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

export const GoogleSignInButton = ({
  onClick,
  isLoading,
}: GoogleSignInButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></span>
          جاري المعالجة...
        </span>
      ) : (
        <>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google_standard_ios.svg" 
            alt="Google logo" 
            className="h-5 w-5"
          />
          <span>تسجيل الدخول بواسطة Google</span>
        </>
      )}
    </Button>
  );
};
