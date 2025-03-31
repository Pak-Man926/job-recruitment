import { useState } from 'react';
import { applyForJob } from '../services/jobService'; // We'll create this service

const JobApplicationForm = ({ jobId }) => {
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(pdf|docx)$/)) {
      setMessage("Please upload a valid resume (PDF/DOCX).");
      return;
    }
    setResume(file);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setMessage('Please upload a resume.');
      return;
    }
  
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_id', jobId);
  
    try {
      const response = await applyForJob(formData);
      setMessage(response.message); // Success message
      setResume(null); // Reset file input
    } catch (err) {
      setMessage('Error submitting application');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="resume" onChange={handleFileChange} required />
      <button type="submit">Apply for Job</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default JobApplicationForm;
