import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage, // receive image in memory form
  limits: {
    fileSize: 8 * 1024 * 1024, // limit the maximum image upload size to 8MB
  },
});
