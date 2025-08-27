import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TimeSlotCard } from "./TimeSlotCard";
import { StatCard } from "./StatCard";
import { Instructor, Course, Room, Program, ExamSlot, ScheduleData, TIME_SLOTS } from "./types";
import { Download, Calendar, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleGenerationProps {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  programs: Program[];
}

export function ScheduleGeneration({ instructors, courses, rooms, programs }: ScheduleGenerationProps) {
  const [schedule, setSchedule] = useState<ScheduleData>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const generateSchedule = async () => {
    if (instructors.length === 0 || courses.length === 0 || rooms.length === 0) {
      toast({
        title: "Missing Data",
        description: "Please add at least one instructor, course, and room before generating schedule.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const generatedSchedule: ScheduleData = {};
    const examSlots: ExamSlot[] = [];
    let instructorAssignments: Record<string, string[]> = {};
    
    // Initialize schedule structure
    for (let day = 1; day <= 2; day++) {
      generatedSchedule[day] = {};
      TIME_SLOTS.forEach(slot => {
        if (slot !== 'LUNCH BREAK') {
          generatedSchedule[day][slot] = [];
        }
      });
    }

    // Shuffle courses for random assignment
    const shuffledCourses = [...courses].sort(() => Math.random() - 0.5);
    let courseIndex = 0;

    // Generate schedule
    for (let day = 1; day <= 2; day++) {
      TIME_SLOTS.forEach(slot => {
        if (slot === 'LUNCH BREAK') return;
        
        rooms.forEach(room => {
          if (courseIndex >= shuffledCourses.length) return;
          
          const course = shuffledCourses[courseIndex];
          
          // Find eligible instructors (not teaching their own subject at this time)
          const eligibleInstructors = instructors.filter(inst => {
            const instructorSubject = inst.subject.toLowerCase();
            const courseName = course.name.toLowerCase();
            const courseCode = course.code.toLowerCase();
            
            // Check if instructor specializes in this subject (avoid conflict)
            const isOwnSubject = courseName.includes(instructorSubject) || 
                               courseCode.includes(instructorSubject) ||
                               instructorSubject.includes(courseName.split(' ')[0]);
            
            // Check availability
            const assignmentKey = `${day}-${slot}`;
            const isAvailable = !instructorAssignments[inst.id] || 
                              !instructorAssignments[inst.id].includes(assignmentKey);
            
            return !isOwnSubject && isAvailable;
          });

          if (eligibleInstructors.length > 0) {
            // Select instructor with least assignments for balance
            const selectedInstructor = eligibleInstructors.sort((a, b) => {
              const aCount = instructorAssignments[a.id] ? instructorAssignments[a.id].length : 0;
              const bCount = instructorAssignments[b.id] ? instructorAssignments[b.id].length : 0;
              return aCount - bCount;
            })[0];
            
            const selectedProgram = programs[Math.floor(Math.random() * programs.length)] || { id: 'general', name: 'General' };
            
            const examSlot: ExamSlot = {
              id: `${day}-${slot}-${room.id}-${course.id}`,
              course,
              instructor: selectedInstructor,
              room,
              program: selectedProgram,
              timeSlot: slot,
              day,
              duration: 60
            };
            
            generatedSchedule[day][slot].push(examSlot);
            examSlots.push(examSlot);
            
            // Track instructor assignments
            if (!instructorAssignments[selectedInstructor.id]) {
              instructorAssignments[selectedInstructor.id] = [];
            }
            instructorAssignments[selectedInstructor.id].push(`${day}-${slot}`);
            
            courseIndex++;
          }
        });
      });
    }

    // Calculate statistics
    const totalExams = examSlots.length;
    const totalSlots = (TIME_SLOTS.length - 1) * 2 * rooms.length; // Exclude lunch break
    const utilizationRate = ((totalExams / totalSlots) * 100);
    const assignedInstructors = Object.keys(instructorAssignments).length;
    const assignedRooms = new Set(examSlots.map(exam => exam.room.id)).size;

    setStats({
      totalExams,
      utilizationRate: utilizationRate.toFixed(1),
      assignedInstructors,
      assignedRooms,
    });

    setSchedule(generatedSchedule);
    setIsGenerating(false);
    
    toast({
      title: "Schedule Generated!",
      description: `Successfully scheduled ${totalExams} exams across 2 days.`,
    });
  };

  const clearSchedule = () => {
    setSchedule({});
    setStats(null);
    toast({
      title: "Schedule Cleared",
      description: "The exam schedule has been cleared.",
    });
  };

  const exportSchedule = () => {
    if (Object.keys(schedule).length === 0) {
      toast({
        title: "No Schedule",
        description: "Please generate a schedule first before exporting.",
        variant: "destructive",
      });
      return;
    }

    let exportData = 'EXAM SCHEDULE EXPORT\n\n';
    
    Object.keys(schedule).forEach(dayNum => {
      const day = parseInt(dayNum);
      exportData += `DAY ${day}\n${'='.repeat(50)}\n`;
      
      TIME_SLOTS.forEach(slot => {
        if (slot === 'LUNCH BREAK') {
          exportData += `\n${slot}\n\n`;
        } else {
          exportData += `${slot}:\n`;
          const exams = schedule[day][slot] || [];
          
          if (exams.length > 0) {
            exams.forEach(exam => {
              exportData += `  • ${exam.course.code} - ${exam.course.name}\n`;
              exportData += `    Instructor: ${exam.instructor.name}\n`;
              exportData += `    Room: ${exam.room.name}\n`;
              exportData += `    Program: ${exam.program.name}\n\n`;
            });
          } else {
            exportData += '  No exams scheduled\n\n';
          }
        }
      });
      exportData += '\n';
    });
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_schedule.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Schedule Exported",
      description: "Schedule has been downloaded as a text file.",
    });
  };

  const hasSchedule = Object.keys(schedule).length > 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-secondary border-0 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Generate Schedule</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={generateSchedule}
            disabled={isGenerating}
            className="bg-gradient-success border-0 hover:scale-105 transition-transform shadow-card hover:shadow-glow"
          >
            {isGenerating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Calendar className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Exam Schedule'}
          </Button>
          
          <Button 
            onClick={clearSchedule}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Schedule
          </Button>
          
          <Button 
            onClick={exportSchedule}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Schedule
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="📊" title="Total Exams" value={stats.totalExams} variant="primary" />
          <StatCard icon="📈" title="Utilization" value={parseFloat(stats.utilizationRate)} variant="accent" />
          <StatCard icon="👨‍🏫" title="Instructors Used" value={stats.assignedInstructors} variant="success" />
          <StatCard icon="🏫" title="Rooms Used" value={stats.assignedRooms} variant="default" />
        </div>
      )}

      {/* Schedule Display */}
      {hasSchedule && (
        <Card className="p-6 bg-white border-0 shadow-elevated">
          <h3 className="text-xl font-bold mb-6 text-foreground">Generated Exam Schedule</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map(day => (
              <div key={day} className="space-y-4">
                <div className="text-center p-4 bg-gradient-primary text-white rounded-lg shadow-card">
                  <h4 className="text-lg font-semibold">📅 Day {day}</h4>
                </div>
                
                <div className="space-y-3">
                  {TIME_SLOTS.map(slot => (
                    <TimeSlotCard
                      key={slot}
                      timeSlot={slot}
                      exams={schedule[day]?.[slot] || []}
                      isLunchBreak={slot === 'LUNCH BREAK'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}