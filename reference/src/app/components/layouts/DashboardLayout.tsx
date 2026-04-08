import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  FileText, 
  TrendingUp, 
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  User,
  Building2,
  BarChart3,
  BookOpen,
  Megaphone,
  Clock,
  Target,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { storageService } from '../../services/mockData';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ];

    // Common features for all roles
    const commonFeatures = [
      { path: '/dashboard/announcements', icon: Megaphone, label: 'Announcements' },
      { path: '/dashboard/employee-directory', icon: BookOpen, label: 'Directory' },
      { path: '/dashboard/time-tracking', icon: Clock, label: 'Time Tracking' },
      { path: '/dashboard/goals', icon: Target, label: 'Goals & OKRs' },
      { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    ];

    if (user?.role === 'Admin') {
      return [
        ...baseItems,
        { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/dashboard/employees', icon: Users, label: 'Employees' },
        { path: '/dashboard/leaves', icon: Calendar, label: 'Leave Requests' },
        { path: '/dashboard/attendance', icon: ClipboardList, label: 'Attendance' },
        { path: '/dashboard/performance', icon: TrendingUp, label: 'Performance' },
        { path: '/dashboard/onboarding', icon: FileText, label: 'Onboarding' },
        ...commonFeatures,
      ];
    }

    if (user?.role === 'HR') {
      return [
        ...baseItems,
        { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/dashboard/employees', icon: Users, label: 'Employees' },
        { path: '/dashboard/leaves', icon: Calendar, label: 'Leave Requests' },
        { path: '/dashboard/attendance', icon: ClipboardList, label: 'Attendance' },
        { path: '/dashboard/salary', icon: FileText, label: 'Salary Slips' },
        { path: '/dashboard/performance', icon: TrendingUp, label: 'Performance' },
        ...commonFeatures,
      ];
    }

    // Employee
    return [
      ...baseItems,
      { path: '/dashboard/profile', icon: User, label: 'My Profile' },
      { path: '/dashboard/leaves', icon: Calendar, label: 'My Leaves' },
      { path: '/dashboard/attendance', icon: ClipboardList, label: 'My Attendance' },
      { path: '/dashboard/salary', icon: FileText, label: 'Salary Slips' },
      { path: '/dashboard/performance', icon: TrendingUp, label: 'Performance' },
      ...commonFeatures,
    ];
  };

  const navItems = getNavItems();

  // Get employee details
  const employees = storageService.getEmployees();
  const currentEmployee = employees.find(emp => emp.id === user?.employeeId);
  const initials = currentEmployee 
    ? `${currentEmployee.firstName[0]}${currentEmployee.lastName[0]}`
    : user?.email[0].toUpperCase() || 'U';

  // Get unread notifications count
  const notifications = storageService.getNotifications();
  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-indigo-600" />
              <span className="font-semibold text-lg hidden sm:inline">HR System</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate('/dashboard/notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">
                      {currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : user?.email}
                    </div>
                    <div className="text-xs text-gray-500">{user?.role}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out mt-[57px] lg:mt-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-57px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}