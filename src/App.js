import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';


import FormLogIn   from './components/FormLogIn';
import FormSignUp  from './components/FormSignUp';
import MainPage from './components/MainPage';

function App() {
    return (
        <Router>
            <div>
                <header className="app-header">
                  <Link className="navbar-brand">
                    <img src={`${process.env.PUBLIC_URL}/Logo.png`} alt="Logo" className="app-logo" />
                    <h1>Attendance Management</h1>
                  </Link>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<FormLogIn />} />
                        <Route path="/signup" element={<FormSignUp />} />
                        <Route path="/login" element={<FormLogIn />} />
                        <Route path="/main" element={<MainPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
