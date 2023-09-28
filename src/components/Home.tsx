import React from 'react';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import SearchForm from './SearchForm';

const Home: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: isSmallScreen ? 'start' : 'center', 
      height: '100vh',
      padding: isSmallScreen ? '20px' : '0px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant={isSmallScreen ? "h3" : "h1"} style={{ 
          fontFamily: '"Roboto Slab", serif', 
          fontWeight: 500, 
          color: '#333', 
          marginBottom: '0px' 
        }}>
          PointsParty.io
        </Typography>
        <Typography variant="h6" style={{ 
          fontFamily: '"Roboto", sans-serif', 
          color: 'grey', 
          marginBottom: '10px' 
        }}>
          Google Flights for Points
        </Typography>
      </div>
      <SearchForm requestFromFlightListPage={false} initialSearchParams={{origin_code: null, destination_code: null, departureDate: null, returnDate: null}}/>
    </div>
  );
};

export default Home;
