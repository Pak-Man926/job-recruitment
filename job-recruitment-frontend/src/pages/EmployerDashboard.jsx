import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token"); // Get employer JWT token
        const response = await axios.get("http://localhost:5000/api/applications/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(response.data.applications);
      } catch (err) {
        setError("Error fetching applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { application_status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update status locally
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId ? { ...app, application_status: status } : app
        )
      );
    } catch (err) {
      setError("Error updating application status");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Employer Dashboard</h2>
      {loading && <p>Loading applications...</p>}
      {error && <p>{error}</p>}
      {!loading && applications.length === 0 && <p>No applications found.</p>}
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            <strong>{app.job_title}</strong> at {app.company_name} - Status: {app.application_status}
            <div>
              <button onClick={() => updateStatus(app.id, "reviewed")}>Mark as Reviewed</button>
              <button onClick={() => updateStatus(app.id, "accepted")}>Accept</button>
              <button onClick={() => updateStatus(app.id, "rejected")}>Reject</button>
            </div>
            <Link to={`/jobs/${app.job_id}`}>View Job</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployerDashboard;
