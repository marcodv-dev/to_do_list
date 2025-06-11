import './App.css';
import { BrowserRouter as Router, Routes, Route/*, Link */} from "react-router-dom";
import Login from './Pages/Login/Login.jsx';
import Dashboard from './Pages/ToDoList/Dashboard.jsx';
import Profile from './Pages/Profilo/Profile.jsx';
import { UserProvider } from './Contexts/UserContext.jsx';

function App() {



  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
