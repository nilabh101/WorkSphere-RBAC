const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['Paid Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave'],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  appliedDate: { type: Date, default: Date.now },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'On Leave'],
    default: 'Present',
  },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Performance Review Schema
const performanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = {
  Leave: mongoose.model('Leave', leaveSchema),
  Attendance,
  Performance,
};
