import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import { Flight } from '../types/types';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();


  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const payload = {
      origin_code: query.get('oc'),
      destination_code: query.get('dc'),
      departureDate: query.get('dd'),
      returnDate: query.get('rd'),
    };
    const getFlightList = async () => {
      if (flights.length > 0) return;
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/flight/search`, payload)
      .then(response => {
        setFlights(response.data)
        return response.data
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false)); // Set loading back to false after the API call
      return response;
    };
    getFlightList();    
  });

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