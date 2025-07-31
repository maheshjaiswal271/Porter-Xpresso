import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Paper, Box, Alert, CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
   
    setLoading(true);
    try {
      // Replace the URL below with your actual reset password endpoint
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newPassword: password ,token})
      });
      if (res.ok) {
        setSuccess('Password reset successful. You can now login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Reset Password
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(x => !x)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="medium" color="primary" /> : <Visibility fontSize="medium" color="primary" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(x => !x)} edge="end" size="small">
                      {showConfirmPassword ? <VisibilityOff fontSize="medium" color="primary" /> : <Visibility fontSize="medium" color="primary" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Password'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword; 