import React, { FC } from 'react';

export interface Flight {
  arrival_time: string,
  cabin_class: string,
  carrier: string, 
  departure_time: string, 
  destination: string, 
  dollar_cost: string, 
  duration: number, 
  origin: string, 
  point_cost: number,
}

interface Props {
  flights: Flight[];
}

const FlightList: FC<Props> = ({ flights }) => {
  console.log(flights);
  return (
    <div>
      <h1>Available Flights</h1>
      <ul>
        {flights.map((flight, index) => (
          <li key={index}>{`${flight.carrier}: ${flight.origin} -> ${flight.destination} in ${flight.cabin_class} for ${flight.point_cost} points and ${flight.dollar_cost}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;
