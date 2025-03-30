const db = require("../config/db");

exports.getEmployerDashboard = async (req, res) => {
    try {
        const employerId = req.user.id; // Employer ID from JWT

        const queries = [
            "SELECT COUNT(*) AS total_jobs FROM jobs WHERE employer_id = ?",
            "SELECT COUNT(*) AS active_jobs FROM jobs WHERE employer_id = ? AND status = 'active'",
            "SELECT COUNT(*) AS closed_jobs FROM jobs WHERE employer_id = ? AND status = 'closed'",
            "SELECT COUNT(*) AS total_applications FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE employer_id = ?)",
            "SELECT COUNT(*) AS pending_applications FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE employer_id = ?) AND application_status = 'pending'",
            "SELECT COUNT(*) AS accepted_applications FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE employer_id = ?) AND application_status = 'accepted'",
            "SELECT COUNT(*) AS rejected_applications FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE employer_id = ?) AND application_status = 'rejected'",
        ];

        const results = await Promise.all(queries.map(query => db.execute(query, [employerId])));
        
        res.json({
            success: true,
            stats: {
                total_jobs: results[0][0][0].total_jobs,
                active_jobs: results[1][0][0].active_jobs,
                closed_jobs: results[2][0][0].closed_jobs,
                total_applications: results[3][0][0].total_applications,
                pending_applications: results[4][0][0].pending_applications,
                accepted_applications: results[5][0][0].accepted_applications,
                rejected_applications: results[6][0][0].rejected_applications
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
