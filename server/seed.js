const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Employee = require('./models/Employee');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worksphere-rbac');

    // Clear existing data
    await User.deleteMany();
    await Employee.deleteMany();

    // Create Admin
    const adminUser = await User.create({
      email: 'admin@worksphere.com',
      password: 'admin123',
      role: 'Admin',
    });

    const adminEmployee = await Employee.create({
      userId: adminUser._id,
      firstName: 'System',
      lastName: 'Administrator',
      employeeId: 'WS-001',
      department: 'Management',
      designation: 'Super Admin',
    });

    adminUser.employeeId = adminEmployee._id;
    await adminUser.save();

    // Create HR
    const hrUser = await User.create({
      email: 'hr@worksphere.com',
      password: 'hr123',
      role: 'HR',
    });

    const hrEmployee = await Employee.create({
      userId: hrUser._id,
      firstName: 'Sarah',
      lastName: 'Wilson',
      employeeId: 'WS-002',
      department: 'Human Resources',
      designation: 'HR Manager',
    });

    hrUser.employeeId = hrEmployee._id;
    await hrUser.save();

    // Create Employee
    const empUser = await User.create({
      email: 'employee@worksphere.com',
      password: 'user123',
      role: 'Employee',
    });

    const empEmployee = await Employee.create({
      userId: empUser._id,
      firstName: 'John',
      lastName: 'Doe',
      employeeId: 'WS-003',
      department: 'Engineering',
      designation: 'Software Developer',
    });

    empUser.employeeId = empEmployee._id;
    await empUser.save();

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
