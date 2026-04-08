import { 
  User, 
  Employee, 
  LeaveRequest, 
  AttendanceRecord, 
  SalarySlip, 
  PerformanceReview, 
  Notification,
  OnboardingTask,
  Announcement,
  TimeLog,
  CalendarEvent,
  Document,
  Department,
  Goal,
  Holiday
} from '../types';

// Initial mock users
const initialUsers: User[] = [
  { id: '1', email: 'admin@company.com', password: 'admin123', role: 'Admin', employeeId: '1' },
  { id: '2', email: 'hr@company.com', password: 'hr123', role: 'HR', employeeId: '2' },
  { id: '3', email: 'john.doe@company.com', password: 'emp123', role: 'Employee', employeeId: '3' },
  { id: '4', email: 'jane.smith@company.com', password: 'emp123', role: 'Employee', employeeId: '4' },
  { id: '5', email: 'mike.wilson@company.com', password: 'emp123', role: 'Employee', employeeId: '5' },
];

// Initial mock employees
const initialEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    phone: '+1-555-0100',
    department: 'Management',
    position: 'System Administrator',
    salary: 120000,
    joinDate: '2020-01-15',
    role: 'Admin',
    status: 'Active',
    address: '123 Admin St, Tech City, TC 12345',
    dateOfBirth: '1985-03-20',
    emergencyContact: '+1-555-0101',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'hr@company.com',
    phone: '+1-555-0200',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 90000,
    joinDate: '2020-06-01',
    role: 'HR',
    status: 'Active',
    address: '456 HR Ave, Tech City, TC 12345',
    dateOfBirth: '1988-07-15',
    emergencyContact: '+1-555-0201',
  },
  {
    id: '3',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0300',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    salary: 95000,
    joinDate: '2021-03-15',
    role: 'Employee',
    status: 'Active',
    address: '789 Dev Rd, Tech City, TC 12345',
    dateOfBirth: '1990-05-10',
    emergencyContact: '+1-555-0301',
    managerId: '1',
  },
  {
    id: '4',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-0400',
    department: 'Design',
    position: 'UX Designer',
    salary: 80000,
    joinDate: '2021-08-20',
    role: 'Employee',
    status: 'Active',
    address: '321 Design Ln, Tech City, TC 12345',
    dateOfBirth: '1992-11-25',
    emergencyContact: '+1-555-0401',
    managerId: '1',
  },
  {
    id: '5',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.wilson@company.com',
    phone: '+1-555-0500',
    department: 'Marketing',
    position: 'Marketing Specialist',
    salary: 70000,
    joinDate: '2022-01-10',
    role: 'Employee',
    status: 'Active',
    address: '654 Market Blvd, Tech City, TC 12345',
    dateOfBirth: '1993-02-14',
    emergencyContact: '+1-555-0501',
    managerId: '1',
  },
];

// Initial leave requests
const initialLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'John Doe',
    leaveType: 'Vacation',
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    days: 4,
    reason: 'Family vacation',
    status: 'Pending',
    appliedDate: '2026-04-05',
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Jane Smith',
    leaveType: 'Sick',
    startDate: '2026-04-10',
    endDate: '2026-04-11',
    days: 2,
    reason: 'Medical appointment',
    status: 'Approved',
    appliedDate: '2026-04-08',
    reviewedBy: '2',
    reviewedDate: '2026-04-09',
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Mike Wilson',
    leaveType: 'Personal',
    startDate: '2026-04-20',
    endDate: '2026-04-20',
    days: 1,
    reason: 'Personal matters',
    status: 'Rejected',
    appliedDate: '2026-04-06',
    reviewedBy: '2',
    reviewedDate: '2026-04-07',
  },
];

// Initial attendance records
const initialAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'John Doe',
    date: '2026-04-07',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present',
    hoursWorked: 9,
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Jane Smith',
    date: '2026-04-07',
    checkIn: '09:15',
    checkOut: '17:45',
    status: 'Late',
    hoursWorked: 8.5,
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Mike Wilson',
    date: '2026-04-07',
    checkIn: '08:45',
    checkOut: '17:30',
    status: 'Present',
    hoursWorked: 8.75,
  },
  {
    id: '4',
    employeeId: '3',
    employeeName: 'John Doe',
    date: '2026-04-06',
    checkIn: '09:05',
    checkOut: '18:10',
    status: 'Present',
    hoursWorked: 9.08,
  },
  {
    id: '5',
    employeeId: '4',
    employeeName: 'Jane Smith',
    date: '2026-04-06',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present',
    hoursWorked: 9,
  },
];

