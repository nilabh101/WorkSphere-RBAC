import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { LeaveRequest } from '../types';
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
import { Plus, Check, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

export function Leaves() {
  const { user } = useAuth();
  const employees = storageService.getEmployees();
  const [leaves, setLeaves] = useState(storageService.getLeaveRequests());
  const [dialogOpen, setDialogOpen] = useState(false);

  const isEmployee = user?.role === 'Employee';
  const canApprove = user?.role === 'Admin' || user?.role === 'HR';

  const [formData, setFormData] = useState({
    leaveType: 'Vacation' as LeaveRequest['leaveType'],
    startDate: '',
    endDate: '',
    reason: '',
  });

  const currentEmployee = employees.find(emp => emp.id === user?.employeeId);
  
  const filteredLeaves = isEmployee 
    ? leaves.filter(leave => leave.employeeId === user?.employeeId)
    : leaves;

  const handleApply = () => {
    setFormData({
      leaveType: 'Vacation',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEmployee) return;

    const days = differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1;
    
    const newLeave: LeaveRequest = {
      id: (Math.max(...leaves.map(l => parseInt(l.id))) + 1).toString(),
      employeeId: currentEmployee.id,
      employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'Pending',
      appliedDate: format(new Date(), 'yyyy-MM-dd'),
    };

    const updated = [...leaves, newLeave];
    setLeaves(updated);
    storageService.setLeaveRequests(updated);
    
    toast.success('Leave request submitted successfully');
    setDialogOpen(false);
  };

  const handleApprove = (leave: LeaveRequest) => {
    const updated = leaves.map(l =>
      l.id === leave.id
        ? {
            ...l,
            status: 'Approved' as const,
            reviewedBy: user?.id,
            reviewedDate: format(new Date(), 'yyyy-MM-dd'),
          }
        : l
    );
    setLeaves(updated);
    storageService.setLeaveRequests(updated);
    toast.success('Leave request approved');
  };

  const handleReject = (leave: LeaveRequest) => {
    const updated = leaves.map(l =>
      l.id === leave.id
        ? {
            ...l,
            status: 'Rejected' as const,
            reviewedBy: user?.id,
            reviewedDate: format(new Date(), 'yyyy-MM-dd'),
          }
        : l
    );
    setLeaves(updated);
    storageService.setLeaveRequests(updated);
    toast.success('Leave request rejected');
  };

  const stats = {
    pending: filteredLeaves.filter(l => l.status === 'Pending').length,
    approved: filteredLeaves.filter(l => l.status === 'Approved').length,
    rejected: filteredLeaves.filter(l => l.status === 'Rejected').length,
    total: filteredLeaves.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEmployee ? 'My Leave Requests' : 'Leave Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEmployee ? 'Apply for and track your leave requests' : 'Manage employee leave requests'}
          </p>
        </div>
        {isEmployee && (
          <Button onClick={handleApply}>
            <Plus className="h-4 w-4 mr-2" />
            Apply for Leave
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold mt-2 text-red-600">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  {canApprove && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.employeeName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{leave.leaveType}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(leave.startDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(leave.endDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          leave.status === 'Approved' ? 'default' :
                          leave.status === 'Rejected' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(leave.appliedDate), 'MMM dd, yyyy')}</TableCell>
                    {canApprove && (
                      <TableCell className="text-right">
                        {leave.status === 'Pending' && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(leave)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(leave)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {filteredLeaves.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canApprove ? 9 : 8} className="text-center text-gray-500 py-8">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Apply Leave Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>Submit a new leave request</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select
                value={formData.leaveType}
                onValueChange={(value) => setFormData({ ...formData, leaveType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick">Sick Leave</SelectItem>
                  <SelectItem value="Casual">Casual Leave</SelectItem>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Personal">Personal Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please provide a reason for your leave request..."
                required
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
