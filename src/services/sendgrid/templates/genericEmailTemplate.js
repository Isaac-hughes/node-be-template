const generateEmailTemplate = (content) => {
  return `
 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <main style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        ${content}
      </main>
    </div>
    `;
};

module.exports = { generateEmailTemplate };
