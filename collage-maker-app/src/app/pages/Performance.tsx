import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { PerformanceReview } from '../types';
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
import { Plus, Star, TrendingUp, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function Performance() {
  const { user } = useAuth();
  const employees = storageService.getEmployees();
  const [reviews, setReviews] = useState(storageService.getPerformanceReviews());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingReview, setViewingReview] = useState<PerformanceReview | null>(null);

  const isEmployee = user?.role === 'Employee';
  const canCreate = user?.role === 'Admin' || user?.role === 'HR';

  const currentEmployee = employees.find(emp => emp.id === user?.employeeId);

  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    rating: 0,
    technicalSkills: 0,
    communication: 0,
    teamwork: 0,
    punctuality: 0,
    comments: '',
    goals: '',
  });

  const filteredReviews = isEmployee
    ? reviews.filter(review => review.employeeId === user?.employeeId)
    : reviews;

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      period: '',
      rating: 0,
      technicalSkills: 0,
      communication: 0,
      teamwork: 0,
      punctuality: 0,
      comments: '',
      goals: '',
    });
    setDialogOpen(true);
  };

  const handleView = (review: PerformanceReview) => {
    setViewingReview(review);
    setViewDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee || !currentEmployee) return;

    const overallRating = (
      formData.technicalSkills +
      formData.communication +
      formData.teamwork +
      formData.punctuality
    ) / 4;

    const newReview: PerformanceReview = {
      id: (Math.max(...reviews.map(r => parseInt(r.id))) + 1).toString(),
      employeeId: formData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      reviewerId: user!.id,
      reviewerName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      reviewDate: format(new Date(), 'yyyy-MM-dd'),
      period: formData.period,
      rating: overallRating,
      technicalSkills: formData.technicalSkills,
      communication: formData.communication,
      teamwork: formData.teamwork,
      punctuality: formData.punctuality,
      comments: formData.comments,
      goals: formData.goals,
    };

    const updated = [...reviews, newReview];
    setReviews(updated);
    storageService.setPerformanceReviews(updated);

    toast.success('Performance review created successfully');
    setDialogOpen(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { variant: 'default' as const, label: 'Excellent' };
    if (rating >= 3.5) return { variant: 'default' as const, label: 'Good' };
    if (rating >= 2.5) return { variant: 'secondary' as const, label: 'Average' };
    return { variant: 'destructive' as const, label: 'Needs Improvement' };
  };

  const avgRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEmployee ? 'My Performance Reviews' : 'Performance Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEmployee ? 'View your performance reviews and feedback' : 'Conduct and manage employee performance reviews'}
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold mt-2">{filteredReviews.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className={`text-3xl font-bold mt-2 ${getRatingColor(parseFloat(avgRating))}`}>
                  {avgRating}/5
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {isEmployee && filteredReviews.length > 0 && (
          <>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Latest Rating</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-3xl font-bold ${getRatingColor(filteredReviews[0].rating)}`}>
                      {filteredReviews[0].rating.toFixed(1)}
                    </p>
                    <Badge {...getRatingBadge(filteredReviews[0].rating)}>
                      {getRatingBadge(filteredReviews[0].rating).label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Latest Period</p>
                  <p className="text-xl font-bold">{filteredReviews[0].period}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(filteredReviews[0].reviewDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Overall Rating</TableHead>
                  <TableHead>Technical</TableHead>
                  <TableHead>Communication</TableHead>
                  <TableHead>Teamwork</TableHead>
                  <TableHead>Punctuality</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => {
                  const badge = getRatingBadge(review.rating);
                  return (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.employeeName}</TableCell>
                      <TableCell>{review.period}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getRatingColor(review.rating)}`}>
                            {review.rating.toFixed(1)}
                          </span>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{review.technicalSkills}/5</TableCell>
                      <TableCell>{review.communication}/5</TableCell>
                      <TableCell>{review.teamwork}/5</TableCell>
                      <TableCell>{review.punctuality}/5</TableCell>
                      <TableCell>{format(new Date(review.reviewDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{review.reviewerName}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(review)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredReviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                      No performance reviews found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Performance Review</DialogTitle>
            <DialogDescription>Conduct a performance review for an employee</DialogDescription>
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
                  {employees.filter(emp => emp.role === 'Employee').map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Review Period</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g., Q1 2026"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Performance Ratings (1-5)</Label>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="technical">Technical Skills</Label>
                    <span className="font-medium">{formData.technicalSkills}/5</span>
                  </div>
                  <Input
                    id="technical"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={formData.technicalSkills}
                    onChange={(e) => setFormData({ ...formData, technicalSkills: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="communication">Communication</Label>
                    <span className="font-medium">{formData.communication}/5</span>
                  </div>
                  <Input
                    id="communication"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={formData.communication}
                    onChange={(e) => setFormData({ ...formData, communication: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="teamwork">Teamwork</Label>
                    <span className="font-medium">{formData.teamwork}/5</span>
                  </div>
                  <Input
                    id="teamwork"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={formData.teamwork}
                    onChange={(e) => setFormData({ ...formData, teamwork: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="punctuality">Punctuality</Label>
                    <span className="font-medium">{formData.punctuality}/5</span>
                  </div>
                  <Input
                    id="punctuality"
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={formData.punctuality}
                    onChange={(e) => setFormData({ ...formData, punctuality: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Provide detailed feedback on performance..."
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Goals & Recommendations</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="Set goals and provide recommendations for improvement..."
                required
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Review Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performance Review Details</DialogTitle>
          </DialogHeader>

          {viewingReview && (
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{viewingReview.employeeName}</h2>
                <p className="text-gray-600">{viewingReview.period}</p>
                <p className="text-sm text-gray-500">
                  Reviewed by {viewingReview.reviewerName} on {format(new Date(viewingReview.reviewDate), 'MMMM dd, yyyy')}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Overall Rating</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className={`text-5xl font-bold ${getRatingColor(viewingReview.rating)}`}>
                      {viewingReview.rating.toFixed(1)}
                    </p>
                    <div className="text-left">
                      <p className="text-gray-600">out of 5.0</p>
                      <Badge {...getRatingBadge(viewingReview.rating)}>
                        {getRatingBadge(viewingReview.rating).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Performance Metrics</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Technical Skills</span>
                      <span className="text-sm font-bold">{viewingReview.technicalSkills}/5</span>
                    </div>
                    <Progress value={viewingReview.technicalSkills * 20} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm font-bold">{viewingReview.communication}/5</span>
                    </div>
                    <Progress value={viewingReview.communication * 20} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Teamwork</span>
                      <span className="text-sm font-bold">{viewingReview.teamwork}/5</span>
                    </div>
                    <Progress value={viewingReview.teamwork * 20} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Punctuality</span>
                      <span className="text-sm font-bold">{viewingReview.punctuality}/5</span>
                    </div>
                    <Progress value={viewingReview.punctuality * 20} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Feedback</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{viewingReview.comments}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Goals & Recommendations</h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{viewingReview.goals}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
