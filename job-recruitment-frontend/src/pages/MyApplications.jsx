import React, { useState, useEffect } from "react";
import axios from "axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token"); // Get user JWT token
        const response = await axios.get("http://localhost:5000/api/applications/my-applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(response.data);
      } catch (err) {
        setError("Error fetching applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h2>My Job Applications</h2>
      {loading && <p>Loading applications...</p>}
      {error && <p>{error}</p>}
      {!loading && applications.length === 0 && <p>No applications found.</p>}
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            <strong>{app.job_title}</strong> at {app.company_name} - Status: {app.application_status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyApplications;
