import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  title: string;
  value: number;
  variant?: 'default' | 'primary' | 'accent' | 'success';
  className?: string;
}

const variantStyles = {
  default: 'bg-gradient-primary shadow-card',
  primary: 'bg-gradient-primary shadow-glow',
  accent: 'bg-gradient-accent shadow-card',
  success: 'bg-gradient-success shadow-card',
};

export function StatCard({ icon, title, value, variant = 'default', className }: StatCardProps) {
  return (
    <Card className={cn(
      "p-6 border-0 text-white transition-all duration-300 hover:scale-105 hover:shadow-elevated",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-white/80 text-sm uppercase tracking-wide">{title}</p>
        </div>
      </div>
    </Card>
  );
}