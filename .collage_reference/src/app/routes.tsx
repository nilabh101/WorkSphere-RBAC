import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { Employees } from './pages/Employees';
import { Leaves } from './pages/Leaves';
import { Attendance } from './pages/Attendance';
import { SalarySlips } from './pages/SalarySlips';
import { Performance } from './pages/Performance';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';
import { Analytics } from './pages/Analytics';
import { EmployeeDirectory } from './pages/EmployeeDirectory';
import { Announcements } from './pages/Announcements';
import { TimeTracking } from './pages/TimeTracking';
import { Goals } from './pages/Goals';
import { Notifications } from './pages/Notifications';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'employees',
        element: <Employees />,
      },
      {
        path: 'leaves',
        element: <Leaves />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'salary',
        element: <SalarySlips />,
      },
      {
        path: 'performance',
        element: <Performance />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'onboarding',
        element: <Onboarding />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'employee-directory',
        element: <EmployeeDirectory />,
      },
      {
        path: 'announcements',
        element: <Announcements />,
      },
      {
        path: 'time-tracking',
        element: <TimeTracking />,
      },
      {
        path: 'goals',
        element: <Goals />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);