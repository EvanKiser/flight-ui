import React, { FC } from 'react';

interface Props {
  flights: string[];
}

const FlightList: FC<Props> = ({ flights }) => {
  return (
    <div>
      <h1>Available Flights</h1>
      <ul>
        {flights.map((flight, index) => (
          <li key={index}>{flight}</li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;
