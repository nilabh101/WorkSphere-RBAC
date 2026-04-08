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
