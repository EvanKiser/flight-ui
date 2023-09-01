import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightList, { Flight } from './components/FlightList';
import axios from 'axios';

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchData, setSearchData] = useState<null | { [key: string]: string }>(null);

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
    <div className="App">
      {!searchData ? (
        <SearchForm onSearch={handleSearch} />
      ) : (
        <FlightList flights={flights} />
      )}
    </div>
  );
};

export default App;
