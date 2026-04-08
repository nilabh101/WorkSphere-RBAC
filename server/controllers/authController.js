const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_change_me', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Mock Mode Fallback
  if (process.env.MOCK_MODE === 'true') {
    const mockUsers = [
      { email: 'admin@worksphere.com', role: 'Admin', firstName: 'System', lastName: 'Admin' },
      { email: 'hr@worksphere.com', role: 'HR', firstName: 'Sarah', lastName: 'Wilson' },
      { email: 'employee@worksphere.com', role: 'Employee', firstName: 'John', lastName: 'Doe' },
    ];
    
    const mockUser = mockUsers.find(u => u.email === email);
    if (mockUser) {
      return res.json({
        _id: 'mock_id_' + mockUser.role,
        email: mockUser.email,
        role: mockUser.role,
        token: 'mock_token_for_' + mockUser.role,
        isMock: true
      });
    }
  }

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({
    email,
    password,
    role: 'Employee'
  });

  if (user) {
    // Also create a default employee profile
    const employee = await Employee.create({
      userId: user._id,
      firstName: firstName || 'New',
      lastName: lastName || 'Employee',
      employeeId: `EMP-${Date.now().toString().slice(-4)}`,
      department: 'Unassigned',
      designation: 'Staff',
    });

    user.employeeId = employee._id;
    await user.save();

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  if (req.headers.authorization && req.headers.authorization.includes('mock_token')) {
    return res.json({
      firstName: 'Mock',
      lastName: 'User',
      designation: 'Demonstration Account',
      department: 'Testing',
      employeeId: 'MOCK-001'
    });
  }

  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { loginUser, registerUser, getUserProfile };
