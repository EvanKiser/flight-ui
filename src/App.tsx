import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightList from './components/FlightList';

const App: React.FC = () => {
  const [flights, setFlights] = useState<string[]>([]);
  const [searchData, setSearchData] = useState<null | { [key: string]: string }>(null);

  const handleSearch = (data: { origin: string, destination: string, departureDate: string, returnDate: string }) => {
    setSearchData(data);
    // Mock flight data; In real-world, you would make an API call here.
    setFlights(['Flight 1', 'Flight 2', 'Flight 3']);
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
