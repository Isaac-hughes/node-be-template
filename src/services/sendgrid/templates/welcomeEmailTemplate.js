const { generateEmailTemplate } = require('./genericEmailTemplate');

const generateWelcomeEmailContent = (firstName) => {
  return generateEmailTemplate(`
    <div style="text-align: center;">
      <h1 style="color: #333; margin-bottom: 20px;">Welcome to Our Platform!</h1>
      <p style="font-size: 18px; color: #666; margin-bottom: 30px;">
        Hi ${firstName}, we're excited to have you on board!
      </p>
      <p style="color: #666; margin-bottom: 20px;">
        We're here to help you get the most out of your experience. If you have any questions, 
        feel free to reach out to our support team.
      </p>
      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="color: #666; margin: 0;">
          Best regards,<br>
          The Team
        </p>
      </div>
    </div>
  `);
};

module.exports = { generateWelcomeEmailContent };
