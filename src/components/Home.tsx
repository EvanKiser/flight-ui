import React from 'react';
import { Typography } from '@mui/material';
import SearchForm from './SearchForm';

const Home: React.FC = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h1" style={{ fontFamily: '"Roboto Slab", serif', fontWeight: 500, color: '#333', marginBottom: '0px' }}>
          PointsParty.io
        </Typography>
        <Typography variant="h4" style={{ fontFamily: '"Roboto", sans-serif', color: 'grey', marginBottom: '10px' }}>
          Google Flights for Points
        </Typography>
      </div>
      <SearchForm requestFromFlightListPage={false} initialSearchParams={{origin_code: null, destination_code: null, departureDate: null, returnDate: null}}/>
    </div>
  );
};

export default Home;
