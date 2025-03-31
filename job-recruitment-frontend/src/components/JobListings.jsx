import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import JobApplicationForm from "./JobApplicationForm";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 🔥 Use `useMemo` properly here (before return)
  const jobList = useMemo(() => {
    return jobs.map((job) => (
      <li key={job.id}>
        <h3>{job.title}</h3>
        <p>{job.description}</p>
        <p>Location: {job.location}</p>
        <JobApplicationForm jobId={job.id} />
      </li>
    ));
  }, [jobs]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Job Listings</h2>
      <ul>{jobList}</ul>
    </div>
  );
};

export default JobListings;
