import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, MenuItem, ListItemIcon, InputAdornment, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import dayjs from 'dayjs';
import airports from '../airports.json';
import { Airport } from '../types/types';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface searchFormProps {
  requestFromFlightListPage: boolean;
  initialSearchParams: {
    origin_code: string | null;
    destination_code: string | null;
    departureDate: dayjs.Dayjs | null;
    returnDate: dayjs.Dayjs | null;
  };
}

const getAirportName = (iataCode: string | null) => {
  if (!iataCode) return '';
  const airport = airports.find((airport: Airport) => airport.iataCode === iataCode);
  return airport ? `${airport.iataCode} ${airport.name}` : ''
};

const SearchForm: React.FC<searchFormProps> = ({ requestFromFlightListPage, initialSearchParams }) => {
  const [origin, setOrigin] = useState(getAirportName(initialSearchParams.origin_code) || '');
  const [destination, setDestination] = useState(getAirportName(initialSearchParams.destination_code) || '');
  const [departureDate, setDepartureDate] = useState(initialSearchParams.departureDate || null);
  const [returnDate, setReturnDate] = useState(initialSearchParams.returnDate || null);
  const [options, setOptions] = useState<string[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [tripType, setTripType] = React.useState('one_way');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const filteredAirports = airports.filter((airport: Airport) => 
      airport.iataCode.toLowerCase().includes(origin.toLowerCase()) ||
      airport.name.toLowerCase().includes(origin.toLowerCase())
    );
    const airportOptions = filteredAirports.map((airport: Airport) => `${airport.iataCode} ${airport.name}`);
    setOptions(airportOptions);
  }, [origin]);
  
  
  useEffect(() => {
    const filteredAirports = airports.filter((airport: Airport) => 
      airport.iataCode.toLowerCase().includes(destination.toLowerCase()) ||
      airport.name.toLowerCase().includes(destination.toLowerCase())
    );
    const airportOptions = filteredAirports.map((airport: Airport) => `${airport.iataCode} ${airport.name}`);
    setDestinationOptions(airportOptions);
  }, [destination]);
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(origin, destination, departureDate)

    if (!origin || !destination || !departureDate || (!returnDate && tripType === 'round_trip') ) {
      alert('All fields are required.');
      return;
    }
    if (departureDate.isBefore(dayjs())) {
      alert('Departure Date Is Not Valid.');
      return;
    }
    const origin_code = origin.split(' ')[0];
    const destination_code = destination.split(' ')[0];
    
    const departureDateString = departureDate.format('MM-DD-YYYY');
    const returnDateString = returnDate ? returnDate.format('MM-DD-YYYY') : null;
    

    navigate(`/flights?oc=${origin_code}&dc=${destination_code}&dd=${departureDateString}&rd=${returnDateString}`);
    if (requestFromFlightListPage) {
      window.location.reload();
    }
  };

  return (
    <Container maxWidth="xl" style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} style={{ 
        padding: isSmallScreen ? '20px' : '50px', 
        width: isSmallScreen ? '100%' : '70%', 
        borderRadius: '20px' 
      }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="row" spacing={3} alignItems="center">
                <Grid item xs={12} sm={tripType === 'round_trip' ? 3:4}>
                  <Autocomplete
                    value={origin}
                    options={options}
                    getOptionLabel={(option) => option}
                    onInputChange={(event, newInputValue) => setOrigin(newInputValue)}
                    renderInput={(params) => <TextField {...params} label="Origin" required />}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} style={{ borderBottom: '1px solid #ccc' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold', marginRight: '8px' }}>
                          {option.substring(option.indexOf(' ') + 1)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {option.substring(0, option.indexOf(' '))}
                        </Typography>
                      </li>
                    )}
                    noOptionsText={null}
                    PaperComponent={({ children }) =>
                      (options.length > 0 && origin.length >= 3) ? <Paper>{children}</Paper> : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={tripType === 'round_trip' ? 3:4}>
                  <Autocomplete
                    value={destination}
                    options={destinationOptions}
                    defaultValue={"Where to?"}
                    getOptionLabel={(option) => option}
                    onInputChange={(event, newInputValue) => setDestination(newInputValue)}
                    renderInput={(params) => <TextField {...params} label="Destination" placeholder="Where ya headed?" required/>}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} style={{ borderBottom: '1px solid #ccc' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold', marginRight: '8px' }}>
                          {option.substring(option.indexOf(' ') + 1)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {option.substring(0, option.indexOf(' '))}
                        </Typography>
                      </li>
                    )}
                    noOptionsText={null}
                    PaperComponent={({ children }) =>
                      (destinationOptions.length > 0 && destination.length >= 3) ? <Paper elevation={3}>{children}</Paper> : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={tripType === 'round_trip' ? 3:4}>
                  <DatePicker
                    label="Departure Date"
                    value={departureDate}
                    onChange={(newDate) => setDepartureDate(newDate)}
                    minDate={dayjs()}
                    maxDate={dayjs().add(300, 'day')}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                {tripType === 'round_trip' && (
                  <Grid item xs={12} sm={3}>
                    <DatePicker
                      label="Return Date"
                      value={returnDate}
                      onChange={(newDate) => setReturnDate(newDate)}
                      minDate={departureDate || dayjs().add(1, 'day')} // Set minimum date to either the departure date or one day from today
                      maxDate={dayjs().add(300, 'day')}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                )}
                <Grid container item xs={12} spacing={3} alignItems="center" justifyContent="space-between">
                  <Grid item container xs={12} spacing={3} alignItems="center">
                    <Grid item xs={7} sm={6} sx={{ justifyContent: 'flex-start', display: 'flex' }}>
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
                    <Grid item xs={5} sm={2}>
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
                  <Grid item xs={12} sm={12} m={2}>
                    <Button fullWidth variant="contained" color="primary" type="submit" sx={{ padding: '10px 20px', fontSize: '1.1rem' }}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </LocalizationProvider>
        </Paper>
      </Container>
  );
};

export default SearchForm;
