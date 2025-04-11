
import { LogIn } from "lucide-react";
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
      className="w-full"
      onClick={onClick}
      disabled={isLoading}
    >
      <LogIn className="mr-2" size={18} />
      <span>تسجيل الدخول بواسطة جوجل</span>
    </Button>
  );
};
