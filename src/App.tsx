import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import SignupForm from './components/SignupFrom';
import FlightList, { Flight } from './components/FlightList';
import axios from 'axios';

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchData, setSearchData] = useState<null | { [key: string]: string }>(null);

  const NavBar = () => {
    const location = useLocation();
    return (
      <nav>
        <Link to="/" style={{ marginRight: '20px' }}>Search Flights</Link>
        {location.pathname !== '/signup' && <Link to="/signup">Signup for Mailing List</Link>}
      </nav>
    );
  };

  const getFlightList = async (payload: { origin_code: string, destination_code: string, departureDate: string, returnDate: string }) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/flight/search`, payload)
    .then(response => {
      return response.data
    })
    .catch(error => console.log(error));
  
    return response
  };

  const handleSearch = async (data: { origin_code: string, destination_code: string, departureDate: string, returnDate: string }) => {
    setSearchData(data);
    try {
      const flightsResponse = await getFlightList(data); 
      if (flightsResponse) {
        setFlights(flightsResponse)
      }
    } catch (error) {
      console.log('Error fetching flights:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/" element={!searchData ? (
            <SearchForm onSearch={handleSearch} />
          ) : (
            <FlightList flights={flights} />
          )} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
