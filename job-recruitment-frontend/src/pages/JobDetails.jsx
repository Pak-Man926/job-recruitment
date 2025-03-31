import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/${jobId}`)
      .then((response) => response.json())
      .then((data) => setJob(data))
      .catch((error) => console.error("Error fetching job details:", error));
  }, [jobId]);

  if (!job) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="container">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>

      <button onClick={() => navigate(`/apply/${job.id}`)}>Apply Now</button>
    </div>
  );
};

export default JobDetails;
