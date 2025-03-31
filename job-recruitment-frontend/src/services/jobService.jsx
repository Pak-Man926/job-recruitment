import api from './api';

export const applyForJob = async (formData) => {
  try {
    const response = await api.post('/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // For file upload
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error applying for the job, please try again");
  }
};

