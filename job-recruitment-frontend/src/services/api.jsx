import axios from 'axios';

// Set up a default instance of axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
  timeout: 10000,
});

// Add JWT token to headers for authenticated requests
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Token expired or unauthorized
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);


export default api;
