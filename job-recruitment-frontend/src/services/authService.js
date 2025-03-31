import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Adjust if needed

// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);

    }
    return response.data;
  } catch (error) {
    throw new Error("Login failed, please check your credentials");
  }
};


// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token"); // Clear token
  window.location.href = "/login"; // Redirect to login page
};