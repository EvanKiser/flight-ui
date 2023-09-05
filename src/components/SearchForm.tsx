import React, { FC, useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, MenuItem, ListItemIcon } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import axios from 'axios';
import dayjs from 'dayjs';

interface Props {
  onSearch: (data: { origin_code: string, destination_code: string, departureDate: string, returnDate: string | null }) => void;
}

interface Airport {
  airport_code: string
  city_name: string
  region: string
}

const SearchForm: FC<Props> = ({ onSearch }) => {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState<Date | null>(null);
  const [returnDate, setReturnDate] = React.useState<Date | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [tripType, setTripType] = React.useState('round_trip');

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

  const handleSubmit = () => {
    if (!origin || !destination || !departureDate || (!returnDate && tripType === 'round_trip') ) {
      alert('All fields are required.');
      return;
    }
    const origin_code = origin.split(' ')[0];
    const destination_code = destination.split(' ')[0];
    onSearch({
      origin_code,
      destination_code,
      departureDate: departureDate.toISOString(),
      returnDate: returnDate ? returnDate.toISOString() : null,
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} style={{ padding: '50px', width: '400px', borderRadius: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
            <TextField
              select
              fullWidth
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              variant="outlined"
              sx={{ 
                width: '50%',
                '.MuiOutlinedInput-root': { borderRadius: '8px' },
                '.MuiSelect-select': { padding: '12px 24px', display: 'flex', alignItems: 'center' },
                '.MuiInputLabel-outlined': { transform: 'translate(14px, 16px)' },
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                <DatePicker
                  label="Departure Date"
                  value={departureDate}
                  onChange={(newDate) => setDepartureDate(newDate)}
                  maxDate={returnDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                </Grid>
                {tripType === 'round_trip' && (
                  <Grid item xs={6}>
                    <DatePicker
                      label="Return Date"
                      value={returnDate}
                      onChange={(newDate) => setReturnDate(newDate)}
                      minDate={departureDate}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                Search
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>
    </div>
  );
};

export default SearchForm;
