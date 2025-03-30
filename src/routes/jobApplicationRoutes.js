const express = require("express");
const { applyForJob, getAllApplications, getUserApplications, updateApplicationStatus, getJobApplications } = require("../controllers/applicationsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Apply for a job (User)
router.post("/apply", authMiddleware, applyForJob);

// Get all applications (Admin / Employer)
router.get("/", authMiddleware, getAllApplications);

// Get applications for logged-in user
router.get("/my-applications", authMiddleware, getUserApplications);

// Update application status (Admin / Employer)
router.put("/:id/status", authMiddleware, updateApplicationStatus);

router.get("/applications", authMiddleware, getJobApplications);

module.exports = router;
