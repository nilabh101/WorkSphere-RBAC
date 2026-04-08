import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Briefcase,
  DollarSign,
  Clock,
  Award,
} from 'lucide-react';
import { format } from 'date-fns';

export function Profile() {
  const { user } = useAuth();
  const employees = storageService.getEmployees();
  const leaveRequests = storageService.getLeaveRequests();
  const attendance = storageService.getAttendance();
  const performanceReviews = storageService.getPerformanceReviews();

  const employee = employees.find(emp => emp.id === user?.employeeId);

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Employee profile not found</p>
      </div>
    );
  }

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;
  
  const employeeLeaves = leaveRequests.filter(l => l.employeeId === employee.id);
  const employeeAttendance = attendance.filter(a => a.employeeId === employee.id);
  const employeeReviews = performanceReviews.filter(r => r.employeeId === employee.id);

  const stats = [
    {
      label: 'Total Leave Requests',
      value: employeeLeaves.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Attendance Records',
      value: employeeAttendance.length,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Performance Reviews',
      value: employeeReviews.length,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Latest Rating',
      value: employeeReviews.length > 0 ? employeeReviews[0].rating.toFixed(1) : 'N/A',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">View your personal information and employment details</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-xl text-gray-600 mt-1">{employee.position}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <Badge variant="default">{employee.role}</Badge>
                <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
                <Badge variant="outline">{employee.department}</Badge>
              </div>
            </div>

            {user?.role !== 'Employee' && (
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600">Annual Salary</p>
                <p className="text-3xl font-bold text-green-600">
                  ${employee.salary.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{employee.firstName} {employee.lastName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{format(new Date(employee.dateOfBirth), 'MMMM dd, yyyy')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{employee.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Emergency Contact</p>
                <p className="font-medium">{employee.emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-medium">{employee.position}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium">{employee.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-medium">{format(new Date(employee.joinDate), 'MMMM dd, yyyy')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Years of Service</p>
                <p className="font-medium">
                  {Math.floor((new Date().getTime() - new Date(employee.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                </p>
              </div>
            </div>

            {user?.role !== 'Employee' && (
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual Salary</p>
                  <p className="font-medium">${employee.salary.toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Status</p>
                <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
