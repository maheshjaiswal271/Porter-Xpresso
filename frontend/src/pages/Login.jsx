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
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Login as LoginIcon,
  ArrowForward,
  Email,
  Lock,
  Person
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import OtpInput from '../components/auth/OtpInput';
import { toast } from 'react-toastify';
import { InputAdornment, IconButton } from '@mui/material';
import logo from '../images/logo.png';

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
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
            navigate('/#/admin', { replace: true });
            break;
          case 'PORTER':
            navigate('/#/porter', { replace: true });
            break;
          case 'USER':
            navigate('/#/user', { replace: true });
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
              navigate('/#/admin', { replace: true });
              break;
            case 'PORTER':
              navigate('/#/porter', { replace: true });
              break;
            case 'USER':
              navigate('/#/user', { replace: true });
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
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                color: 'white'
              }}
            >
              {/* Logo */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 4
                }}
              >
                <img 
                  src={logo} 
                  alt="Porter Logo" 
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    borderRadius: '50%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }} 
                />
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  PORTER▸XPRESSO
                </Typography>
              </Box>

              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Welcome Back!
              </Typography>

              <Typography 
                variant="h6" 
                sx={{ 
                  maxWidth: 500,
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.6
                }}
              >
                Sign in to your account and continue your journey with Porter▸Xpresso. 
                Fast, reliable delivery at your fingertips.
              </Typography>

              {/* Features */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Person sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="body1">Secure Authentication</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Lock sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="body1">Two-Factor Verification</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Email sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="body1">Email OTP Protection</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                borderRadius: '20px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                margin:'20px'
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <LoginIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography 
                    component="h1" 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 1
                    }}
                  >
                    {showOtp ? 'Enter OTP' : 'Sign In'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {showOtp ? 'Enter the 6-digit code sent to your email' : 'Welcome back to Porter▸Xpresso'}
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }}
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
                      size="large"
                      endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        borderRadius: '12px',
                        bgcolor: '#1976d2',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 8px 25px rgba(25,118,210,0.3)',
                        '&:hover': {
                          bgcolor: '#1565c0',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(25,118,210,0.4)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant='body2' color="text.secondary">
                        <Link 
                          to="/forget-password" 
                          style={{ 
                            textDecoration: 'none',
                            color: '#1976d2',
                            fontWeight: 600
                          }}
                        >
                          Forgot Password?
                        </Link>
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Link 
                          to="/register" 
                          style={{ 
                            textDecoration: 'none',
                            color: '#1976d2',
                            fontWeight: 600
                          }}
                        >
                          Sign up here
                        </Link>
                      </Typography>
                    </Box>
                  </form>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
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
                      variant="outlined"
                      size="large"
                      sx={{ 
                        mt: 3,
                        borderRadius: '12px',
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1565c0',
                          bgcolor: 'rgba(25,118,210,0.04)',
                        }
                      }}
                      onClick={handleBackToLogin}
                    >
                      Back to Login
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
