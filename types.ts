export enum View {
  Dashboard = 'DASHBOARD',
  AddSubject = 'ADD_SUBJECT',
  Calendar = 'CALENDAR',
  EditSubject = 'EDIT_SUBJECT',
}

export enum AttendanceStatus {
  Present = 'PRESENT',
  Absent = 'ABSENT',
  Cancelled = 'CANCELLED',
}

export enum DayOfWeek {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
}

export interface ClassSchedule {
  day: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Subject {
  id: string;
  name:string;
  createdAt: number;
  schedule: ClassSchedule[];
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
}