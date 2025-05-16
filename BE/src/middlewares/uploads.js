import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const ebookUploadDir = path.join(process.cwd(), "public/uploads/ebooks");
const coverUploadDir = path.join(process.cwd(), "public/uploads/covers");

if (!fs.existsSync(ebookUploadDir)) {
  fs.mkdirSync(ebookUploadDir, { recursive: true });
}
if (!fs.existsSync(coverUploadDir)) {
  fs.mkdirSync(coverUploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose destination based on field name
    if (file.fieldname === "ebook") {
      cb(null, ebookUploadDir);
    } else if (file.fieldname === "cover") {
      cb(null, coverUploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ebookTypes = ["application/pdf", "application/vnd.ms-powerpoint"];
    const coverTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (file.fieldname === "ebook" && ebookTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (file.fieldname === "cover" && coverTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${file.fieldname === "ebook" ? "PDF, PPT" : "PNG, JPEG"}`), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for both
  },
});

export default upload;