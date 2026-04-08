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
