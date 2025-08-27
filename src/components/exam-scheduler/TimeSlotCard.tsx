import { Card } from "@/components/ui/card";
import { ExamSlot } from "./types";
import { cn } from "@/lib/utils";
import { Clock, Users, MapPin, GraduationCap } from "lucide-react";

interface TimeSlotCardProps {
  timeSlot: string;
  exams: ExamSlot[];
  isLunchBreak?: boolean;
}

export function TimeSlotCard({ timeSlot, exams, isLunchBreak }: TimeSlotCardProps) {
  if (isLunchBreak) {
    return (
      <Card className="p-6 bg-gradient-accent border-0 shadow-card text-center">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5" />
          {timeSlot}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-4 border-0 shadow-card min-h-[120px] transition-all duration-300",
      exams.length > 0 
        ? "bg-gradient-primary text-white shadow-glow hover:shadow-elevated" 
        : "bg-muted/30 hover:bg-muted/50"
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4" />
        <span className="font-semibold">{timeSlot}</span>
      </div>
      
      {exams.length > 0 ? (
        <div className="space-y-3">
          {exams.map((exam, index) => (
            <div key={exam.id} className={cn("space-y-1", index > 0 && "pt-3 border-t border-white/20")}>
              <div className="font-semibold text-sm flex items-center gap-2">
                📚 {exam.course.code} - {exam.course.name}
              </div>
              <div className="text-xs opacity-90 space-y-1">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {exam.instructor.name}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {exam.room.name}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {exam.program.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm italic">No exams scheduled</div>
      )}
    </Card>
  );
}