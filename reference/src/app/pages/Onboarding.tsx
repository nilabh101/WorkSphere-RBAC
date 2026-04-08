import React, { useState } from 'react';
import { storageService } from '../services/mockData';
import { OnboardingTask } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
import { Progress } from '../components/ui/progress';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function Onboarding() {
  const employees = storageService.getEmployees();
  const [tasks, setTasks] = useState(storageService.getOnboardingTasks());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const [formData, setFormData] = useState({
    employeeId: '',
    task: '',
    description: '',
    dueDate: '',
  });

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      task: '',
      description: '',
      dueDate: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee) return;

    const newTask: OnboardingTask = {
      id: (Math.max(...tasks.map(t => parseInt(t.id))) + 1).toString(),
      employeeId: formData.employeeId,
      task: formData.task,
      description: formData.description,
      status: 'Pending',
      dueDate: formData.dueDate,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    storageService.setOnboardingTasks(updated);

    toast.success('Onboarding task created successfully');
    setDialogOpen(false);
  };

  const handleUpdateStatus = (taskId: string, status: OnboardingTask['status']) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          completedDate: status === 'Completed' ? format(new Date(), 'yyyy-MM-dd') : undefined,
        };
      }
      return t;
    });
    setTasks(updated);
    storageService.setOnboardingTasks(updated);
    toast.success('Task status updated');
  };

  const filteredTasks = selectedEmployee && selectedEmployee !== 'all'
    ? tasks.filter(t => t.employeeId === selectedEmployee)
    : tasks;

  // Group tasks by employee
  const tasksByEmployee = new Map<string, OnboardingTask[]>();
  filteredTasks.forEach(task => {
    const existing = tasksByEmployee.get(task.employeeId) || [];
    tasksByEmployee.set(task.employeeId, [...existing, task]);
  });

  const getEmployeeStats = (employeeId: string) => {
    const employeeTasks = tasks.filter(t => t.employeeId === employeeId);
    const total = employeeTasks.length;
    const completed = employeeTasks.filter(t => t.status === 'Completed').length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, progress };
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Onboarding</h1>
          <p className="text-gray-600 mt-1">Manage onboarding workflows and track progress</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold mt-2 text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="employeeFilter" className="min-w-fit">Filter by Employee:</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEmployee !== 'all' && (
              <Button variant="outline" onClick={() => setSelectedEmployee('all')}>
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Onboarding Progress */}
      <div className="grid grid-cols-1 gap-6">
        {Array.from(tasksByEmployee.entries()).map(([employeeId, employeeTasks]) => {
          const employee = employees.find(e => e.id === employeeId);
          if (!employee) return null;

          const stats = getEmployeeStats(employeeId);

          return (
            <Card key={employeeId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {employee.firstName} {employee.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {employee.position} - {employee.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-2xl font-bold">{Math.round(stats.progress)}%</p>
                  </div>
                </div>
                <Progress value={stats.progress} className="mt-4" />
                <p className="text-sm text-gray-600 mt-2">
                  {stats.completed} of {stats.total} tasks completed
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completed Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeeTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.task}</TableCell>
                          <TableCell className="max-w-xs">{task.description}</TableCell>
                          <TableCell>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.status === 'Completed' ? 'default' :
                                task.status === 'In Progress' ? 'secondary' :
                                'outline'
                              }
                            >
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {task.completedDate ? format(new Date(task.completedDate), 'MMM dd, yyyy') : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={task.status}
                              onValueChange={(value) => handleUpdateStatus(task.id, value as any)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {tasksByEmployee.size === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No onboarding tasks found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Onboarding Task</DialogTitle>
            <DialogDescription>Create a new onboarding task for an employee</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="task">Task Name</Label>
              <Input
                id="task"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                placeholder="e.g., Complete Employee Handbook"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the task in detail..."
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}