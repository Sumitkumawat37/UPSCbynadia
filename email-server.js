import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store reset tokens in memory (in production, use a database)
const resetTokens = new Map();

// Nodemailer configuration using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nadiyakhan0205@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Use app-specific password
  }
});

// Send password reset email
app.post('/api/v1/email/send-password-reset', async (req, res) => {
  try {
    const { email, frontendUrl } = req.body;

    if (!email || !frontendUrl) {
      return res.status(400).json({ message: 'Email and frontendUrl are required' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    // Store token with expiration (1 hour)
    resetTokens.set(token, {
      email,
      expiresAt: Date.now() + 3600000 // 1 hour
    });

    // Send email
    const mailOptions = {
      from: 'nadiyakhan0205@gmail.com',
      to: email,
      subject: 'Password Reset - UPSC Nadiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6366f1;">Password Reset Request</h2>
          <p>You requested a password reset for your UPSC Nadiya account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #ec4899); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
});

// Send email verification
app.post('/api/v1/email/send-verification', async (req, res) => {
  try {
    const { email, name, frontendUrl } = req.body;

    if (!email || !frontendUrl) {
      return res.status(400).json({ message: 'Email and frontendUrl are required' });
    }

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');
    const verifyLink = `${frontendUrl}/verify-email?token=${token}`;

    // Store token with expiration (24 hours)
    resetTokens.set(`verify_${token}`, {
      email,
      expiresAt: Date.now() + 86400000 // 24 hours
    });

    // Send email
    const mailOptions = {
      from: 'nadiyakhan0205@gmail.com',
      to: email,
      subject: 'Email Verification - UPSC Nadiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6366f1;">Email Verification</h2>
          <p>Welcome to UPSC Nadiya, ${name || 'Student'}!</p>
          <p>Please verify your email address to complete your registration.</p>
          <p>Click the link below to verify your email:</p>
          <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #ec4899); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Failed to send verification email' });
  }
});

// Reset password with token
app.post('/api/v1/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify token
    const tokenData = resetTokens.get(token);
    if (!tokenData) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check if token is expired
    if (Date.now() > tokenData.expiresAt) {
      resetTokens.delete(token);
      return res.status(400).json({ message: 'Token has expired' });
    }

    // In production, you would update the password in your database here
    // For now, we'll just delete the token and return success
    resetTokens.delete(token);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
