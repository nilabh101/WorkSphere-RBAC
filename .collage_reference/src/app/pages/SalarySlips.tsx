import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/mockData';
import { SalarySlip } from '../types';
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
import { Plus, Download, FileText, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function SalarySlips() {
  const { user } = useAuth();
  const employees = storageService.getEmployees();
  const [salarySlips, setSalarySlips] = useState(storageService.getSalarySlips());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingSlip, setViewingSlip] = useState<SalarySlip | null>(null);

  const isEmployee = user?.role === 'Employee';
  const canGenerate = user?.role === 'Admin' || user?.role === 'HR';

  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    year: new Date().getFullYear(),
    allowances: 0,
    deductions: 0,
  });

  const filteredSlips = isEmployee
    ? salarySlips.filter(slip => slip.employeeId === user?.employeeId)
    : salarySlips;

  const handleGenerate = () => {
    setFormData({
      employeeId: '',
      month: '',
      year: new Date().getFullYear(),
      allowances: 0,
      deductions: 0,
    });
    setDialogOpen(true);
  };

  const handleView = (slip: SalarySlip) => {
    setViewingSlip(slip);
    setViewDialogOpen(true);
  };

  const handleDownload = (slip: SalarySlip) => {
    // Create a simple text representation of the salary slip
    const content = `
SALARY SLIP
-----------
Employee: ${slip.employeeName}
Month: ${slip.month} ${slip.year}

EARNINGS:
Basic Salary: $${slip.basicSalary.toLocaleString()}
Allowances: $${slip.allowances.toLocaleString()}
Gross Salary: $${(slip.basicSalary + slip.allowances).toLocaleString()}

DEDUCTIONS:
Total Deductions: $${slip.deductions.toLocaleString()}

NET SALARY: $${slip.netSalary.toLocaleString()}

Generated on: ${slip.generatedDate}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary_slip_${slip.employeeName.replace(' ', '_')}_${slip.month}_${slip.year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Salary slip downloaded');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee) return;

    const basicSalary = employee.salary;
    const grossSalary = basicSalary + formData.allowances;
    const netSalary = grossSalary - formData.deductions;

    const newSlip: SalarySlip = {
      id: (Math.max(...salarySlips.map(s => parseInt(s.id))) + 1).toString(),
      employeeId: formData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      month: formData.month,
      year: formData.year,
      basicSalary,
      allowances: formData.allowances,
      deductions: formData.deductions,
      netSalary,
      generatedDate: format(new Date(), 'yyyy-MM-dd'),
    };

    const updated = [...salarySlips, newSlip];
    setSalarySlips(updated);
    storageService.setSalarySlips(updated);

    toast.success('Salary slip generated successfully');
    setDialogOpen(false);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEmployee ? 'My Salary Slips' : 'Salary Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEmployee ? 'View and download your salary slips' : 'Generate and manage employee salary slips'}
          </p>
        </div>
        {canGenerate && (
          <Button onClick={handleGenerate}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Slip
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Slips</p>
                <p className="text-3xl font-bold mt-2">{filteredSlips.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {isEmployee && filteredSlips.length > 0 && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Latest Salary</p>
                    <p className="text-3xl font-bold mt-2">
                      ${filteredSlips[0]?.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Latest Period</p>
                    <p className="text-2xl font-bold mt-2">
                      {filteredSlips[0]?.month} {filteredSlips[0]?.year}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Salary Slips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Slips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSlips.map((slip) => (
                  <TableRow key={slip.id}>
                    <TableCell className="font-medium">{slip.employeeName}</TableCell>
                    <TableCell>{slip.month}</TableCell>
                    <TableCell>{slip.year}</TableCell>
                    <TableCell>${slip.basicSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">+${slip.allowances.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">-${slip.deductions.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">${slip.netSalary.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(slip.generatedDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(slip)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(slip)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSlips.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                      No salary slips found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Generate Slip Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Salary Slip</DialogTitle>
            <DialogDescription>Create a new salary slip for an employee</DialogDescription>
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
                      {emp.firstName} {emp.lastName} - ${emp.salary.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select
                  value={formData.month}
                  onValueChange={(value) => setFormData({ ...formData, month: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                  min={2020}
                  max={2030}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowances">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: parseFloat(e.target.value) })}
                required
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })}
                required
                min={0}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Generate Slip</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Slip Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Salary Slip Details</DialogTitle>
          </DialogHeader>

          {viewingSlip && (
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{viewingSlip.employeeName}</h2>
                <p className="text-gray-600">{viewingSlip.month} {viewingSlip.year}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Basic Salary:</span>
                      <span className="font-medium">${viewingSlip.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Allowances:</span>
                      <span className="font-medium text-green-600">+${viewingSlip.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Gross Salary:</span>
                      <span className="font-bold">${(viewingSlip.basicSalary + viewingSlip.allowances).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-3">Deductions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Deductions:</span>
                      <span className="font-medium text-red-600">-${viewingSlip.deductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-900">Net Salary:</span>
                    <span className="text-3xl font-bold text-blue-600">${viewingSlip.netSalary.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600 border-t pt-4">
                  Generated on {format(new Date(viewingSlip.generatedDate), 'MMMM dd, yyyy')}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => handleDownload(viewingSlip)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