// Initial salary slips
const initialSalarySlips: SalarySlip[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'John Doe',
    month: 'March',
    year: 2026,
    basicSalary: 95000,
    allowances: 5000,
    deductions: 8000,
    netSalary: 92000,
    generatedDate: '2026-03-31',
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Jane Smith',
    month: 'March',
    year: 2026,
    basicSalary: 80000,
    allowances: 4000,
    deductions: 6800,
    netSalary: 77200,
    generatedDate: '2026-03-31',
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Mike Wilson',
    month: 'March',
    year: 2026,
    basicSalary: 70000,
    allowances: 3500,
    deductions: 5950,
    netSalary: 67550,
    generatedDate: '2026-03-31',
  },
];

// Initial performance reviews
const initialPerformanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'John Doe',
    reviewerId: '1',
    reviewerName: 'Admin User',
    reviewDate: '2026-03-15',
    period: 'Q1 2026',
    rating: 4.5,
    technicalSkills: 5,
    communication: 4,
    teamwork: 4.5,
    punctuality: 4.5,
    comments: 'Excellent technical skills and great team player. Consistently delivers high-quality work.',
    goals: 'Continue leading complex projects and mentoring junior developers.',
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Jane Smith',
    reviewerId: '2',
    reviewerName: 'Sarah Johnson',
    reviewDate: '2026-03-20',
    period: 'Q1 2026',
    rating: 4.2,
    technicalSkills: 4.5,
    communication: 4,
    teamwork: 4,
    punctuality: 4.5,
    comments: 'Strong design skills with creative solutions. Good collaboration with development team.',
    goals: 'Expand knowledge in user research and accessibility standards.',
  },
];

// Initial notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    userId: '3',
    title: 'Leave Request Pending',
    message: 'Your leave request for April 15-18 is pending approval.',
    type: 'info',
    read: false,
    createdAt: '2026-04-05T10:30:00Z',
  },
  {
    id: '2',
    userId: '4',
    title: 'Leave Request Approved',
    message: 'Your leave request for April 10-11 has been approved.',
    type: 'success',
    read: false,
    createdAt: '2026-04-09T14:20:00Z',
  },
  {
    id: '3',
    userId: '5',
    title: 'Leave Request Rejected',
    message: 'Your leave request for April 20 has been rejected. Please contact HR for details.',
    type: 'error',
    read: true,
    createdAt: '2026-04-07T11:15:00Z',
  },
];

// Initial onboarding tasks
const initialOnboardingTasks: OnboardingTask[] = [
  {
    id: '1',
    employeeId: '5',
    task: 'Complete Employee Handbook',
    description: 'Read and acknowledge the employee handbook',
    status: 'Completed',
    dueDate: '2022-01-15',
    completedDate: '2022-01-12',
  },
  {
    id: '2',
    employeeId: '5',
    task: 'IT Setup',
    description: 'Configure laptop and access credentials',
    status: 'Completed',
    dueDate: '2022-01-15',
    completedDate: '2022-01-10',
  },
  {
    id: '3',
    employeeId: '5',
    task: 'Team Introduction',
    description: 'Meet with team members and manager',
    status: 'Completed',
    dueDate: '2022-01-17',
    completedDate: '2022-01-11',
  },
];

// Initial announcements
const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Company Holiday Schedule',
    content: 'Please review the company holiday schedule for 2026. All major holidays and optional days have been listed. Make sure to plan your leaves accordingly.',
    author: 'Sarah Johnson',
    authorId: '2',
    department: 'All',
    priority: 'Medium',
    createdAt: '2026-01-01T09:00:00Z',
    updatedAt: '2026-01-01T09:00:00Z',
    pinned: true,
  },
  {
    id: '2',
    title: 'New Remote Work Policy',
    content: 'We are excited to announce our new flexible remote work policy. Employees can now work from home up to 2 days per week. Please coordinate with your manager.',
    author: 'Admin User',
    authorId: '1',
    department: 'All',
    priority: 'High',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
    pinned: true,
  },
  {
    id: '3',
    title: 'Team Building Event',
    content: 'Join us for our quarterly team building event on April 25th. Activities include lunch, games, and networking. RSVP by April 20th.',
    author: 'Sarah Johnson',
    authorId: '2',
    department: 'All',
    priority: 'Low',
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-01T09:00:00Z',
    pinned: false,
  },
];

