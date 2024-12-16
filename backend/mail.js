const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: 'emailforhackathon1@gmail.com', // Your Gmail address
    pass: 'jaymhmhfjbgtfxez', // Your App Password
  },
});

// Email details
const mailOptions = {
  from: 'emailforhackathon1@gmail.com', // Sender
  to: 'rajmohanking20@gmail.com', // Replace with the recipient email
  subject: 'SMTP Test Email',
  text: 'Hello! This is a test email sent via Gmail SMTP.',
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error:', error);
  }
  console.log('Email sent:', info.response);
});
