const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email
 */
exports.sendEmail = async ({ to, subject, text, html, template, data }) => {
  try {
    const transporter = createTransporter();

    // TODO: Implement email templates
    // If template is provided, generate HTML from template + data
    let emailHtml = html;
    if (template) {
      emailHtml = generateEmailFromTemplate(template, data);
    }

    const mailOptions = {
      from: `QuickJuice <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

/**
 * Send order confirmation email
 */
exports.sendOrderConfirmation = async (order, user) => {
  const subject = `Order Confirmation - ${order.orderNumber}`;
  const html = `
    <h1>Thank you for your order!</h1>
    <p>Hi ${user.name},</p>
    <p>Your order has been confirmed and is being prepared.</p>
    <h2>Order Details</h2>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Total:</strong> $${order.pricing.total.toFixed(2)}</p>
    <p><strong>Estimated Delivery:</strong> ${order.estimatedDeliveryTime}</p>
    <p>You can track your order in real-time through the app.</p>
    <p>Thank you for choosing QuickJuice!</p>
  `;

  return await this.sendEmail({
    to: user.email,
    subject,
    html,
  });
};

/**
 * Send order status update
 */
exports.sendOrderStatusUpdate = async (order, user, status) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed',
    preparing: 'Your order is being prepared',
    ready: 'Your order is ready for pickup',
    picked_up: 'Your order has been picked up by the rider',
    on_the_way: 'Your order is on the way',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  const subject = `Order Update - ${order.orderNumber}`;
  const html = `
    <h1>Order Status Update</h1>
    <p>Hi ${user.name},</p>
    <p>${statusMessages[status]}</p>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p>Track your order in real-time through the app.</p>
  `;

  return await this.sendEmail({
    to: user.email,
    subject,
    html,
  });
};

/**
 * Send password reset email
 */
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset</h1>
    <p>Hi ${user.name},</p>
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetURL}">${resetURL}</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return await this.sendEmail({
    to: user.email,
    subject,
    html,
  });
};

/**
 * Send SMS notification
 * TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
 */
exports.sendSMS = async (to, message) => {
  try {
    logger.info(`SMS would be sent to ${to}: ${message}`);
    // TODO: Implement SMS sending logic
    return { success: true };
  } catch (error) {
    logger.error('SMS send error:', error);
    throw error;
  }
};

/**
 * Send push notification
 * TODO: Integrate with push notification service (FCM, OneSignal, etc.)
 */
exports.sendPushNotification = async (userId, title, body, data) => {
  try {
    logger.info(`Push notification would be sent to ${userId}: ${title}`);
    // TODO: Implement push notification logic
    return { success: true };
  } catch (error) {
    logger.error('Push notification error:', error);
    throw error;
  }
};

/**
 * Generate email HTML from template
 */
const generateEmailFromTemplate = (template, data) => {
  // TODO: Implement email template rendering
  // You can use template engines like Handlebars, Pug, etc.
  return `<p>Email template: ${template}</p>`;
};
