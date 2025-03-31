import React, { useState } from "react";
import axios from "axios";

const JobApplicationForm = ({ jobId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // Get JWT token
      const formDataToSend = new FormData();
      formDataToSend.append("job_id", jobId);
      formDataToSend.append("resume", formData.resume);
      
      // Send data to backend
      const response = await axios.post(
        "http://localhost:5000/api/applications/apply",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setFormData({ fullName: "", email: "", phone: "", resume: null });
    } catch (error) {
      setMessage("Error submitting application");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Apply for this Job</h2>
      <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
      <input type="file" name="resume" onChange={handleFileChange} required />
      <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Apply Now"}</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default JobApplicationForm;
