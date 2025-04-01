const db = require("../config/db");

// Create Job
exports.createJob = (jobData, callback) => {
    const sql = "INSERT INTO jobs (employer_id, title, description, location, salary, requirements) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, jobData, callback);
};

// Get all Jobs
exports.getAllJobs = (callback) => {
    const sql = "SELECT * FROM jobs";
    db.query(sql, callback);
};

// Get Job by ID
exports.getJobById = (id, callback) => {
    const sql = "SELECT * FROM jobs WHERE id = ?";
    db.query(sql, [id], callback);
};

// Update Job
exports.updateJob = (jobData, callback) => {
    const sql = "UPDATE jobs SET title=?, description=?, location=?, salary=?, requirements=? WHERE id=? AND employer_id=?";
    db.query(sql, jobData, callback);
};

// Delete Job
exports.deleteJob = (id, employerId, callback) => {
    const sql = "DELETE FROM jobs WHERE id = ? AND employer_id = ?";
    db.query(sql, [id, employerId], callback);
};
