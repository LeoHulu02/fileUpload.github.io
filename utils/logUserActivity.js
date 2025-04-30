const fs = require('fs');
const path = require('path');

function logUserActivity(fileName, data) {
  const logFilePath = path.join(__dirname, '../logs', fileName);
  const logEntry = `${new Date().toISOString()} - ${data}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Gagal menulis log:', err);
    }
  });
}

module.exports = logUserActivity;
