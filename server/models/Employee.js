const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  employeeId: { type: String, unique: true, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  salary: {
    base: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    net: { type: Number, default: 0 },
  },
  onboardingSteps: [{
    task: String,
    completed: { type: Boolean, default: false }
  }],
  profileImage: { type: String },
  contactNumber: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
