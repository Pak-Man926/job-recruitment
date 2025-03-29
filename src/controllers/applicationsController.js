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
