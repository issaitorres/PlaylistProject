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
import Restricted from './pages/auth/Restricted'
import Protected from "./pages/auth/Protected"
import './App.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
           <Route element={<Protected />}> {/* user must be logged in to access these pages */}
            <Route path="/logout" element={<Logout />} />
            <Route path="/playlist/:id" element={<Playlist/>} />
            <Route path="/user" element={<User/>} />
          </Route>
          <Route element={<Restricted />}>{/* user cannot access these pages while logged in*/}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="*" element={<Error/>} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
