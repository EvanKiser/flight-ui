import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, MenuItem, ListItemIcon, Typography, InputAdornment } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface Airport {
  airport_code: string
  city_name: string
  region: string
}

const SearchForm: React.FC = () => {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState<dayjs.Dayjs | null>(null);
  const [returnDate, setReturnDate] = React.useState<dayjs.Dayjs | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [tripType, setTripType] = React.useState('one_way');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDefaultOrigin = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/flight/default_origin`);
      const newOrigin: Airport = response.data;
      const newOriginName = (
        newOrigin.airport_code + " " + newOrigin.city_name + ", " + newOrigin.region
      );
      setOrigin(newOriginName);
    };

    fetchDefaultOrigin();
  }, []);

  useEffect(() => {
    let active = true;

    if (destination.length === 3) {
      (async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/flight/predictive_cities/${destination}`);
        const airports: Airport[] = response.data;
        const airportCodes = airports.map((airport: Airport) => {
          return airport.airport_code + " " + airport.city_name + ", " + airport.region;
        });
        if (active) {
          setDestinationOptions(airportCodes);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [destination]);

  useEffect(() => {
    let active = true;

    if (origin.length === 3) {
      (async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/flight/predictive_cities/${origin}`);
        const airports: Airport[] = response.data;
        const airportCodes = airports.map((airport: Airport) => {
          return airport.airport_code + " " + airport.city_name + ", " + airport.region;
        });
        if (active) {
          setOptions(airportCodes);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [origin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !departureDate || (!returnDate && tripType === 'round_trip') ) {
      alert('All fields are required.');
      return;
    }
    const origin_code = origin.split(' ')[0];
    const destination_code = destination.split(' ')[0];
    
    const departureDateString = departureDate.format('MM-DD-YYYY');
    const returnDateString = returnDate ? returnDate.format('MM-DD-YYYY') : null;

    navigate(`/flights?oc=${origin_code}&dc=${destination_code}&dd=${departureDateString}&rd=${returnDateString}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h1" style={{ fontFamily: '"Roboto Slab", serif', fontWeight: 500, color: '#333', marginBottom: '0px' }}>
          PointsParty.io
        </Typography>
        <Typography variant="h4" style={{ fontFamily: '"Roboto", sans-serif', color: 'grey', marginBottom: '10px' }}>
          Google Flights for Points
        </Typography>
      </div>
      <Paper elevation={3} style={{ padding: '50px', width: '70%', borderRadius: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            <Grid container direction="row" spacing={3} alignItems="center">
              <Grid item xs={tripType === 'round_trip' ? 3:4}>
                <Autocomplete
                  value={origin}
                  options={options}
                  getOptionLabel={(option) => option}
                  onInputChange={(event, newInputValue) => setOrigin(newInputValue)}
                  renderInput={(params) => <TextField {...params} label="Origin" required />}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} style={{ borderBottom: '1px solid #ccc' }}>
                      {option}
                    </li>
                  )}
                  filterOptions={(x, { inputValue }) => {
                    if (origin.length > 3) {
                      return x.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()));
                    }
                    return x;
                  }}
                  noOptionsText={null}
                  PaperComponent={({ children }) =>
                    (options.length > 0 && origin.length >= 3) ? <Paper>{children}</Paper> : null
                  }
                />
              </Grid>
              <Grid item xs={tripType === 'round_trip' ? 3:4}>
                <Autocomplete
                  value={destination}
                  options={destinationOptions}
                  defaultValue={"Where to?"}
                  getOptionLabel={(option) => option}
                  onInputChange={(event, newInputValue) => setDestination(newInputValue)}
                  renderInput={(params) => <TextField {...params} label="Destination" placeholder="Where ya headed?" required/>}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} style={{ borderBottom: '1px solid #ccc' }}>
                      {option}
                    </li>
                  )}
                  filterOptions={(x, { inputValue }) => {
                    if (destination.length > 3) {
                      return x.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()));
                    }
                    return x;
                  }}
                  noOptionsText={null}
                  PaperComponent={({ children }) =>
                    (destinationOptions.length > 0 && destination.length >= 3) ? <Paper elevation={3}>{children}</Paper> : null
                  }
                />
              </Grid>
              <Grid item xs={tripType === 'round_trip' ? 3:4}>
                <DatePicker
                  label="Departure Date"
                  value={departureDate}
                  onChange={(newDate) => setDepartureDate(newDate)}
                  maxDate={returnDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              {tripType === 'round_trip' && (
                <Grid item xs={3}>
                  <DatePicker
                    label="Return Date"
                    value={returnDate}
                    onChange={(newDate) => setReturnDate(newDate)}
                    minDate={departureDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              )}
              <Grid container item xs={12} spacing={3} alignItems="center" justifyContent="space-between">
                <Grid item container xs={8} spacing={3} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      value='one_way'
                      disabled
                      onChange={(e) => setTripType(e.target.value)}
                      variant="outlined"
                      sx={{ 
                        width: '100%',
                        '.MuiOutlinedInput-root': { 
                          borderRadius: '8px', 
                          border: 'none', 
                          '& fieldset': {
                            border: 'none',
                          },
                        },
                        '.MuiSelect-select': { 
                          padding: '12px 24px', 
                          display: 'flex', 
                          alignItems: 'center' 
                        },
                        '.MuiInputLabel-outlined': { 
                          transform: 'translate(14px, 16px)' 
                        },
                      }}
                    >
                      <MenuItem value="round_trip" sx={{ padding: '8px 24px' }}>
                        <ListItemIcon> <SyncAltIcon /> </ListItemIcon> Round Trip
                      </MenuItem>
                      <MenuItem value="one_way" sx={{ padding: '8px 24px' }}>
                        <ListItemIcon> <TrendingFlatIcon /> </ListItemIcon> One Way
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type="number"
                      variant="outlined"
                      fullWidth
                      disabled
                      value="1"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessibilityNewIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '.MuiOutlinedInput-root': { 
                          '& fieldset': {
                            border: 'none',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                <Button fullWidth variant="contained" color="primary" type="submit" sx={{ padding: '10px 20px', fontSize: '1.1rem' }}>
                  Search
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </LocalizationProvider>
      </Paper>
    </div>
  );
};

export default SearchForm;
