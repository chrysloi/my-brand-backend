import { existsSync, mkdirSync } from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imageStore = "./images";
    if (!existsSync(imageStore)) {
      mkdirSync(imageStore, { recursive: true });
    }
    return cb(null, imageStore);
  },
  filename(req, file, callback) {
    const ext = path.extname(file.originalname).split(".")[1];
    const fileName = file.originalname.split(".")[0];
    let mediaLink = `${fileName}-${Date.now()}.${ext}`;
    if (file.fieldname === "articleImage") {
      mediaLink = `article-${Date.now()}.${ext}`;
    } else if (file.fieldname === "projectImage") {
      mediaLink = `project-${Date.now()}.${ext}`;
    }
    return callback(null, mediaLink);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});
