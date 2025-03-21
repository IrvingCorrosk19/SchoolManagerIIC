// Define types for your Firebase data models

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'parent' | 'director' | 'admin';
  status: 'active' | 'inactive';
  subject?: string[];
  grade?: string;
  studentId?: number;
  groups?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  schedule?: 'Mañana' | 'Tarde' | 'Noche';
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  teacherId: string;
  trimester: '1T' | '2T' | '3T';
  value: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  name: string;
  type: 'tarea' | 'parcial' | 'examen';
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  groups?: string[];
  schedule?: 'Mañana' | 'Tarde' | 'Noche';
  performance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  grade: string;
  students: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  time: string;
  type: 'citation' | 'comment';
  description: string;
  status: 'pending' | 'resolved' | 'escalated';
  createdAt: Date;
  updatedAt: Date;
}