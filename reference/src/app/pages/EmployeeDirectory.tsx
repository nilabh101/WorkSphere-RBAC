import React, { useState, useMemo } from 'react';
import { storageService } from '../services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Search,
  Phone,
  Mail,
  Building2,
  Briefcase,
  Filter,
  Grid,
  List,
  MapPin,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function EmployeeDirectory() {
  const employees = storageService.getEmployees();
  const departments = storageService.getDepartments();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === 'all' || emp.department === departmentFilter;

      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  // Group employees by department
  const employeesByDepartment = useMemo(() => {
    const grouped: { [key: string]: typeof employees } = {};
    filteredEmployees.forEach((emp) => {
      if (!grouped[emp.department]) {
        grouped[emp.department] = [];
      }
      grouped[emp.department].push(emp);
    });
    return grouped;
  }, [filteredEmployees]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  const EmployeeGridCard = ({ employee }: { employee: typeof employees[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarFallback className="bg-indigo-600 text-white text-lg">
              {getInitials(employee.firstName, employee.lastName)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{employee.position}</p>
          <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'} className="mb-4">
            {employee.status}
          </Badge>

          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{employee.department}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{employee.phone}</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmployeeListItem = ({ employee }: { employee: typeof employees[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-indigo-600 text-white">
              {getInitials(employee.firstName, employee.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">
                {employee.firstName} {employee.lastName}
              </h3>
              <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'} className="flex-shrink-0">
                {employee.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">{employee.position}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
        <p className="text-gray-600 mt-1">Browse and search all employees</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
            <Button variant="ghost" size="sm" onClick={() => {
              setSearchQuery('');
              setDepartmentFilter('all');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee List/Grid */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Employees ({filteredEmployees.length})</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeGridCard key={employee.id} employee={employee} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmployees.map((employee) => (
                <EmployeeListItem key={employee.id} employee={employee} />
              ))}
            </div>
          )}

          {filteredEmployees.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">No employees found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {Object.entries(employeesByDepartment).map(([dept, emps]) => (
            <Card key={dept}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{dept}</span>
                  <Badge variant="secondary">{emps.length} employees</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {emps.map((employee) => (
                      <EmployeeGridCard key={employee.id} employee={employee} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emps.map((employee) => (
                      <EmployeeListItem key={employee.id} employee={employee} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {Object.keys(employeesByDepartment).length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">No employees found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
