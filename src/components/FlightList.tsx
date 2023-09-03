import React, { FC } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';

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
  isLoading: boolean;
}

const FlightList: FC<Props> = ({ flights, isLoading }) => {
  return (
    <div>
      <h1>Available Flights</h1>
      {isLoading && <p>Loading...</p>}
      {flights.length === 0 && !isLoading ? (
        <p>No flights available.</p>
      ) : (
      <Grid container spacing={3}>
        {flights.map((flight, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined">
              <CardContent>
                    <Typography variant="h6" component="div">
                      {flight.carrier}
                    </Typography>
                    <Typography>
                      Origin: {flight.origin}
                    </Typography>
                    <Typography>
                      Destination: {flight.destination}
                    </Typography>
                    <Typography>
                      Cabin Class: {flight.cabin_class}
                    </Typography>
                    <Typography>
                      Departure: {flight.departure_time}
                    </Typography>
                    <Typography>
                      Arrival: {flight.arrival_time}
                    </Typography>
                    <Typography>
                      Duration: {flight.duration} mins
                    </Typography>
                    <Typography>
                      Cost: {flight.point_cost} points and ${flight.dollar_cost}
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>)}
    </div>
  );
};

export default FlightList;
