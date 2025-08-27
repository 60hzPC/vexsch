export interface Instructor {
  id: string;
  name: string;
  subject: string;
  email?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits?: number;
}

export interface Room {
  id: string;
  name: string;
  capacity?: number;
  type?: string;
}

export interface Program {
  id: string;
  name: string;
  department?: string;
}

export interface ExamSlot {
  id: string;
  course: Course;
  instructor: Instructor;
  room: Room;
  program: Program;
  timeSlot: string;
  day: number;
  duration?: number;
}

export interface ScheduleData {
  [day: number]: {
    [timeSlot: string]: ExamSlot[];
  };
}

export const TIME_SLOTS = [
  '8:00-9:00 AM',
  '9:00-10:00 AM', 
  '10:00-11:00 AM',
  '11:00-12:00 PM',
  'LUNCH BREAK',
  '1:00-2:00 PM',
  '2:00-3:00 PM',
  '3:00-4:00 PM',
  '4:00-5:00 PM'
];