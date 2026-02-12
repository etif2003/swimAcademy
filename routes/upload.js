import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

// לא שומרים קובץ בדיסק – רק בזיכרון
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "לא נבחר קובץ" });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "swim-project",
    });

    res.json({ url: result.secure_url });

  } catch (err) {
    res.status(500).json({ message: "שגיאה בהעלאה", error: err.message });
  }
});

export default router;
