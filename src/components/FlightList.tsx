import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Paper, Typography, Grid, Button, Pagination, useTheme, useMediaQuery } from '@mui/material';
import { Flight } from '../types/types';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchForm from './SearchForm';
import dayjs from 'dayjs';

const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  let hours = dateObj.getUTCHours(); // Gets the hour in UTC time
  let minutes: number | string = dateObj.getUTCMinutes(); // Gets the minutes in UTC time
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
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]); // New state variable for filtered flights
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFlightIndex, setExpandedFlightIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1); // New state variable for current page
  const [itemsPerPage] = useState(20); // New state variable for items per page
  const [filterCriteria, setFilterCriteria] = useState(''); // New state variable for filter criteria
  const [uniqueCarriers, setUniqueCarriers] = useState<string[]>([]); // New state variable for unique carriers
  const [uniqueCabinClasses, setUniqueCabinClasses] = useState<string[]>([]); // New state variable for unique carriers
  const [cabinClassFilter, setCabinClassFilter] = useState(''); // New state variable for cabin class filter
  const [stopCountFilter, setStopCountFilter] = useState<number | null>(null); // New state variable for stop count filter

  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const payload = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return {
      origin_code: query.get('oc'),
      destination_code: query.get('dc'),
      departureDate: dayjs(query.get('dd')),
      returnDate: dayjs(query.get('rd')),
    };
  }, [location.search]);

  useEffect(() => {
    const carriers = Array.from(new Set(flights.map(flight => flight.carrier)));
    setUniqueCarriers(carriers);
  }, [flights]);

  useEffect(() => {
    const cabin_classes = Array.from(new Set(flights.map(flight => flight.cabin_class)));
    setUniqueCabinClasses(cabin_classes);
  }, [flights]);

  const hasFetchedFlights = useRef(false);
  
  useEffect(() => {
    const getFlightList = async () => {
      if (!hasFetchedFlights.current && !isLoading) {
        setIsLoading(true);
        hasFetchedFlights.current = true;
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
  }, [isLoading, payload]);

  useEffect(() => {
    const getFilteredFlights = () => {
      let result = flights;
      if (filterCriteria) {
        result = result.filter(flight => flight.carrier.includes(filterCriteria));
      }
      if (cabinClassFilter) {
        result = result.filter(flight => flight.cabin_class.includes(cabinClassFilter));
      }
      if (stopCountFilter !== null) {
        result = result.filter(flight => flight.stop_count === stopCountFilter);
      }
      setFilteredFlights(result);
      setPage(1);
    };
    getFilteredFlights();
  }, [filterCriteria, cabinClassFilter, stopCountFilter, flights]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(value)
    setPage(value);
  };

  return (
    <div style={{ width: '100%', padding: isSmallScreen ? '0 10px' : '0 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SearchForm requestFromFlightListPage={true} initialSearchParams={payload}/>
      <Grid container spacing={2} justifyContent="center" style={{ margin: '20px 0' }}>
        <Grid item>
          <select 
            value={filterCriteria} 
            onChange={(e) => setFilterCriteria(e.target.value)} 
            style={{ padding: '10px', width: '200px' }} 
          >
            <option value="">All Carriers</option>
            {uniqueCarriers.map((carrier, index) => (
              <option key={index} value={carrier}>{carrier}</option>
            ))}
          </select>
        </Grid>
        <Grid item>
          <select 
            value={cabinClassFilter} 
            onChange={(e) => setCabinClassFilter(e.target.value)} 
            style={{ padding: '10px', width: '200px' }} 
          >
            <option value="">All Cabin Classes</option>
            {uniqueCabinClasses.map((cabinClass, index) => (
              <option key={index} value={cabinClass}>{cabinClass}</option>
            ))}
          </select>
        </Grid>
        <Grid item>
          <select 
            value={stopCountFilter === null ? '' : stopCountFilter} 
            onChange={(e) => setStopCountFilter(e.target.value === '' ? null : parseInt(e.target.value))} 
            style={{ padding: '10px', width: '200px' }} 
          >
            <option value="">Any Stop Count</option>
            <option value="0">Nonstop only</option>
            <option value="1">1 Stop or fewer</option>
            <option value="2">2 Stops or fewer</option>
          </select>
        </Grid>
      </Grid>
      <Typography variant="h4" style={{ textAlign: 'center', margin: '40px 0 20px 0' }}> {/* Increased top margin */}
        Available Flights
      </Typography>
      {isLoading && 
        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}> {/* Centered loading message */}
          Loading...
        </Typography>
      }
      {filteredFlights.length === 0 && !isLoading ? (
        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}> {/* Centered no flights message */}
          No flights available.
        </Typography>
      ) : (  
        <Grid container spacing={3} direction="row" justifyContent="center">
          {filteredFlights.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((flight, index) => (
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }} key={index}>
            <div 
              onClick={() => isSmallScreen && setExpandedFlightIndex(expandedFlightIndex === index ? null : index)}
              style={{width: isSmallScreen ? '100%' : '80%', maxWidth: '1200px'}}
            >
              <Paper elevation={3} style={{ 
                padding: '16px', 
                borderRadius: '20px', 
                minHeight: '100px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%'
              }}>
                  <Grid container spacing={2} style={{ width: '100%', textAlign: 'center' }}>
                    <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={getCompnayLogo(flight.carrier)} alt={`${flight.carrier} logo`} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                        {formatTime(flight.departure_time)} - {formatTime(flight.arrival_time)}
                        {flight.days_difference > 0 && (
                          <span style={{
                            position: 'relative',
                            top: '-5px',
                            left: '5px',
                            fontSize: '0.8em',
                            backgroundColor: '#f1f1f1',
                            padding: '2px 5px',
                            borderRadius: '50%'
                          }}>
                            +{flight.days_difference}
                          </span>
                        )}
                      </Typography>
                      <Typography variant="h6" color='grey'>
                      {flight.cabin_class} | {flight.carrier}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Typography variant="h5" style={{ textAlign: 'left' }}>
                        {flight.duration.hours} hr {flight.duration.minutes} min
                      </Typography>
                      <Typography variant="h5" style={{ textAlign: 'left' }}>
                        {flight.stop_count === 0 ? 'Nonstop' : flight.stop_count === 1 ? '1 Stop' : `${flight.stop_count} Stops`}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Typography variant="h5">
                        {flight.point_cost} Points
                      </Typography>
                      <Typography variant="h6" color='grey'>
                        +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(flight.dollar_cost)}
                      </Typography>
                    </Grid>
                    {!isSmallScreen && (
                      <Grid item xs={1} style={{ textAlign: 'right' }}>
                        <Button onClick={() => setExpandedFlightIndex(expandedFlightIndex === index ? null : index)}>
                          <img src={process.env.PUBLIC_URL + '/expand_arrow.png'} alt='down arrow' style={{ width: '40px', height: '40px' }} />
                        </Button>
                      </Grid>
                    )}
                    {expandedFlightIndex === index && (
                    <Grid item xs={12}>
                      {flight.segments.map((segment, i) => (
                        <div key={i} style={{ padding: '15px', border: '1px solid #ccc', margin: '10px 0', borderRadius: '8px' }}>
                          <Typography gutterBottom style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            Segment {i+1}: {segment.flight_num} - {segment.aircraft_type}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Typography variant="subtitle1">Departure</Typography>
                              <Typography>{formatTime(segment.departure_time)}</Typography>
                              <Typography>({segment.origin})</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="subtitle1">Arrival</Typography>
                              <Typography>{formatTime(segment.arrival_time)}</Typography>
                              <Typography>({segment.destination})</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="subtitle1">Duration</Typography>
                              <Typography>{segment.flight_time.hours}h {segment.flight_time.minutes}m</Typography>
                            </Grid>
                          </Grid>
                          {segment.layover && (
                            <div style={{ backgroundColor: '#e0e0e0', padding: '10px', borderRadius: '8px', margin: '10px 0' }}>
                              <Typography gutterBottom style={{ fontWeight: 'bold' }}>
                                Layover: {segment.layover.duration?.hours}h {segment.layover.duration?.minutes}m at {segment.layover.layover_airport}
                              </Typography>
                            </div>
                          )}
                        </div>
                      ))}
                    </Grid>
                  )}
                  </Grid>
                </Paper>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
      <Pagination count={Math.ceil(filteredFlights.length / itemsPerPage)} page={page} onChange={handlePageChange} />
    </div>
  );
};

export default FlightList;
