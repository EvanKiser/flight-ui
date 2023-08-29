import React, { FC } from 'react';
import { TextField, TextFieldProps, Button, Grid, Paper } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface Props {
  onSearch: (data: { origin: string, destination: string, departureDate: string, returnDate: string }) => void;
}

const SearchForm: FC<Props> = ({ onSearch }) => {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState<Date | null>(null);
  const [returnDate, setReturnDate] = React.useState<Date | null>(null);

  const handleSubmit = () => {
    if (departureDate && returnDate) {
      onSearch({
        origin,
        destination,
        departureDate: departureDate.toISOString(),
        returnDate: returnDate.toISOString(),
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} style={{ padding: '50px', width: '400px', borderRadius: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
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
