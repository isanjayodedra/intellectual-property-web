const fs = require('fs');
const path = require('path');

const renderTemplate = (templateName, variables = {}) => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf8');

  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, variables[key]);
  }

  return html;
};

module.exports = { renderTemplate };