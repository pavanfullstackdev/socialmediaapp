//middleware to use the multer so

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);

    //we can add suffix to handle same name
  },
});

export const upload = multer({
  storage,
});
