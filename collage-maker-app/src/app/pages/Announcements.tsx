import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Plus,
  Pin,
  Megaphone,
  Calendar,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Announcement } from '../types';

export function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState(storageService.getAnnouncements());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: 'All',
    priority: 'Medium' as Announcement['priority'],
    pinned: false,
  });

  const employees = storageService.getEmployees();
  const currentEmployee = employees.find((emp) => emp.id === user?.employeeId);

  const handleCreateAnnouncement = () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : user?.email || 'Unknown',
      authorId: user?.id || '',
      department: formData.department,
      priority: formData.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: formData.pinned,
    };

    const updatedAnnouncements = [newAnnouncement, ...announcements];
    setAnnouncements(updatedAnnouncements);
    storageService.setAnnouncements(updatedAnnouncements);

    // Reset form
    setFormData({
      title: '',
      content: '',
      department: 'All',
      priority: 'Medium',
      pinned: false,
    });

    setIsDialogOpen(false);
    toast.success('Announcement created successfully');
  };

  const togglePin = (id: string) => {
    const updatedAnnouncements = announcements.map((ann) =>
      ann.id === id ? { ...ann, pinned: !ann.pinned } : ann
    );
    setAnnouncements(updatedAnnouncements);
    storageService.setAnnouncements(updatedAnnouncements);
    toast.success('Announcement updated');
  };

  // Sort: pinned first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getPriorityIcon = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'Urgent':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'Medium':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'Low':
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Company-wide news and updates</p>
        </div>

        {(user?.role === 'Admin' || user?.role === 'HR') && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>Share important updates with your team.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Enter announcement title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content *</label>
                  <Textarea
                    placeholder="Enter announcement details"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Departments</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: Announcement['priority']) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="pinned" className="text-sm font-medium">
                    Pin this announcement to the top
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Announcements</h3>
              <p className="text-gray-500">There are no announcements at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          sortedAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`${
                announcement.pinned ? 'border-2 border-indigo-200 bg-indigo-50/30' : ''
              } relative`}
            >
              {announcement.pinned && (
                <div className="absolute top-3 right-3">
                  <Pin className="h-5 w-5 text-indigo-600" />
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {getInitials(announcement.author)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                          {announcement.pinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="font-medium">{announcement.author}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{format(new Date(announcement.createdAt), 'MMM dd, yyyy')}</span>
                          </div>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {announcement.department}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getPriorityColor(announcement.priority)}`}>
                          {getPriorityIcon(announcement.priority)}
                          <span className="text-sm font-medium">{announcement.priority}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>

                    {(user?.role === 'Admin' || user?.role === 'HR') && (
                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePin(announcement.id)}
                        >
                          <Pin className="h-4 w-4 mr-2" />
                          {announcement.pinned ? 'Unpin' : 'Pin'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
