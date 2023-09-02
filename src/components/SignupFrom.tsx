import React, { useState } from 'react';
import { TextField, Typography, Button, Grid, Paper } from '@mui/material';
import axios from 'axios';

const SignupForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email: string) => {
        const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return validEmailRegex.test(email);
    };

  const handleSignup = async (e: React.FormEvent) => {

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }

    try {
      const payload = { email }
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/message/signup`, payload);
      if (response.status === 200) {
        console.log('Successfully signed up for mailing list');
      }
    } catch (error) {
      console.log('Error signing up for mailing list:', error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} style={{ padding: '50px', width: '400px', borderRadius: '20px' }}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              Want to maximize your points? Signup to be notified of future developments.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              type="email"
              label="Email"
              variant="outlined"
              error={Boolean(emailError)}
              helperText={emailError}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (validateEmail(e.target.value)) {
                  setEmailError(''); // Clear the error if email is valid
                }
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={handleSignup}>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default SignupForm;
