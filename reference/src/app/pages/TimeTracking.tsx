import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Play, Square, Clock, Plus, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { TimeLog } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Checkbox } from '../components/ui/checkbox';

export function TimeTracking() {
  const { user } = useAuth();
  const [timeLogs, setTimeLogs] = useState(storageService.getTimeLogs());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const employees = storageService.getEmployees();
  const currentEmployee = employees.find((emp) => emp.id === user?.employeeId);

  const [formData, setFormData] = useState({
    project: '',
    task: '',
    description: '',
    billable: true,
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  const startTimer = () => {
    setStartTime(new Date());
    setIsTracking(true);
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (!formData.project || !formData.task) {
      toast.error('Please fill in project and task details');
      return;
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - (startTime?.getTime() || 0)) / 60000); // in minutes

    const newLog: TimeLog = {
      id: Date.now().toString(),
      employeeId: user?.employeeId || '',
      employeeName: currentEmployee
        ? `${currentEmployee.firstName} ${currentEmployee.lastName}`
        : user?.email || 'Unknown',
      project: formData.project,
      task: formData.task,
      startTime: startTime?.toISOString() || '',
      endTime: endTime.toISOString(),
      duration,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: formData.description,
      billable: formData.billable,
    };

    const updatedLogs = [newLog, ...timeLogs];
    setTimeLogs(updatedLogs);
    storageService.setTimeLogs(updatedLogs);

    // Reset
    setIsTracking(false);
    setStartTime(null);
    setElapsedTime(0);
    setFormData({ project: '', task: '', description: '', billable: true });

    toast.success('Time log saved successfully');
  };

  const handleManualEntry = () => {
    if (!formData.project || !formData.task) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newLog: TimeLog = {
      id: Date.now().toString(),
      employeeId: user?.employeeId || '',
      employeeName: currentEmployee
        ? `${currentEmployee.firstName} ${currentEmployee.lastName}`
        : user?.email || 'Unknown',
      project: formData.project,
      task: formData.task,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: 60, // Default 1 hour
      date: format(new Date(), 'yyyy-MM-dd'),
      description: formData.description,
      billable: formData.billable,
    };

    const updatedLogs = [newLog, ...timeLogs];
    setTimeLogs(updatedLogs);
    storageService.setTimeLogs(updatedLogs);

    setFormData({ project: '', task: '', description: '', billable: true });
    setIsDialogOpen(false);
    toast.success('Time entry added successfully');
  };

  // Filter logs for current user if employee
  const userTimeLogs =
    user?.role === 'Employee'
      ? timeLogs.filter((log) => log.employeeId === user?.employeeId)
      : timeLogs;

  // Calculate totals
  const totalHours = userTimeLogs.reduce((sum, log) => sum + log.duration, 0) / 60;
  const billableHours = userTimeLogs.filter((log) => log.billable).reduce(
    (sum, log) => sum + log.duration,
    0
  ) / 60;
  const todayHours = userTimeLogs
    .filter((log) => log.date === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, log) => sum + log.duration, 0) / 60;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600 mt-1">Track your work hours and project time</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Time Entry</DialogTitle>
              <DialogDescription>Manually add a time log entry.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project *</label>
                <Input
                  placeholder="Enter project name"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Task *</label>
                <Input
                  placeholder="Enter task name"
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="What did you work on?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="billable"
                  checked={formData.billable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, billable: checked as boolean })
                  }
                />
                <label htmlFor="billable" className="text-sm font-medium">
                  Billable
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleManualEntry}>Add Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timer Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-bold text-gray-900 mb-2 font-mono">
                {formatTime(elapsedTime)}
              </h2>
              <p className="text-gray-600">
                {isTracking ? 'Timer running...' : 'Ready to track time'}
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              {!isTracking ? (
                <div className="space-y-3">
                  <Input
                    placeholder="Project name"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  />
                  <Input
                    placeholder="Task description"
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  />
                  <Button size="lg" className="w-full" onClick={startTimer}>
                    <Play className="h-5 w-5 mr-2" />
                    Start Timer
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">{formData.project}</p>
                    <p className="text-sm text-blue-700">{formData.task}</p>
                  </div>
                  <Input
                    placeholder="Add description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Button size="lg" variant="destructive" className="w-full" onClick={stopTimer}>
                    <Square className="h-5 w-5 mr-2" />
                    Stop & Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Hours</p>
                <p className="text-3xl font-bold mt-1">{todayHours.toFixed(1)}h</p>
              </div>
              <CalendarIcon className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-3xl font-bold mt-1">{totalHours.toFixed(1)}h</p>
              </div>
              <Clock className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Billable Hours</p>
                <p className="text-3xl font-bold mt-1">{billableHours.toFixed(1)}h</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTimeLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No time logs yet. Start tracking your time!
                    </TableCell>
                  </TableRow>
                ) : (
                  userTimeLogs.slice(0, 20).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(new Date(log.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{log.employeeName}</TableCell>
                      <TableCell className="font-medium">{log.project}</TableCell>
                      <TableCell>{log.task}</TableCell>
                      <TableCell>{(log.duration / 60).toFixed(1)}h</TableCell>
                      <TableCell>
                        <Badge variant={log.billable ? 'default' : 'secondary'}>
                          {log.billable ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{log.description || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
