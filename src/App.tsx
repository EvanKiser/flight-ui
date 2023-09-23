import React from 'react';
import { AppBar, Toolbar, Button, Hidden, useMediaQuery, useTheme } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignupForm from './components/SignupForm';
import FlightList from './components/FlightList';

const App: React.FC = () => {

  const NavBar = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
    return (
      <AppBar position="fixed" color="inherit" elevation={1} style={{ backgroundColor: '#fff' }}>
        <Toolbar>
          <Button 
            component={Link} 
            to="/"
            style={{ 
              fontSize: isSmallScreen ? '18px' : '24px', 
              fontWeight: 'bold', 
              color: '#333', 
              textTransform: 'none' 
            }}
          >
            PointsParty.io
          </Button>
          <div style={{ flexGrow: 1 }}></div>
          <Hidden smDown>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/signup"
              style={{ textTransform: 'none', fontSize: '16px' }}
            >
              Signup for Mailing List
            </Button>
          </Hidden>
          <Hidden mdUp>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/signup"
              style={{ textTransform: 'none', fontSize: '14px' }}
            >
              Signup
            </Button>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <Router>
      <div className="App" style={{ paddingTop: '60px', background: '#ffffff' }}>
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<FlightList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
