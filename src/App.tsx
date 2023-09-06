import React, { useState } from 'react';
import { Button } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from 'react-router-dom';
import SearchForm from './components/SearchForm2';
import SignupForm from './components/SignupFrom';
import FlightList from './components/FlightList';
import { Flight }  from './types/types';
import axios from 'axios';

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchData, setSearchData] = useState<null | { [key: string]: string | null }>(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading status

  const NavBar = () => {
    const location = useLocation();
    return (
      <nav style={{ position: 'absolute', top: 0, left: 0, padding: '15px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/"
          onClick={() => setSearchData(null)}
          style={{ marginRight: '20px' }}
        >
          Home
        </Button>
        {location.pathname !== '/signup' && (
          <Button variant="contained" color="secondary" component={Link} to="/signup">
            Signup for Mailing List
          </Button>
        )}
      </nav>
    );
  };  

  const getFlightList = async (payload: { origin_code: string, destination_code: string, departureDate: string, returnDate: string | null }) => {
    setIsLoading(true); // Set loading to true before the API call
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/flight/search`, payload)
    .then(response => {
      return response.data
    })
    .catch(error => console.log(error))
    .finally(() => setIsLoading(false)); // Set loading back to false after the API call
  
    return response;
  };

  const handleSearch = async (data: { origin_code: string, destination_code: string, departureDate: string, returnDate: string | null }) => {
    setSearchData(data);
    try {
      const flightsResponse = await getFlightList(data); 
      if (flightsResponse) {
        setFlights(flightsResponse);
      }
    } catch (error) {
      console.log('Error fetching flights:', error);
    }
  };

  return (
    <Router>
      <div className="App" style={{ paddingTop: '60px' }}>
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/" element={!searchData ? (
            <SearchForm onSearch={handleSearch} />
          ) : (
            <FlightList flights={flights} isLoading={isLoading} />
          )} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
