export type UserRole = 'Admin' | 'HR' | 'Employee';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  employeeId?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  address: string;
  dateOfBirth: string;
  emergencyContact: string;
  managerId?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Sick' | 'Casual' | 'Vacation' | 'Personal';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day';
  hoursWorked: number;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  generatedDate: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewDate: string;
  period: string;
  rating: number;
  technicalSkills: number;
  communication: number;
  teamwork: number;
  punctuality: number;
  comments: string;
  goals: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  task: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  completedDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  attachments?: string[];
}

export interface TimeLog {
  id: string;
  employeeId: string;
  employeeName: string;
  project: string;
  task: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  date: string;
  description: string;
  billable: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'Meeting' | 'Holiday' | 'Leave' | 'Training' | 'Event';
  startDate: string;
  endDate: string;
  allDay: boolean;
  participants?: string[];
  location?: string;
  color: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: 'Policy' | 'Form' | 'Report' | 'Contract' | 'Other';
  uploadedBy: string;
  uploadedById: string;
  uploadDate: string;
  size: number; // in KB
  department: string;
  description: string;
  accessLevel: 'Public' | 'Department' | 'Restricted';
  url: string;
}

export interface Department {
  id: string;
  name: string;
  headId?: string;
  headName?: string;
  employeeCount: number;
  budget: number;
  description: string;
  parentDepartmentId?: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  type: 'Individual' | 'Team' | 'Company';
  category: 'Performance' | 'Learning' | 'Project' | 'Sales' | 'Other';
  targetDate: string;
  progress: number; // 0-100
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled';
  keyResults: KeyResult[];
  createdAt: string;
  updatedAt: string;
}

export interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'Public' | 'Optional' | 'Company';
  description: string;
}