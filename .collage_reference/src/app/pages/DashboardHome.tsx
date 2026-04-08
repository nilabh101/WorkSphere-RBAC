import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Calendar, Clock, TrendingUp, CheckCircle, AlertCircle, DollarSign, UserCheck, Megaphone, Target, Bell as BellIcon, BarChart3, BookOpen } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';

export function DashboardHome() {
  const { user } = useAuth();
  const employees = storageService.getEmployees();
  const leaveRequests = storageService.getLeaveRequests();
  const attendance = storageService.getAttendance();
  const performanceReviews = storageService.getPerformanceReviews();

  const currentEmployee = employees.find(emp => emp.id === user?.employeeId);

  // Admin stats
  const adminStats = [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Leaves',
      value: leaveRequests.filter(l => l.status === 'Pending').length,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: "Today's Attendance",
      value: attendance.filter(a => a.date === format(new Date(), 'yyyy-MM-dd')).length,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Employees',
      value: employees.filter(e => e.status === 'Active').length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  // HR stats
  const hrStats = [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Leave Requests',
      value: leaveRequests.filter(l => l.status === 'Pending').length,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Performance Reviews',
      value: performanceReviews.length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Employees',
      value: employees.filter(e => e.status === 'Active').length,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  // Employee stats
  const employeeLeaves = leaveRequests.filter(l => l.employeeId === user?.employeeId);
  const employeeAttendance = attendance.filter(a => a.employeeId === user?.employeeId);
  const employeeReviews = performanceReviews.filter(r => r.employeeId === user?.employeeId);

  const employeeStats = [
    {
      title: 'Leave Balance',
      value: '18 days',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Leaves',
      value: employeeLeaves.filter(l => l.status === 'Pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Attendance Rate',
      value: '95%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Performance Score',
      value: employeeReviews.length > 0 ? employeeReviews[0].rating.toFixed(1) : 'N/A',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const getStats = () => {
    if (user?.role === 'Admin') return adminStats;
    if (user?.role === 'HR') return hrStats;
    return employeeStats;
  };

  const stats = getStats();

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentEmployee?.firstName || user?.email}!
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'Admin' && "Here's your system overview"}
          {user?.role === 'HR' && "Here's your HR dashboard overview"}
          {user?.role === 'Employee' && "Here's your personal dashboard"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(user?.role === 'Employee' ? employeeLeaves : leaveRequests)
                .slice(0, 5)
                .map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{leave.employeeName}</p>
                      <p className="text-sm text-gray-600">
                        {leave.leaveType} - {leave.days} day(s)
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd')}
                      </p>
                    </div>
                    <Badge
                      variant={
                        leave.status === 'Approved' ? 'default' :
                        leave.status === 'Rejected' ? 'destructive' :
                        'secondary'
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              {(user?.role === 'Employee' ? employeeLeaves : leaveRequests).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No leave requests</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(user?.role === 'Employee' ? employeeAttendance : attendance)
                .slice(0, 5)
                .map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{record.employeeName}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.checkIn} - {record.checkOut} ({record.hoursWorked}h)
                      </p>
                    </div>
                    <Badge
                      variant={
                        record.status === 'Present' ? 'default' :
                        record.status === 'Late' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              {(user?.role === 'Employee' ? employeeAttendance : attendance).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No attendance records</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Employee */}
      {user?.role === 'Employee' && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Department</h3>
                </div>
                <p className="text-2xl font-bold text-blue-700">{currentEmployee?.department}</p>
                <p className="text-sm text-gray-600 mt-1">{currentEmployee?.position}</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Join Date</h3>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {currentEmployee?.joinDate && format(new Date(currentEmployee.joinDate), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentEmployee?.joinDate && 
                    `${Math.floor((new Date().getTime() - new Date(currentEmployee.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years with company`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access Features */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(user?.role === 'Admin' || user?.role === 'HR') && (
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 py-4"
                onClick={() => navigate('/dashboard/analytics')}
              >
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span className="text-xs">Analytics</span>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/dashboard/announcements')}
            >
              <Megaphone className="h-6 w-6 text-purple-600" />
              <span className="text-xs">Announcements</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/dashboard/employee-directory')}
            >
              <BookOpen className="h-6 w-6 text-green-600" />
              <span className="text-xs">Directory</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/dashboard/time-tracking')}
            >
              <Clock className="h-6 w-6 text-orange-600" />
              <span className="text-xs">Time Tracking</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/dashboard/goals')}
            >
              <Target className="h-6 w-6 text-indigo-600" />
              <span className="text-xs">Goals</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4"
              onClick={() => navigate('/dashboard/notifications')}
            >
              <BellIcon className="h-6 w-6 text-red-600" />
              <span className="text-xs">Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}