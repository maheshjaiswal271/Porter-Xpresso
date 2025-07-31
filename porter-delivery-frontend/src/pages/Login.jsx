import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import OtpInput from '../components/auth/OtpInput';
import { toast } from 'react-toastify';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const { login, verifyOtp, user } = useAuth();
  const [showPassword,setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const role = userData.role?.toUpperCase();

        // Redirect based on role
        switch (role) {
          case 'ADMIN':
            navigate('/admin', { replace: true });
            break;
          case 'PORTER':
            navigate('/porter', { replace: true });
            break;
          case 'USER':
            navigate('/user', { replace: true });
            break;
          default:
            // If role is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({ username: '', password: '' });
    setError('');
    setShowOtp(false);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      if (response.success && response.requiresOtp) {
        toast.info('OTP has been sent to your email. Please check your inbox.');
        setShowOtp(true);
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      toast.error(errorMessage);
      setError(errorMessage);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = async (otp) => {
    setError('');
    setLoading(true);

    try {
      const response = await verifyOtp(formData.username, otp);
      if (response.success) {
        toast.success('Login successful! Redirecting...');

        // Store user data and token
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Redirect based on role
        setTimeout(() => {
          const role = response.role?.toUpperCase();
          switch (role) {
            case 'ADMIN':
              navigate('/admin', { replace: true });
              break;
            case 'PORTER':
              navigate('/porter', { replace: true });
              break;
            case 'USER':
              navigate('/user', { replace: true });
              break;
            default:
              toast.error('Invalid user role');
              resetForm();
          }
        }, 1000);
      } else {
        toast.error(response.message || 'Invalid OTP');
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    resetForm();
  };

  const toggleShowPassword = () => setShowPassword((x) => !x);

  // If user is already logged in, show loading
  if (user) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {showOtp ? 'Enter OTP' : 'Login to PORTER▸XPRESSO'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!showOtp ? (
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPassword}
                        edge="end"
                        size="small"
                        sx={{ p: 0.5 }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='body2' align='center'>
                  <Link to="/forget-password" style={{ textDecoration: 'none' }}>
                    Forget Password?
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    Register here
                  </Link>
                </Typography>
              </Box>
            </form>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                Please enter the 6-digit OTP sent to your registered email
              </Typography>
              <OtpInput length={6} onComplete={handleOtpComplete} />
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              <Button
                fullWidth
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
