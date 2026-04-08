const User = require('../models/User');
const Employee = require('../models/Employee');

// @desc    Add new employee
// @route   POST /api/admin/employees
// @access  Private/Admin
const addEmployee = async (req, res) => {
  const { email, password, role, firstName, lastName, employeeId, department, designation, salary } = req.body;

  if (process.env.MOCK_MODE === 'true') {
    return res.status(201).json({
      _id: 'mock_user_' + Date.now(),
      email,
      role,
      employee: {
        _id: 'mock_emp_' + Date.now(),
        firstName,
        lastName,
        employeeId,
        department,
        designation,
        salary,
        onboardingSteps: [
          { task: 'Submit Documents', completed: false },
          { task: 'IT Setup', completed: false },
          { task: 'HR Induction', completed: false },
        ]
      },
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    email,
    password,
    role,
  });

  if (user) {
    const employee = await Employee.create({
      userId: user._id,
      firstName,
      lastName,
      employeeId,
      department,
      designation,
      salary,
      onboardingSteps: [
        { task: 'Submit Documents', completed: false },
        { task: 'IT Setup', completed: false },
        { task: 'HR Induction', completed: false },
      ]
    });

    user.employeeId = employee._id;
    await user.save();

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      employee,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
  if (process.env.MOCK_MODE === 'true') {
    return res.json([
      {
        _id: 'mock_emp_1',
        firstName: 'John',
        lastName: 'Doe',
        employeeId: 'EMP-001',
        department: 'Engineering',
        designation: 'Senior Developer',
        userId: { _id: 'mock_user_1', email: 'john@worksphere.com', role: 'Employee' }
      },
      {
        _id: 'mock_emp_2',
        firstName: 'Sarah',
        lastName: 'Wilson',
        employeeId: 'EMP-002',
        department: 'HR',
        designation: 'Talent Acquisition',
        userId: { _id: 'mock_user_2', email: 'sarah@worksphere.com', role: 'HR' }
      },
      {
        _id: 'mock_emp_3',
        firstName: 'System',
        lastName: 'Admin',
        employeeId: 'ADM-001',
        department: 'IT',
        designation: 'Platform Owner',
        userId: { _id: 'mock_user_3', email: 'admin@worksphere.com', role: 'Admin' }
      }
    ]);
  }

  const employees = await Employee.find({}).populate('userId', 'email role');
  res.json(employees);
};

// @desc    Update employee
// @route   PUT /api/admin/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
  if (process.env.MOCK_MODE === 'true') {
    return res.json({ ...req.body, _id: req.params.id });
  }

  const employee = await Employee.findById(req.params.id);

  if (employee) {
    employee.firstName = req.body.firstName || employee.firstName;
    employee.lastName = req.body.lastName || employee.lastName;
    employee.department = req.body.department || employee.department;
    employee.designation = req.body.designation || employee.designation;
    employee.salary = req.body.salary || employee.salary;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  if (process.env.MOCK_MODE === 'true') {
    return res.json({ message: 'Employee removed (Mock)' });
  }

  const employee = await Employee.findById(req.params.id);

  if (employee) {
    await User.findByIdAndDelete(employee.userId);
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee removed' });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
};

module.exports = { addEmployee, getEmployees, updateEmployee, deleteEmployee };
