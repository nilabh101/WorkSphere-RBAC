const { Leave, Attendance, Performance } = require('../models/LeaguesAttendancePerformance');
const Employee = require('../models/Employee');

// @desc    Get all leave requests
// @route   GET /api/hr/leaves
// @access  Private/HR
const getLeaveRequests = async (req, res) => {
  if (process.env.MOCK_MODE === 'true') {
    return res.json([
      {
        _id: 'mock_leave_1',
        employeeId: { firstName: 'John', lastName: 'Doe', employeeId: 'EMP-001', department: 'Engineering' },
        type: 'Sick',
        startDate: '2026-04-10',
        endDate: '2026-04-12',
        reason: 'Flu symptoms',
        status: 'Pending'
      },
      {
        _id: 'mock_leave_2',
        employeeId: { firstName: 'Alice', lastName: 'Smith', employeeId: 'EMP-005', department: 'Marketing' },
        type: 'Casual',
        startDate: '2026-04-20',
        endDate: '2026-04-21',
        reason: 'Family event',
        status: 'Approved'
      }
    ]);
  }

  const leaves = await Leave.find({}).populate('employeeId', 'firstName lastName employeeId department');
  res.json(leaves);
};

// @desc    Approve/Reject leave
// @route   PUT /api/hr/leaves/:id
// @access  Private/HR
const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  if (process.env.MOCK_MODE === 'true') {
    return res.json({ _id: req.params.id, status, approvedBy: 'mock_hr_id' });
  }

  const leave = await Leave.findById(req.params.id);

  if (leave) {
    leave.status = status;
    leave.approvedBy = req.user._id;
    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } else {
    res.status(404).json({ message: 'Leave not found' });
  }
};

// @desc    Get all attendance records
// @route   GET /api/hr/attendance
// @access  Private/HR
const getAttendanceRecords = async (req, res) => {
  if (process.env.MOCK_MODE === 'true') {
    return res.json([
      {
        _id: 'mock_att_1',
        employeeId: { firstName: 'John', lastName: 'Doe', employeeId: 'EMP-001', department: 'Engineering' },
        date: '2026-04-05',
        checkIn: '09:00 AM',
        checkOut: '06:00 PM',
        status: 'Present'
      },
      {
        _id: 'mock_att_2',
        employeeId: { firstName: 'Bob', lastName: 'Johnson', employeeId: 'EMP-003', department: 'Design' },
        date: '2026-04-05',
        checkIn: '09:15 AM',
        checkOut: '05:30 PM',
        status: 'Present'
      }
    ]);
  }

  const attendance = await Attendance.find({}).populate('employeeId', 'firstName lastName employeeId department');
  res.json(attendance);
};

// @desc    Add performance review
// @route   POST /api/hr/performance
// @access  Private/HR
const addPerformanceReview = async (req, res) => {
  const { employeeId, rating, feedback } = req.body;

  if (process.env.MOCK_MODE === 'true') {
    return res.status(201).json({
      _id: 'mock_perf_' + Date.now(),
      employeeId,
      reviewerId: 'mock_hr_id',
      rating,
      feedback,
      date: new Date()
    });
  }

  const review = await Performance.create({
    employeeId,
    reviewerId: req.user._id,
    rating,
    feedback,
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400).json({ message: 'Invalid performance data' });
  }
};

module.exports = { getLeaveRequests, updateLeaveStatus, getAttendanceRecords, addPerformanceReview };
