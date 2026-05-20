
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendTestEmail() {
  try {
    console.log("Attempting to send email with:");
    console.log("User:", process.env.SMTP_USER);
    // console.log("Pass:", process.env.SMTP_PASS); // Don't log password

    const info = await transporter.sendMail({
        from: process.env.SMTP_USER || "test@example.com",
        to: process.env.SMTP_USER, // Send to self
        subject: "Test Email from LMS",
        text: "If you see this, email sending is working!",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendTestEmail();
