import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import Register from './components/Register.jsx';
import Request from './components/Request.jsx';

function App() {
  return(
    <div className='App'>
      <BrowserRouter>
      <Navbar/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/request" element={<Request/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
