const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, '../../../uploads/user');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage(); // use memory storage

const upload = multer({ storage });

const saveDeduplicatedFile = async (file) => {
  const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
  const ext = path.extname(file.originalname);
  const filename = `${hash}${ext}`;
  const fullPath = path.join(uploadDir, filename);

  // Avoid overwriting if already exists
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, file.buffer);
  }

  return `/uploads/user/${filename}`;
};

module.exports = {
  upload,
  saveDeduplicatedFile,
};