import { cn } from "@/lib/utils";
import { Calendar, Users, BookOpen, Building, GraduationCap, LayoutDashboard } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'instructors', label: 'Instructors', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'rooms', label: 'Rooms', icon: Building },
  { id: 'programs', label: 'Programs', icon: GraduationCap },
  { id: 'schedule', label: 'Generate Schedule', icon: Calendar },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-gradient-primary shadow-elevated text-white fixed left-0 top-0 z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-8 w-8" />
          <h1 className="text-xl font-bold">Exam Scheduler Pro</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                  activeSection === item.id
                    ? "bg-white/20 shadow-glow"
                    : "hover:bg-white/10 hover:translate-x-1"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}