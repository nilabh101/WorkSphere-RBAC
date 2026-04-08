import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { AttendanceRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Plus, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function Attendance() {
  const { user } = useAuth();
  const employees = storageService.getEmployees();
  const [attendance, setAttendance] = useState(storageService.getAttendance());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  const isEmployee = user?.role === 'Employee';
  const canManage = user?.role === 'Admin' || user?.role === 'HR';

  const [formData, setFormData] = useState({
    employeeId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    checkIn: '',
    checkOut: '',
    status: 'Present' as AttendanceRecord['status'],
  });

  const currentEmployee = employees.find(emp => emp.id === user?.employeeId);
  
  const filteredAttendance = attendance
    .filter(record => 
      isEmployee ? record.employeeId === user?.employeeId : true
    )
    .filter(record => 
      filterDate ? record.date === filterDate : true
    );

  const handleAdd = () => {
    setFormData({
      employeeId: isEmployee ? user?.employeeId! : '',
      date: format(new Date(), 'yyyy-MM-dd'),
      checkIn: '',
      checkOut: '',
      status: 'Present',
    });
    setDialogOpen(true);
  };

  const calculateHours = (checkIn: string, checkOut: string): number => {
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
    return Math.round((totalMinutes / 60) * 100) / 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee) return;

    const hoursWorked = calculateHours(formData.checkIn, formData.checkOut);

    const newRecord: AttendanceRecord = {
      id: (Math.max(...attendance.map(a => parseInt(a.id))) + 1).toString(),
      employeeId: formData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      date: formData.date,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: formData.status,
      hoursWorked,
    };

    const updated = [...attendance, newRecord];
    setAttendance(updated);
    storageService.setAttendance(updated);
    
    toast.success('Attendance record added successfully');
    setDialogOpen(false);
  };

  const stats = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter(a => a.status === 'Present').length,
    late: filteredAttendance.filter(a => a.status === 'Late').length,
    absent: filteredAttendance.filter(a => a.status === 'Absent').length,
    avgHours: filteredAttendance.length > 0 
      ? (filteredAttendance.reduce((sum, a) => sum + a.hoursWorked, 0) / filteredAttendance.length).toFixed(1)
      : '0',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEmployee ? 'My Attendance' : 'Attendance Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEmployee ? 'View your attendance records' : 'Track and manage employee attendance'}
          </p>
        </div>
        {canManage && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{stats.present}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.late}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-3xl font-bold mt-2 text-red-600">{stats.absent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Avg Hours</p>
              <p className="text-3xl font-bold mt-2 text-blue-600">{stats.avgHours}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="filterDate" className="sr-only">Filter by date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="filterDate"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10"
                  placeholder="Filter by date..."
                />
              </div>
            </div>
            {filterDate && (
              <Button variant="outline" onClick={() => setFilterDate('')}>
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {record.checkIn}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {record.checkOut}
                      </div>
                    </TableCell>
                    <TableCell>{record.hoursWorked}h</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === 'Present' ? 'default' :
                          record.status === 'Late' ? 'secondary' :
                          record.status === 'Half-Day' ? 'outline' :
                          'destructive'
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAttendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Record Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attendance Record</DialogTitle>
            <DialogDescription>Record employee attendance</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEmployee && (
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check In</Label>
                <Input
                  id="checkIn"
                  type="time"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOut">Check Out</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Half-Day">Half-Day</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
