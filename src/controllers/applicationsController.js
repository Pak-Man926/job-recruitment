const db = require("../config/db");

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { job_id, resume_id } = req.body;
        const user_id = req.user.id; // Retrieved from JWT auth middleware

        if (!job_id || !resume_id) {
            return res.status(400).json({ message: "Job ID and Resume ID are required" });
        }

        // Insert application into database
        await db.query(
            "INSERT INTO applications (job_id, user_id, resume_id) VALUES (?, ?, ?)",
            [job_id, user_id, resume_id]
        );

        res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all applications (Admin / Employer)
exports.getAllApplications = async (req, res) => {
    try {
        const [applications] = await db.query("SELECT * FROM applications");
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get applications by user ID
exports.getUserApplications = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [applications] = await db.query("SELECT * FROM applications WHERE user_id = ?", [user_id]);
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update application status (Admin / Employer)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { application_status } = req.body;

        const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
        if (!validStatuses.includes(application_status)) {
            return res.status(400).json({ message: "Invalid application status" });
        }

        await db.query("UPDATE applications SET application_status = ? WHERE id = ?", [application_status, id]);
        res.json({ message: "Application status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch job applications based on user type
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

