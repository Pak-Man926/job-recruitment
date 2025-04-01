const express = require("express");
const { applyForJob, getJobApplications } = require("../controllers/applicationsController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Apply for a job (User) with file upload for resume
router.post("/apply", authMiddleware, upload.single('resume'), applyForJob);


// Other routes remain the same
//router.get("/", authMiddleware, getAllApplications);
//router.get("/my-applications", authMiddleware, getUserApplications);
//router.put("/:id/status", authMiddleware, updateApplicationStatus);
router.get("/", authMiddleware, getJobApplications);

module.exports = router;
