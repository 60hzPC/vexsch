import { useState } from "react";
import { StatCard } from "./StatCard";
import { DataCard } from "./DataCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Instructor, Course, Room, Program } from "./types";

interface DashboardProps {
  instructors: Instructor[];
  courses: Course[];
  rooms: Room[];
  programs: Program[];
  isLoading?: boolean;
}

type ListType = 'instructors' | 'courses' | 'rooms' | 'programs';

export function Dashboard({ instructors, courses, rooms, programs, isLoading }: DashboardProps) {
  const [activeList, setActiveList] = useState<ListType>('instructors');

  const data = {
    instructors,
    courses,
    rooms,
    programs,
  };

  const renderListItem = (item: any, type: ListType) => {
    switch (type) {
      case 'instructors':
        return (
          <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-muted-foreground">{item.subject}</div>
          </div>
        );
      case 'courses':
        return (
          <div>
            <div className="font-semibold">{item.code} - {item.name}</div>
            {item.credits && <div className="text-sm text-muted-foreground">{item.credits} credits</div>}
          </div>
        );
      case 'rooms':
        return (
          <div>
            <div className="font-semibold">{item.name}</div>
            {item.capacity && <div className="text-sm text-muted-foreground">Capacity: {item.capacity}</div>}
          </div>
        );
      case 'programs':
        return (
          <div>
            <div className="font-semibold">{item.name}</div>
            {item.department && <div className="text-sm text-muted-foreground">{item.department}</div>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="👨‍🏫" title="Instructors" value={instructors.length} variant="primary" />
        <StatCard icon="🏫" title="Rooms" value={rooms.length} variant="accent" />
        <StatCard icon="🎓" title="Programs" value={programs.length} variant="success" />
        <StatCard icon="📚" title="Courses" value={courses.length} variant="default" />
      </div>

      {/* Data Overview */}
      <Card className="p-6 bg-gradient-secondary border-0 shadow-card">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Data Overview</h2>
        
        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['instructors', 'courses', 'rooms', 'programs'] as ListType[]).map((type) => (
            <Button
              key={type}
              variant={activeList === type ? "default" : "outline"}
              onClick={() => setActiveList(type)}
              className={
                activeList === type 
                  ? "bg-gradient-primary border-0 text-white shadow-card hover:shadow-glow" 
                  : "border-primary/20 hover:bg-primary/10"
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* Data List */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {data[activeList].length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No {activeList} added yet. Start by adding some data.
            </div>
          ) : (
            data[activeList].map((item) => (
              <DataCard key={item.id}>
                {renderListItem(item, activeList)}
              </DataCard>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}