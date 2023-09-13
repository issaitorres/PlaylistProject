import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home.js';
import Register from './pages/auth/register';
import Login from './pages/auth/auth';
import Logout from './pages/auth/logout';
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import Playlist from './pages/playlist/playlist';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/playlist/:id" element={<Playlist/>} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
