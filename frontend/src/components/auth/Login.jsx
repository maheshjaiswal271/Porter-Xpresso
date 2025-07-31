import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Container
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    otp: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!showOtpField) {
        const response = await axios.post(`${API}/auth/login`, {
          username: formData.username,
          password: formData.password
        });

        if (response.data.success && response.data.requiresOtp) {
          setShowOtpField(true);
          toast.info('OTP has been sent to your email');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${API}/auth/verify-otp`, {
          username: formData.username,
          otp: formData.otp
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);
          
          toast.success('Login successful!');
          
          switch (response.data.role) {
            case 'CUSTOMER':
              navigate('/dashboard');
              break;
            case 'PORTER':
              navigate('/porter/dashboard');
              break;
            case 'ADMIN':
              navigate('/admin/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            {showOtpField ? 'Enter OTP' : 'Login'}
          </Typography>

          <form onSubmit={handleSubmit}>
            {!showOtpField ? (
              <>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </>
            ) : (
              <TextField
                fullWidth
                label="OTP"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="Enter the OTP sent to your email"
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                showOtpField ? 'Verify OTP' : 'Login'
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 