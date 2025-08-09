// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Paper, Box, Alert, CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext'; 
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { sendResetOtp, resetPassword } = useAuth(); 
  const navigate = useNavigate();
  const [showResetPassword,setShowResetPassword] = useState(false);

  const handleRequestOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await sendResetOtp(username);
      if (res.status == 200) {
        // toast.success('OTP sent to your email.');
        setOtpSent(true);
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await resetPassword(username, otp, newPassword);
      if (res.status == 200) {
        toast.success('Password reset successful. You can now login.');
        navigate('/login');
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Forgot Password
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {!otpSent ? (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleRequestOtp}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                type={showResetPassword ? 'text' : 'password'}
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                 InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowResetPassword((x) => !x)}
                        edge="end"
                        size="small"
                        sx={{ p: 0.5, ml:-4,}}
                      >
                        {showResetPassword ? <VisibilityOff fontSize="medium" color="primary" /> : <Visibility fontSize="medium" color="primary" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
