const { Leave, Attendance, Performance } = require('../models/LeaguesAttendancePerformance');
const Employee = require('../models/Employee');

// @desc    Get current employee profile
// @route   GET /api/employee/profile
// @access  Private
const getEmployeeProfile = async (req, res) => {
  if (process.env.MOCK_MODE === 'true') {
    return res.json({
      _id: 'mock_emp_123',
      firstName: 'John',
      lastName: 'Doe',
      employeeId: 'EMP-001',
      department: 'Engineering',
      designation: 'Senior Developer',
      userId: { _id: 'mock_user_123', email: 'employee@worksphere.com', role: 'Employee' }
    });
  }

  const employee = await Employee.findOne({ userId: req.user._id }).populate('userId', 'email role');
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ message: 'Profile not found' });
  }
};

// @desc    Apply for leave
// @route   POST /api/employee/leave
// @access  Private
const applyForLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (process.env.MOCK_MODE === 'true') {
    return res.status(201).json({
      _id: 'mock_leave_' + Date.now(),
      employeeId: 'mock_emp_123',
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'Pending'
    });
  }

  const employee = await Employee.findOne({ userId: req.user._id });

  if (employee) {
    const leave = await Leave.create({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    res.status(201).json(leave);
  } else {
    res.status(404).json({ message: 'Employee profile not found' });
  }
};

// @desc    Check-in/Check-out for attendance
// @route   POST /api/employee/attendance
// @access  Private
const toggleAttendance = async (req, res) => {
  const date = new Date().toISOString().split('T')[0];

  if (process.env.MOCK_MODE === 'true') {
    return res.json({
      _id: 'mock_att_' + Date.now(),
      employeeId: 'mock_emp_123',
      date,
      checkIn: new Date(),
      checkOut: null
    });
  }

  const employee = await Employee.findOne({ userId: req.user._id });

  let record = await Attendance.findOne({ employeeId: employee._id, date });

  if (record) {
    if (record.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }
    record.checkOut = new Date();
    await record.save();
    res.json(record);
  } else {
    record = await Attendance.create({
      employeeId: employee._id,
      date,
      checkIn: new Date(),
    });
    res.status(201).json(record);
  }
};

// @desc    Get personal performance feedback
// @route   GET /api/employee/performance
// @access  Private
const getPersonalPerformance = async (req, res) => {
  if (process.env.MOCK_MODE === 'true') {
    return res.json([
      {
        _id: 'mock_perf_1',
        employeeId: 'mock_emp_123',
        reviewerId: { email: 'hr@worksphere.com' },
        rating: 4,
        feedback: 'Great progress on the project!',
        date: '2026-03-20'
      }
    ]);
  }

  const employee = await Employee.findOne({ userId: req.user._id });
  if (employee) {
    const reviews = await Performance.find({ employeeId: employee._id }).populate('reviewerId', 'email');
    res.json(reviews);
  } else {
    res.status(404).json({ message: 'Profile not found' });
  }
};

module.exports = { getEmployeeProfile, applyForLeave, toggleAttendance, getPersonalPerformance };
