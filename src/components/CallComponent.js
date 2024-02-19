import React, { useState, useEffect } from 'react';
import { Divider, DialogContentText, Typography, Button, Dialog, CircularProgress, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import createApiInstance from '../utils/api';
import { Mixpanel } from '../utils/mixpanel';


const CallComponent = ({ agentId, accessToken }) => {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const api = createApiInstance(accessToken);

  const handleClick = async () => {
    Mixpanel.track('call_me_click');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPhoneNumber('');
    setErrorMessage('');
  };

  const handleConfirm = async () => {
    if (phoneNumber !== '') {
      try {
        const response = await api.post('/demo_call', {
          agent_id: agentId,
          recipient_phone_number: phoneNumber
        });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        // Handle the successful response here
        console.log('API call successful');
        setOpen(false); // Close the dialog after successful API call
      } catch (error) {
        // Handle errors here
        console.error('There was an error making the API call');
        setErrorMessage(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{ marginRight: 2, backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
      >
        Call me
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter your phone number</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your phone number with the country code.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="phone-number"
            label="Phone Number"
            type="text"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <br/>
          <Alert severity="info">For demo purposes, the calls will be limited to 100 seconds.<br/>
          You may use your own Twilio keys to remove this limitation. <br/>
          <a href="https://docs.bolna.dev/providers#steps-to-add-your-own-provider-credentails" target="_blank" rel="noopener noreferrer"> Refer docs here</a>. </Alert>

          {errorMessage && (
            <DialogContentText style={{ color: 'red' }}>
              {errorMessage}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallComponent;