import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home.js';
import Register from './pages/register';
import Auth from './pages/auth';
import Logout from './pages/logout';
import Navbar from './components/navbar';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/logout" element={<Logout />} />
          {/* <Route path="playlist/:id" /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
