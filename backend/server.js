const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validateAccount } = require('./mt5Client');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const otpStore = new Map(); // In-memory store for OTPs: email -> { otp, expiresAt }

// Configure your email transporter (example using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };
  await transporter.sendMail(mailOptions);
}

// API to send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  otpStore.set(email, { otp, expiresAt });

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
});

// API to verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }
  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ error: 'OTP not found or expired' });
  }
  if (record.expiresAt < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }
  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
  otpStore.delete(email);
  res.json({ message: 'OTP verified successfully' });
});

// API to validate MT5 account credentials
app.post('/api/validate-mt5-account', async (req, res) => {
  const { brokerName, serverName, accountId, passcode } = req.body;
  if (!brokerName || !serverName || !accountId || !passcode) {
    return res.status(400).json({ error: 'All MT5 account fields are required' });
  }
  try {
    const isValid = await validateAccount(brokerName, serverName, accountId, passcode);
    if (isValid) {
      res.json({ valid: true });
    } else {
      res.status(400).json({ valid: false, error: 'Invalid MT5 account credentials' });
    }
  } catch (error) {
    console.error('MT5 validation error:', error);
    res.status(500).json({ error: 'Failed to validate MT5 account' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
