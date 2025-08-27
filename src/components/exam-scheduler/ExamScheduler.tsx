import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { AddItemForm } from "./AddItemForm";
import { DataCard } from "./DataCard";
import { ScheduleGeneration } from "./ScheduleGeneration";
import { Instructor, Course, Room, Program } from "./types";
import { Card } from "@/components/ui/card";
import { useInstructors, useAddInstructor, useDeleteInstructor } from '@/hooks/useInstructors';
import { useCourses, useAddCourse, useDeleteCourse } from '@/hooks/useCourses';
import { useRooms, useAddRoom, useDeleteRoom } from '@/hooks/useRooms';
import { usePrograms, useAddProgram, useDeleteProgram } from '@/hooks/usePrograms';

export function ExamScheduler() {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Database queries
  const { data: instructors = [], isLoading: instructorsLoading } = useInstructors();
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  
  // Mutations
  const addInstructorMutation = useAddInstructor();
  const deleteInstructorMutation = useDeleteInstructor();
  const addCourseMutation = useAddCourse();
  const deleteCourseMutation = useDeleteCourse();
  const addRoomMutation = useAddRoom();
  const deleteRoomMutation = useDeleteRoom();
  const addProgramMutation = useAddProgram();
  const deleteProgramMutation = useDeleteProgram();
  
  const isLoading = instructorsLoading || coursesLoading || roomsLoading || programsLoading;

  const addInstructor = (data: Record<string, string>) => {
    addInstructorMutation.mutate({
      name: data.name,
      subject: data.subject,
      email: data.email || undefined,
    });
  };

  const addCourse = (data: Record<string, string>) => {
    addCourseMutation.mutate({
      name: data.name,
      code: data.code,
      credits: data.credits ? parseInt(data.credits) : undefined,
    });
  };

  const addRoom = (data: Record<string, string>) => {
    addRoomMutation.mutate({
      name: data.name,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
      type: data.type || undefined,
    });
  };

  const addProgram = (data: Record<string, string>) => {
    addProgramMutation.mutate({
      name: data.name,
      department: data.department || undefined,
    });
  };

  const removeInstructor = (id: string) => {
    deleteInstructorMutation.mutate(id);
  };

  const removeCourse = (id: string) => {
    deleteCourseMutation.mutate(id);
  };

  const removeRoom = (id: string) => {
    deleteRoomMutation.mutate(id);
  };

  const removeProgram = (id: string) => {
    deleteProgramMutation.mutate(id);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            instructors={instructors}
            courses={courses}
            rooms={rooms}
            programs={programs}
            isLoading={isLoading}
          />
        );
        
      case 'instructors':
        return (
          <div className="space-y-6">
            <AddItemForm
              title="👨‍🏫 Instructors"
              icon="👨‍🏫"
              fields={[
                { name: 'name', placeholder: 'Instructor Name' },
                { name: 'subject', placeholder: 'Subject Specialization' },
                { name: 'email', placeholder: 'Email Address' }
              ]}
              onSubmit={addInstructor}
            />
            
            <Card className="p-6 bg-white border-0 shadow-card">
              <h3 className="text-xl font-bold mb-4 text-foreground">Current Instructors</h3>
              <div className="space-y-3">
                {instructors.map(instructor => (
                  <DataCard key={instructor.id} onDelete={() => removeInstructor(instructor.id)}>
                    <div>
                      <div className="font-semibold">{instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{instructor.subject}</div>
                      {instructor.email && (
                        <div className="text-xs text-muted-foreground">{instructor.email}</div>
                      )}
                    </div>
                  </DataCard>
                ))}
              </div>
            </Card>
          </div>
        );
        
      case 'courses':
        return (
          <div className="space-y-6">
            <AddItemForm
              title="📚 Courses"
              icon="📚"
              fields={[
                { name: 'name', placeholder: 'Course Name' },
                { name: 'code', placeholder: 'Course Code' },
                { name: 'credits', placeholder: 'Credits', type: 'number' }
              ]}
              onSubmit={addCourse}
            />
            
            <Card className="p-6 bg-white border-0 shadow-card">
              <h3 className="text-xl font-bold mb-4 text-foreground">Current Courses</h3>
              <div className="space-y-3">
                {courses.map(course => (
                  <DataCard key={course.id} onDelete={() => removeCourse(course.id)}>
                    <div>
                      <div className="font-semibold">{course.code} - {course.name}</div>
                      {course.credits && (
                        <div className="text-sm text-muted-foreground">{course.credits} credits</div>
                      )}
                    </div>
                  </DataCard>
                ))}
              </div>
            </Card>
          </div>
        );
        
      case 'rooms':
        return (
          <div className="space-y-6">
            <AddItemForm
              title="🏫 Rooms"
              icon="🏫"
              fields={[
                { name: 'name', placeholder: 'Room Name' },
                { name: 'capacity', placeholder: 'Capacity', type: 'number' },
                { name: 'type', placeholder: 'Room Type' }
              ]}
              onSubmit={addRoom}
            />
            
            <Card className="p-6 bg-white border-0 shadow-card">
              <h3 className="text-xl font-bold mb-4 text-foreground">Current Rooms</h3>
              <div className="space-y-3">
                {rooms.map(room => (
                  <DataCard key={room.id} onDelete={() => removeRoom(room.id)}>
                    <div>
                      <div className="font-semibold">{room.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {room.capacity && `Capacity: ${room.capacity}`}
                        {room.capacity && room.type && ' • '}
                        {room.type}
                      </div>
                    </div>
                  </DataCard>
                ))}
              </div>
            </Card>
          </div>
        );
        
      case 'programs':
        return (
          <div className="space-y-6">
            <AddItemForm
              title="🎓 Programs"
              icon="🎓"
              fields={[
                { name: 'name', placeholder: 'Program Name' },
                { name: 'department', placeholder: 'Department' }
              ]}
              onSubmit={addProgram}
            />
            
            <Card className="p-6 bg-white border-0 shadow-card">
              <h3 className="text-xl font-bold mb-4 text-foreground">Current Programs</h3>
              <div className="space-y-3">
                {programs.map(program => (
                  <DataCard key={program.id} onDelete={() => removeProgram(program.id)}>
                    <div>
                      <div className="font-semibold">{program.name}</div>
                      {program.department && (
                        <div className="text-sm text-muted-foreground">{program.department}</div>
                      )}
                    </div>
                  </DataCard>
                ))}
              </div>
            </Card>
          </div>
        );
        
      case 'schedule':
        return (
          <ScheduleGeneration
            instructors={instructors}
            courses={courses}
            rooms={rooms}
            programs={programs}
            isLoading={isLoading}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
}