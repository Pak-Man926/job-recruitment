const db = require("../config/db");

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { job_id } = req.body;
        const user_id = req.user.id; // Retrieved from JWT auth middleware
        const resume = req.file; // File data from multer (resume)

        if (!job_id || !resume) {
            return res.status(400).json({ message: "Job ID and Resume are required" });
        }

        // Insert application into database
        await db.query(
            "INSERT INTO applications (job_id, user_id, resume_id) VALUES (?, ?, ?)",
            [job_id, user_id, resume.filename] // Store resume filename or path
        );

        res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// In applicationsController.js
exports.getJobApplications = async (req, res) => {
    try {
        const userId = req.user.id; // Extract from JWT
        const userType = req.user.user_type; // 'employer' or 'applicant'
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query;
        let values = [limit, offset];

        if (userType === "employer") {
            // Employer: Fetch applications for their posted jobs
            query = `
                SELECT a.*, j.title AS job_title, u.full_name AS applicant_name, r.file_path AS resume
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                JOIN users u ON a.user_id = u.id
                JOIN resumes r ON a.resume_id = r.id
                WHERE j.employer_id = ?
                LIMIT ? OFFSET ?;
            `;
            values.unshift(userId);
        } else if (userType === "applicant") {
            // Applicant: Fetch their own job applications
            query = `
                SELECT a.*, j.title AS job_title, j.company AS company_name
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                WHERE a.user_id = ?
                LIMIT ? OFFSET ?;
            `;
            values.unshift(userId);
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const [applications] = await db.execute(query, values);

        res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

