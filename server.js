const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Temporary In-Memory Storage Arrays
const attendanceData = [];
const leaveData = [];
const payrollData = [];

// --- 1. ATTENDANCE APIs ---
app.post('/api/attendance', (req, res) => {
  const record = {
    _id: "att_" + Math.random().toString(36).substr(2, 9),
    employeeId: req.body.employeeId,
    status: req.body.status, // Present, Absent, Half-day, Leave
    date: new Date().toISOString().split('T')[0]
  };
  attendanceData.push(record);
  res.send('Attendance saved successfully! Go back and refresh.');
});

app.get('/api/attendance', (req, res) => {
  res.json(attendanceData);
});

// --- 2. LEAVE APIs ---
app.post('/api/leaves', (req, res) => {
  const record = {
    _id: "lv_" + Math.random().toString(36).substr(2, 9),
    employeeId: req.body.employeeId,
    type: req.body.type, // Paid, Sick, Unpaid
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    remarks: req.body.remarks || '',
    status: 'Pending' // Default initial status
  };
  leaveData.push(record);
  res.send('Leave request saved successfully! Go back and refresh.');
});

app.get('/api/leaves', (req, res) => {
  res.json(leaveData);
});

// NEW: API Route for Admin to Approve or Reject Leave
app.post('/api/leaves/status', (req, res) => {
  const { leaveId, newStatus } = req.body;
  const leave = leaveData.find(item => item._id === leaveId);
  if (leave) {
    leave.status = newStatus;
    res.send(`Leave status updated to ${newStatus}! Go back and refresh.`);
  } else {
    res.status(404).send('Leave record not found.');
  }
});

// --- 3. PAYROLL APIs ---
app.post('/api/payroll', (req, res) => {
  const { employeeId, month, baseSalary, allowances, deductions } = req.body;
  const netSalary = Number(baseSalary) + Number(allowances) - Number(deductions);
  
  const record = {
    _id: "pay_" + Math.random().toString(36).substr(2, 9),
    employeeId,
    month,
    baseSalary: Number(baseSalary),
    allowances: Number(allowances),
    deductions: Number(deductions),
    netSalary
  };
  payrollData.push(record);
  res.send('Payroll calculated and saved successfully! Go back and refresh.');
});

app.get('/api/payroll', (req, res) => {
  res.json(payrollData);
});

app.listen(3000, () => console.log('Server live at http://localhost:3000 (Updated Mode)'));
