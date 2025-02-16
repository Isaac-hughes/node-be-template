const sgMail = require('@sendgrid/mail');
const logger = require('../../utils/logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email using SendGrid.
 * @param {string} to - The recipient's email address.
 * @param {string} from - The sender's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, from, subject, text, html }) => {
  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    logger.info('Email sent successfully', {
      to,
      from,
      subject,
      messageId: msg.messageId,
    });
  } catch (error) {
    logger.error('Error sending email:', {
      error: error.message,
      details: error.response?.body,
      to,
      from,
      subject,
    });
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmail };
