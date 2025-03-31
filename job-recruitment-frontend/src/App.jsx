import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import JobApplication from "./pages/JobApplication";
import MyApplications from "./pages/MyApplications";
import EmployerDashboard from "./pages/EmployerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthGuard from "./components/AuthGuard";  // Ensure this exists
import JobListings from "./components/JobListings";

const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

function ErrorBoundary({ children }) {
  useEffect(() => {
    window.addEventListener("error", (event) => {
      console.error("Global Error:", event.error);
    });
  }, []);

  return children;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default Route */}
        <Route path="/home" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply/:id" element={<JobApplication />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/employer-dashboard" 
          element={ 
            <AuthGuard>
              <EmployerDashboard />
            </AuthGuard> 
          } 
        />
        {/* Redirect to login page if the user is not authenticated */}
        <Route 
          path="/dashboard" 
          element={ 
            <AuthGuard>
              <EmployerDashboard />
            </AuthGuard> 
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
