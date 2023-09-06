import React, { FC } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import { Flight } from '../types/types';

interface Props {
  flights: Flight[];
  isLoading: boolean;
}

const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  let hours = dateObj.getHours();
  let minutes: number | string = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
};

const FlightList: FC<Props> = ({ flights, isLoading }) => {
  return (
    <div style={{ width: '100%', padding: '0 20px' }}>
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
                  <Typography variant="h5" gutterBottom>
                    {flight.carrier} - {flight.cabin_class}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <FlightIcon /> {flight.origin} {'>'} {flight.destination}
                  </Typography>
                  <Typography gutterBottom>
                    {formatTime(flight.departure_time)} - {formatTime(flight.arrival_time)} | {flight.duration.hours}h {flight.duration.minutes}m
                  </Typography>
                  <Typography gutterBottom variant="h6">
                    <strong>${flight.dollar_cost}</strong> or {flight.point_cost} points
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Segments:
                  </Typography>
                  {flight.segments.map((segment, i) => (
                    <div key={i} style={{ paddingLeft: '15px' }}>
                      <Typography gutterBottom>
                        {segment.flight_num} - {segment.aircraft_type}
                      </Typography>
                      <Typography gutterBottom>
                        {formatTime(segment.departure_time)} ({segment.origin}) {'>'} {formatTime(segment.arrival_time)} ({segment.destination}) | {segment.flight_time.hours}h {segment.flight_time.minutes}m
                      </Typography>
                      {segment.layover && (
                        <Typography gutterBottom>
                          Layover: {segment.layover.duration?.hours}h {segment.layover.duration?.minutes}m at {segment.layover.layover_airport}
                        </Typography>
                      )}
                    </div>
                  ))}
                  <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default FlightList;