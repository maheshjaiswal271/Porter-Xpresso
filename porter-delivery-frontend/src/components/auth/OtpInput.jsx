import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField } from '@mui/material';

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Only take the last character if multiple characters are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (isNaN(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, length); i++) {
      newOtp[i] = pastedData[i];
      if (inputRefs.current[i + 1] && i < length - 1) {
        inputRefs.current[i + 1].focus();
      }
    }
    setOtp(newOtp);

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        justifyContent: 'center',
        width: '100%'
      }}
    >
      {otp.map((digit, index) => (
        <TextField
          key={index}
          inputRef={(ref) => (inputRefs.current[index] = ref)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          variant="outlined"
          inputProps={{
            maxLength: 1,
            style: { 
              textAlign: 'center',
              width: '40px',
              height: '40px',
              fontSize: '1.5rem',
              padding: '0'
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: '8px',
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default OtpInput; 