// Initial time logs
const initialTimeLogs: TimeLog[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'John Doe',
    project: 'Project Alpha',
    task: 'Backend Development',
    startTime: '2026-04-08T09:00:00Z',
    endTime: '2026-04-08T13:00:00Z',
    duration: 240,
    date: '2026-04-08',
    description: 'Implemented user authentication module',
    billable: true,
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'John Doe',
    project: 'Project Alpha',
    task: 'Code Review',
    startTime: '2026-04-08T14:00:00Z',
    endTime: '2026-04-08T16:00:00Z',
    duration: 120,
    date: '2026-04-08',
    description: 'Reviewed pull requests from team members',
    billable: false,
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'Jane Smith',
    project: 'Website Redesign',
    task: 'UI Design',
    startTime: '2026-04-08T09:00:00Z',
    endTime: '2026-04-08T12:30:00Z',
    duration: 210,
    date: '2026-04-08',
    description: 'Created mockups for homepage redesign',
    billable: true,
  },
];

// Initial calendar events
const initialCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily standup meeting with the engineering team',
    type: 'Meeting',
    startDate: '2026-04-08T10:00:00Z',
    endDate: '2026-04-08T10:30:00Z',
    allDay: false,
    participants: ['1', '3'],
    location: 'Conference Room A',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Design Review',
    description: 'Review of new UI designs for mobile app',
    type: 'Meeting',
    startDate: '2026-04-10T14:00:00Z',
    endDate: '2026-04-10T15:30:00Z',
    allDay: false,
    participants: ['4', '1'],
    location: 'Design Studio',
    color: '#8b5cf6',
  },
  {
    id: '3',
    title: 'Independence Day',
    description: 'Public Holiday',
    type: 'Holiday',
    startDate: '2026-07-04',
    endDate: '2026-07-04',
    allDay: true,
    color: '#ef4444',
  },
  {
    id: '4',
    title: 'Team Building Event',
    description: 'Quarterly team building activities',
    type: 'Event',
    startDate: '2026-04-25T09:00:00Z',
    endDate: '2026-04-25T17:00:00Z',
    allDay: true,
    participants: ['1', '2', '3', '4', '5'],
    location: 'Outdoor Park',
    color: '#10b981',
  },
];

// Initial documents
const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'Employee Handbook 2026',
    type: 'pdf',
    category: 'Policy',
    uploadedBy: 'Sarah Johnson',
    uploadedById: '2',
    uploadDate: '2026-01-01',
    size: 2048,
    department: 'Human Resources',
    description: 'Complete employee handbook covering company policies, benefits, and procedures',
    accessLevel: 'Public',
    url: '#',
  },
  {
    id: '2',
    name: 'Remote Work Agreement',
    type: 'pdf',
    category: 'Form',
    uploadedBy: 'Sarah Johnson',
    uploadedById: '2',
    uploadDate: '2026-02-15',
    size: 512,
    department: 'Human Resources',
    description: 'Agreement form for remote work arrangements',
    accessLevel: 'Public',
    url: '#',
  },
  {
    id: '3',
    name: 'Q1 2026 Financial Report',
    type: 'pdf',
    category: 'Report',
    uploadedBy: 'Admin User',
    uploadedById: '1',
    uploadDate: '2026-04-01',
    size: 1536,
    department: 'Management',
    description: 'Quarterly financial performance report',
    accessLevel: 'Restricted',
    url: '#',
  },
  {
    id: '4',
    name: 'Employment Contract Template',
    type: 'docx',
    category: 'Contract',
    uploadedBy: 'Sarah Johnson',
    uploadedById: '2',
    uploadDate: '2026-01-15',
    size: 256,
    department: 'Human Resources',
    description: 'Standard employment contract template',
    accessLevel: 'Department',
    url: '#',
  },
];

