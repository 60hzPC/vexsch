import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
}

export function DataCard({ children, onDelete, className }: DataCardProps) {
  return (
    <Card className={cn(
      "p-4 flex items-center justify-between bg-gradient-secondary border-0 shadow-card hover:shadow-elevated transition-all duration-300",
      className
    )}>
      <div className="flex-1">{children}</div>
      {onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="ml-4 h-8 w-8 p-0 bg-gradient-danger border-0 hover:scale-110 transition-transform"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}