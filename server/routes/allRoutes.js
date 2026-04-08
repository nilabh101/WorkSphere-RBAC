const express = require('express');
const router = express.Router();
const { loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;

const express = require('express');
const { addEmployee, getEmployees, updateEmployee, deleteEmployee } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const adminRouter = express.Router();
adminRouter.use(protect, authorize('Admin'));
adminRouter.post('/employees', addEmployee);
adminRouter.get('/employees', getEmployees);
adminRouter.put('/employees/:id', updateEmployee);
adminRouter.delete('/employees/:id', deleteEmployee);

module.exports = adminRouter;

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

const express = require('express');
const { getEmployeeProfile, applyForLeave, toggleAttendance, getPersonalPerformance } = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

const employeeRouter = express.Router();
employeeRouter.use(protect);
employeeRouter.get('/profile', getEmployeeProfile);
employeeRouter.post('/leave', applyForLeave);
employeeRouter.post('/attendance', toggleAttendance);
employeeRouter.get('/performance', getPersonalPerformance);

module.exports = employeeRouter;
