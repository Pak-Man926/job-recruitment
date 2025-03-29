
const db = require('../config/db');

exports.createJob = async (req, res) => {
    const { employer_id, job_title, job_description, required_skills, location, job_type, salary_range } = req.body;

    if (!employer_id || !job_title || !job_description || !required_skills || !job_type) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO Jobs (employer_id, job_title, job_description, required_skills, location, job_type, salary_range) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [employer_id, job_title, job_description, required_skills, location, job_type, salary_range]
        );

        res.status(201).json({ message: 'Job posted successfully', jobId: result.insertId });
    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const [jobs] = await db.execute("SELECT * FROM Jobs ORDER BY posted_at DESC");
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
