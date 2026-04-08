const express = require('express');
const { getLeaveRequests, updateLeaveStatus, getAttendanceRecords, addPerformanceReview } = require('../controllers/hrController');
const { protect, authorize } = require('../middleware/auth');

const hrRouter = express.Router();
hrRouter.use(protect, authorize('HR', 'Admin'));
hrRouter.get('/leaves', getLeaveRequests);
hrRouter.put('/leaves/:id', updateLeaveStatus);
hrRouter.get('/attendance', getAttendanceRecords);
hrRouter.post('/performance', addPerformanceReview);

module.exports = hrRouter;
