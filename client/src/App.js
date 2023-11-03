import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  Home,
  Restricted,
  Protected,
  Register,
  Login,
  Logout,
  Playlist,
  User,
  Error
} from "./pages"
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import { AudioProvider } from "./AudioContext"
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
            <Route path="/user" element={<User/>} />
            <Route element={<AudioProvider />}>
              <Route path="/playlist/:id" element={<Playlist/>} />
            </Route>
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
