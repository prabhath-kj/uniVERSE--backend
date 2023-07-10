import { log } from "console";
import multer from "multer";
import path from "path";

export default multer({
  storage: multer.diskStorage({}),
  limits: {
    files: 4,
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      cb(new Error("File type is not supported"), false);
    } else {
      cb(null, true);
    }
  },
  
});
