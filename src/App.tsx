import React from 'react';
import { Button } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import SignupForm from './components/SignupForm';
import FlightList from './components/FlightList';

const App: React.FC = () => {

  const NavBar = () => {
    return (
      <nav style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        padding: '15px', 
        width: '100%', 
        boxSizing: 'border-box', 
        background: '#fff', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Button 
          component={Link} 
          to="/"
          style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', textTransform: 'none' }}
        >
          Points Party
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/signup"
          style={{ textTransform: 'none', fontSize: '16px' }}
        >
          Signup for Mailing List
        </Button>
      </nav>
    );
  };  

  return (
    <Router>
      <div className="App" style={{ paddingTop: '60px', background: 'linear-gradient(45deg, #ffffff 70%, #f0f0f0 90%)' }}>
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/" element={<SearchForm />} />
          <Route path="/flights" element={<FlightList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
