import React, { FC, useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios';

interface Props {
  onSearch: (data: { origin_code: string, destination_code: string, departureDate: string, returnDate: string }) => void;
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

  useEffect(() => {
    const fetchDefaultOrigin = async () => {
      const response = await axios.get('http://127.0.0.1:5000/flight/default_origin');
      const newOrigin: Airport = response.data
      const newOriginName = (
        newOrigin.airport_code + " " + newOrigin.city_name + ", " + newOrigin.region
      )
      console.log(newOriginName)
      setOrigin(newOriginName);
    };

    fetchDefaultOrigin();
  }, []);

  useEffect(() => {
    let active = true;

    if (destination.length === 3) {
      (async () => {
        const response = await axios.get(`http://127.0.0.1:5000/flight/predictive_cities/${destination}`);
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
        const response = await axios.get(`http://127.0.0.1:5000/flight/predictive_cities/${origin}`);
        const airports: Airport[] = response.data;
        const airportCodes = airports.map((airport: Airport) => {
          return airport.airport_code + " " + airport.city_name + ", " + airport.region
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
    console.log(origin, destination, departureDate, returnDate)
    if (!origin || !destination || !departureDate || !returnDate) {
      alert('All fields are required.');
      return; 
    }
    const origin_code = origin.split(' ')[0]
    const destination_code = destination.split(' ')[0]
    onSearch({
      origin_code,
      destination_code,
      departureDate: departureDate.toISOString(),
      returnDate: returnDate.toISOString(),
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} style={{ padding: '50px', width: '400px', borderRadius: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container direction="column" spacing={3}>
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
                  return x
                }}
                noOptionsText={null}
                PaperComponent={({ children }) =>
                  // Only render Paper (dropdown) if there are options or if the input value length is >= 3
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
                    onChange={(newDate: Date | null) => setDepartureDate(newDate)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="Return Date"
                    value={returnDate}
                    onChange={(newDate: Date | null) => setReturnDate(newDate)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
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
