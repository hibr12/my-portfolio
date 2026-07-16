import logger from './logger.js';

class EmailService {
  constructor() {
    this.configured = false;
    this.transporter = null;
  }

  async init() {
    const { default: env } = await import('../config/env.js');

    if (!env.EMAIL_HOST || !env.EMAIL_USER) {
      logger.warn('Email service not configured. Set EMAIL_HOST and EMAIL_USER in .env');
      return;
    }

    try {
      const { createTransport } = await import('nodemailer');
      this.transporter = createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_PORT === 465,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });
      await this.transporter.verify();
      this.configured = true;
      logger.info('Email service connected');
    } catch (error) {
      logger.error('Email service connection failed:', error.message);
    }
  }

  async send(to, subject, html) {
    if (!this.configured) {
      logger.warn('Email not sent — service not configured');
      return false;
    }

    const { default: env } = await import('../config/env.js');

    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM || env.EMAIL_USER,
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      logger.error('Email send failed:', error.message);
      return false;
    }
  }

  async sendContactThankYou(visitorName, visitorEmail) {
    const subject = 'Thank you for contacting me!';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3dd6c6;">Thank you, ${visitorName}!</h2>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>If your matter is urgent, feel free to reach me directly via phone.</p>
        <br/>
        <p>Best regards,<br/><strong>Hibru Yitayew</strong></p>
      </div>
    `;
    return this.send(visitorEmail, subject, html);
  }

  async sendAdminNotification(contactName, contactEmail, messagePreview) {
    const { default: env } = await import('../config/env.js');
    if (!env.ADMIN_EMAIL) return false;

    const subject = `New contact message from ${contactName}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${contactName} (${contactEmail})</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 3px solid #3dd6c6; padding-left: 1rem; color: #555;">
          ${messagePreview}
        </blockquote>
        <p>Log in to your admin dashboard to view and respond.</p>
      </div>
    `;
    return this.send(env.ADMIN_EMAIL, subject, html);
  }
}

export default new EmailService();
