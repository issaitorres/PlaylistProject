import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home.js';
import Register from './pages/auth/register';
import Login from './pages/auth/login';
import Logout from './pages/auth/logout';
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import Playlist from './pages/playlist/playlist';
import Error from './pages/404/error'
import User from './pages/user/user'


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
          <Route path="/user" element={<User/>} />
          <Route path="*" element={<Error/>} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