// Initial departments
const initialDepartments: Department[] = [
  {
    id: '1',
    name: 'Management',
    headId: '1',
    headName: 'Admin User',
    employeeCount: 1,
    budget: 500000,
    description: 'Executive management and strategic planning',
  },
  {
    id: '2',
    name: 'Human Resources',
    headId: '2',
    headName: 'Sarah Johnson',
    employeeCount: 1,
    budget: 150000,
    description: 'Employee relations, recruitment, and HR policies',
  },
  {
    id: '3',
    name: 'Engineering',
    headId: '3',
    headName: 'John Doe',
    employeeCount: 1,
    budget: 800000,
    description: 'Software development and technical solutions',
  },
  {
    id: '4',
    name: 'Design',
    headId: '4',
    headName: 'Jane Smith',
    employeeCount: 1,
    budget: 200000,
    description: 'UX/UI design and creative services',
  },
  {
    id: '5',
    name: 'Marketing',
    headId: '5',
    headName: 'Mike Wilson',
    employeeCount: 1,
    budget: 300000,
    description: 'Marketing, PR, and brand management',
  },
];

// Initial goals
const initialGoals: Goal[] = [
  {
    id: '1',
    employeeId: '3',
    employeeName: 'John Doe',
    title: 'Complete Alpha Project on Time',
    description: 'Deliver all modules for Project Alpha by Q2 2026 with high code quality',
    type: 'Individual',
    category: 'Project',
    targetDate: '2026-06-30',
    progress: 65,
    status: 'In Progress',
    keyResults: [
      { id: 'kr1', description: 'Complete backend APIs', target: 20, current: 15, unit: 'APIs' },
      { id: 'kr2', description: 'Achieve 90% test coverage', target: 90, current: 75, unit: '%' },
      { id: 'kr3', description: 'Zero critical bugs', target: 0, current: 2, unit: 'bugs' },
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-04-08',
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Jane Smith',
    title: 'Redesign Company Website',
    description: 'Create modern, accessible, and mobile-first design for company website',
    type: 'Individual',
    category: 'Performance',
    targetDate: '2026-05-31',
    progress: 85,
    status: 'In Progress',
    keyResults: [
      { id: 'kr1', description: 'Complete all page mockups', target: 15, current: 15, unit: 'pages' },
      { id: 'kr2', description: 'User testing sessions', target: 10, current: 7, unit: 'sessions' },
      { id: 'kr3', description: 'WCAG AA compliance', target: 100, current: 90, unit: '%' },
    ],
    createdAt: '2026-02-01',
    updatedAt: '2026-04-08',
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Mike Wilson',
    title: 'Increase Social Media Engagement',
    description: 'Grow company social media presence and engagement rates',
    type: 'Individual',
    category: 'Sales',
    targetDate: '2026-12-31',
    progress: 40,
    status: 'In Progress',
    keyResults: [
      { id: 'kr1', description: 'LinkedIn followers', target: 10000, current: 6500, unit: 'followers' },
      { id: 'kr2', description: 'Average engagement rate', target: 5, current: 3.2, unit: '%' },
      { id: 'kr3', description: 'Monthly posts', target: 60, current: 35, unit: 'posts' },
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-04-08',
  },
];

// Initial holidays
const initialHolidays: Holiday[] = [
  {
    id: '1',
    name: 'New Year\'s Day',
    date: '2026-01-01',
    type: 'Public',
    description: 'New Year celebration',
  },
  {
    id: '2',
    name: 'Martin Luther King Jr. Day',
    date: '2026-01-19',
    type: 'Public',
    description: 'Federal holiday',
  },
  {
    id: '3',
    name: 'Presidents\' Day',
    date: '2026-02-16',
    type: 'Public',
    description: 'Federal holiday',
  },
  {
    id: '4',
    name: 'Memorial Day',
    date: '2026-05-25',
    type: 'Public',
    description: 'Federal holiday',
  },
  {
    id: '5',
    name: 'Independence Day',
    date: '2026-07-04',
    type: 'Public',
    description: 'National Independence Day',
  },
  {
    id: '6',
    name: 'Labor Day',
    date: '2026-09-07',
    type: 'Public',
    description: 'Federal holiday',
  },
  {
    id: '7',
    name: 'Thanksgiving',
    date: '2026-11-26',
    type: 'Public',
    description: 'Thanksgiving Day',
  },
  {
    id: '8',
    name: 'Christmas Day',
    date: '2026-12-25',
    type: 'Public',
    description: 'Christmas celebration',
  },
  {
    id: '9',
    name: 'Company Anniversary',
    date: '2026-03-15',
    type: 'Company',
    description: 'Company founding day celebration',
  },
];

// LocalStorage service
class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Users
  getUsers(): User[] {
    return this.getItem('users', initialUsers);
  }

  setUsers(users: User[]): void {
    this.setItem('users', users);
  }

  // Employees
  getEmployees(): Employee[] {
    return this.getItem('employees', initialEmployees);
  }

  setEmployees(employees: Employee[]): void {
    this.setItem('employees', employees);
  }

  // Leave Requests
  getLeaveRequests(): LeaveRequest[] {
    return this.getItem('leaveRequests', initialLeaveRequests);
  }

  setLeaveRequests(requests: LeaveRequest[]): void {
    this.setItem('leaveRequests', requests);
  }

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return this.getItem('attendance', initialAttendance);
  }

  setAttendance(records: AttendanceRecord[]): void {
    this.setItem('attendance', records);
  }

  // Salary Slips
  getSalarySlips(): SalarySlip[] {
    return this.getItem('salarySlips', initialSalarySlips);
  }

  setSalarySlips(slips: SalarySlip[]): void {
    this.setItem('salarySlips', slips);
  }

  // Performance Reviews
  getPerformanceReviews(): PerformanceReview[] {
    return this.getItem('performanceReviews', initialPerformanceReviews);
  }

  setPerformanceReviews(reviews: PerformanceReview[]): void {
    this.setItem('performanceReviews', reviews);
  }

  // Notifications
  getNotifications(): Notification[] {
    return this.getItem('notifications', initialNotifications);
  }

  setNotifications(notifications: Notification[]): void {
    this.setItem('notifications', notifications);
  }

  // Onboarding Tasks
  getOnboardingTasks(): OnboardingTask[] {
    return this.getItem('onboardingTasks', initialOnboardingTasks);
  }

  setOnboardingTasks(tasks: OnboardingTask[]): void {
    this.setItem('onboardingTasks', tasks);
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return this.getItem('announcements', initialAnnouncements);
  }

  setAnnouncements(announcements: Announcement[]): void {
    this.setItem('announcements', announcements);
  }

  // Time Logs
  getTimeLogs(): TimeLog[] {
    return this.getItem('timeLogs', initialTimeLogs);
  }

  setTimeLogs(timeLogs: TimeLog[]): void {
    this.setItem('timeLogs', timeLogs);
  }

  // Calendar Events
  getCalendarEvents(): CalendarEvent[] {
    return this.getItem('calendarEvents', initialCalendarEvents);
  }

  setCalendarEvents(events: CalendarEvent[]): void {
    this.setItem('calendarEvents', events);
  }

  // Documents
  getDocuments(): Document[] {
    return this.getItem('documents', initialDocuments);
  }

  setDocuments(documents: Document[]): void {
    this.setItem('documents', documents);
  }

  // Departments
  getDepartments(): Department[] {
    return this.getItem('departments', initialDepartments);
  }

  setDepartments(departments: Department[]): void {
    this.setItem('departments', departments);
  }

  // Goals
  getGoals(): Goal[] {
    return this.getItem('goals', initialGoals);
  }

  setGoals(goals: Goal[]): void {
    this.setItem('goals', goals);
  }

  // Holidays
  getHolidays(): Holiday[] {
    return this.getItem('holidays', initialHolidays);
  }

  setHolidays(holidays: Holiday[]): void {
    this.setItem('holidays', holidays);
  }

  // Auth
  getCurrentUser(): User | null {
    return this.getItem<User | null>('currentUser', null);
  }

  setCurrentUser(user: User | null): void {
    this.setItem('currentUser', user);
  }

  // Reset all data
  resetData(): void {
    localStorage.clear();
  }
}

export const storageService = new StorageService();