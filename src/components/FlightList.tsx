import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Button } from '@mui/material';
import { Flight } from '../types/types';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  let hours = dateObj.getHours();
  let minutes: number | string = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}${ampm}`;
};

const getCompnayLogo = (carrier: string) => {
  return process.env.PUBLIC_URL + `/airline_icons/${carrier.toLowerCase()}.png`;
};

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFlightIndex, setExpandedFlightIndex] = useState<number | null>(null);

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
      if (!isLoading) {
        setIsLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/flight/search`, payload)
        .then(response => {
          setFlights(response.data)
          return response.data
        })
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false)); // Set loading back to false after the API call
        return response;
      }
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
        <Grid container spacing={3} direction="row" justifyContent="center">
          {flights.map((flight, index) => (
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }} key={index}>
              <Paper elevation={3} style={{ maxWidth: '1200px', width: '100%', margin: 'auto', padding: '16px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={getCompnayLogo(flight.carrier)} alt={`${flight.carrier} logo`} style={{ width: '50px', height: '50px' }} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                      {formatTime(flight.departure_time)} - {formatTime(flight.arrival_time)}
                    </Typography>
                    <Typography variant="h6">
                      {flight.carrier}
                    </Typography>
                    <Typography variant="subtitle1">
                      {flight.cabin_class}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="h5" style={{ textAlign: 'left' }}>
                      {flight.duration.hours} hr {flight.duration.minutes} min
                    </Typography>
                    <Typography variant="subtitle1" color='grey' gutterBottom style={{ textAlign: 'left' }}>
                      {`${flight.origin}-${flight.destination}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="h5" style={{ textAlign: 'left' }}>
                      {flight.stop_count === 0 ? 'Nonstop' : flight.stop_count === 1 ? '1 Stop' : `${flight.stop_count} Stops`}
                    </Typography>
                    {flight.stop_count === 1 ? (
                      <Typography variant="subtitle1" color='grey' gutterBottom style={{ textAlign: 'left' }}>
                        {flight.layover_duration.hours} hr {flight.layover_duration.minutes} min {flight.segments[0]!.layover!.layover_airport}
                      </Typography>
                    ): (flight.stop_count > 1 ? (
                      <Typography variant="subtitle1" color='grey' gutterBottom style={{ textAlign: 'left' }}>
                        hey
                      </Typography>
                    ) : null )}
                  </Grid>
                  <Grid item xs={2} style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="h5">
                      {flight.point_cost} points
                    </Typography>
                    <Typography variant="h6">
                      +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(flight.dollar_cost)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} style={{ textAlign: 'right' }}>
                    <Button onClick={() => setExpandedFlightIndex(expandedFlightIndex === index ? null : index)}>
                      <img src={process.env.PUBLIC_URL + '/expand_arrow.png'} alt='down arrow' style={{ width: '40px', height: '40px' }} />
                    </Button>
                  </Grid>
                  {expandedFlightIndex === index && (
                    <Grid item xs={12}>
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
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default FlightList;
