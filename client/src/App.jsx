import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Login from './components/Login.jsx';
import CreateAccount from './components/CreateAccount.jsx';

function App() {
  return(
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/login"/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/create-account" element={<CreateAccount/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
