import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { AddItemForm } from "./AddItemForm";
import { DataCard } from "./DataCard";
import { ScheduleGeneration } from "./ScheduleGeneration";
import { Instructor, Course, Room, Program } from "./types";
import { Card } from "@/components/ui/card";

export function ExamScheduler() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [instructors, setInstructors] = useState<Instructor[]>([
    { id: '1', name: 'Dr. Smith', subject: 'Mathematics', email: 'smith@university.edu' },
    { id: '2', name: 'Prof. Johnson', subject: 'Physics', email: 'johnson@university.edu' },
    { id: '3', name: 'Ms. Davis', subject: 'Chemistry', email: 'davis@university.edu' },
    { id: '4', name: 'Mr. Wilson', subject: 'Computer Science', email: 'wilson@university.edu' },
    { id: '5', name: 'Dr. Brown', subject: 'Biology', email: 'brown@university.edu' }
  ]);
  
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Advanced Mathematics', code: 'MATH301', credits: 3 },
    { id: '2', name: 'Physics Fundamentals', code: 'PHYS101', credits: 4 },
    { id: '3', name: 'Organic Chemistry', code: 'CHEM201', credits: 3 },
    { id: '4', name: 'Data Structures', code: 'CS202', credits: 3 },
    { id: '5', name: 'Cell Biology', code: 'BIO301', credits: 3 },
    { id: '6', name: 'Statistics', code: 'STAT201', credits: 3 }
  ]);
  
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: 'Room 101', capacity: 30, type: 'Lecture Hall' },
    { id: '2', name: 'Lab A', capacity: 20, type: 'Laboratory' },
    { id: '3', name: 'Auditorium', capacity: 150, type: 'Auditorium' }
  ]);
  
  const [programs, setPrograms] = useState<Program[]>([
    { id: '1', name: 'Computer Science', department: 'Engineering' },
    { id: '2', name: 'Engineering', department: 'Engineering' },
    { id: '3', name: 'Biology', department: 'Sciences' }
  ]);

  const addInstructor = (data: Record<string, string>) => {
    const newInstructor: Instructor = {
      id: Date.now().toString(),
      name: data.name,
      subject: data.subject,
      email: data.email || undefined,
    };
    setInstructors(prev => [...prev, newInstructor]);
  };

  const addCourse = (data: Record<string, string>) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: data.name,
      code: data.code,
      credits: data.credits ? parseInt(data.credits) : undefined,
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const addRoom = (data: Record<string, string>) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: data.name,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
      type: data.type || undefined,
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const addProgram = (data: Record<string, string>) => {
    const newProgram: Program = {
      id: Date.now().toString(),
      name: data.name,
      department: data.department || undefined,
    };
    setPrograms(prev => [...prev, newProgram]);
  };

  const removeInstructor = (id: string) => {
    setInstructors(prev => prev.filter(item => item.id !== id));
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(item => item.id !== id));
  };

  const removeRoom = (id: string) => {
    setRooms(prev => prev.filter(item => item.id !== id));
  };

  const removeProgram = (id: string) => {
    setPrograms(prev => prev.filter(item => item.id !== id));
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