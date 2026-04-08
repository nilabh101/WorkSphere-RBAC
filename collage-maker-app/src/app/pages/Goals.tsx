import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Target, Plus, Calendar, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Goal } from '../types';

export function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState(storageService.getGoals());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const employees = storageService.getEmployees();
  const currentEmployee = employees.find((emp) => emp.id === user?.employeeId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Individual' as Goal['type'],
    category: 'Performance' as Goal['category'],
    targetDate: '',
  });

  const handleCreateGoal = () => {
    if (!formData.title || !formData.description || !formData.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      employeeId: user?.employeeId || '',
      employeeName: currentEmployee
        ? `${currentEmployee.firstName} ${currentEmployee.lastName}`
        : user?.email || 'Unknown',
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      targetDate: formData.targetDate,
      progress: 0,
      status: 'Not Started',
      keyResults: [],
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      updatedAt: format(new Date(), 'yyyy-MM-dd'),
    };

    const updatedGoals = [newGoal, ...goals];
    setGoals(updatedGoals);
    storageService.setGoals(updatedGoals);

    setFormData({
      title: '',
      description: '',
      type: 'Individual',
      category: 'Performance',
      targetDate: '',
    });
    setIsDialogOpen(false);
    toast.success('Goal created successfully');
  };

  const updateProgress = (id: string, newProgress: number) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        let status: Goal['status'] = 'Not Started';
        if (newProgress > 0 && newProgress < 100) status = 'In Progress';
        else if (newProgress === 100) status = 'Completed';

        return { ...goal, progress: newProgress, status, updatedAt: format(new Date(), 'yyyy-MM-dd') };
      }
      return goal;
    });

    setGoals(updatedGoals);
    storageService.setGoals(updatedGoals);
    toast.success('Progress updated');
  };

  // Filter goals for current user if employee
  const userGoals =
    user?.role === 'Employee' ? goals.filter((goal) => goal.employeeId === user?.employeeId) : goals;

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-600';
    if (progress >= 50) return 'bg-blue-600';
    if (progress >= 25) return 'bg-yellow-600';
    return 'bg-gray-400';
  };

  // Calculate stats
  const completedGoals = userGoals.filter((g) => g.status === 'Completed').length;
  const inProgressGoals = userGoals.filter((g) => g.status === 'In Progress').length;
  const avgProgress =
    userGoals.length > 0
      ? Math.round(userGoals.reduce((sum, g) => sum + g.progress, 0) / userGoals.length)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals & OKRs</h1>
          <p className="text-gray-600 mt-1">Track your objectives and key results</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new objective to track your progress.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Enter goal title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe your goal in detail"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Goal['type']) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Team">Team</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Goal['category']) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Learning">Learning</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date *</label>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-3xl font-bold mt-1">{userGoals.length}</p>
              </div>
              <Target className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold mt-1">{completedGoals}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold mt-1">{inProgressGoals}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-3xl font-bold mt-1">{avgProgress}%</p>
              </div>
              <Award className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {userGoals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Goals Set</h3>
              <p className="text-gray-500 mb-4">Start by creating your first goal!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          userGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`${getStatusColor(goal.status)}`}>{goal.status}</Badge>
                          <Badge variant="outline">{goal.type}</Badge>
                          <Badge variant="outline">{goal.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Due: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{goal.progress}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={goal.progress} className="h-3" />
                        <div
                          className={`absolute inset-0 h-3 rounded-full transition-all ${getProgressColor(
                            goal.progress
                          )}`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>

                      {goal.keyResults && goal.keyResults.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Key Results:</p>
                          {goal.keyResults.map((kr) => (
                            <div key={kr.id} className="pl-4 border-l-2 border-gray-200">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{kr.description}</span>
                                <span className="font-medium">
                                  {kr.current} / {kr.target} {kr.unit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {user?.role !== 'Employee' || goal.employeeId === user?.employeeId ? (
                    <div className="flex flex-col gap-2 lg:w-48">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Update Progress</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={goal.progress}
                            onBlur={(e) => {
                              const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                              updateProgress(goal.id, value);
                            }}
                            className="w-20"
                          />
                          <span className="flex items-center text-sm text-gray-600">%</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
