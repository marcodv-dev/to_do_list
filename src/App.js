import './App.css';
import { BrowserRouter as Router, Routes, Route/*, Link */} from "react-router-dom";
import Login from './Pages/Login/Login.jsx';
import Dashboard from './Pages/ToDoList/Dashboard.jsx';
import Profile from './Pages/Profilo/Profile.jsx';
import Registration from './Pages/Registration/Registrazione.jsx';
import { UserProvider } from './Contexts/UserContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {



  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/Dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          {/* <Route path="/Profile" element={<Profile />} /> */}
          <Route path="/Registration" element={<Registration />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
