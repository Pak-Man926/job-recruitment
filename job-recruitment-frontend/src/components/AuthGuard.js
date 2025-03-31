import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }
  return children;
};


export default AuthGuard;
