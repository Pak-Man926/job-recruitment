import { useEffect, useState } from 'react';
import api from '../services/api';
import JobApplicationForm from './JobApplicationForm';

const JobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchJobs = async () => {
        try {
          const response = await api.get('/jobs');
          setJobs(response.data.jobs);
        } catch (err) {
          setError("Error fetching jobs.");
          console.error('Error fetching jobs:', err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchJobs();
    }, []);
  
    if (loading) return <div>Loading...</div>;

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
    
    return <ul>{jobList}</ul>;
    
  
    return (
      <div>
        <h2>Job Listings</h2>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>Location: {job.location}</p>
              <JobApplicationForm jobId={job.id} />
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default JobListings;