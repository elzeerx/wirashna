
import { Separator } from "@/components/ui/separator";

export const AuthSeparator = () => {
  return (
    <div className="flex items-center gap-3 my-4">
      <Separator className="flex-grow" />
      <span className="text-muted-foreground text-sm">أو</span>
      <Separator className="flex-grow" />
    </div>
  );
};
