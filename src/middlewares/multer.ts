// middleware/multer.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Specify the directory where uploaded files will be stored
const uploadDirectory = path.join(__dirname + '../../uploads/');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
