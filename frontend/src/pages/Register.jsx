import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  PersonAdd,
  ArrowForward,
  Person,
  LocalShipping,
  CheckCircle,
  Email,
  Phone,
  DirectionsCar
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { InputAdornment, IconButton } from '@mui/material';
import logo from '../images/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    // Porter-specific fields
    phone: '',
    vehicleType: '',
    licenseNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Validate porter-specific fields
    if (formData.role === 'PORTER') {
      if (!formData.phone.trim()) {
        setError('Phone number is required for porters');
        return false;
      }
      if (!formData.vehicleType.trim()) {
        setError('Vehicle type is required for porters');
        return false;
      }
      if (!formData.licenseNumber.trim()) {
        setError('License number is required for porters');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Add porter-specific data if role is PORTER
      if (formData.role === 'PORTER') {
        registrationData.phone = formData.phone;
        registrationData.vehicleType = formData.vehicleType;
        registrationData.licenseNumber = formData.licenseNumber;
      }

      const response = await register(registrationData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <Person />, title: 'User Account', description: 'Book deliveries and track packages' },
    { icon: <LocalShipping />, title: 'Porter Account', description: 'Earn money by delivering packages' },
    { icon: <CheckCircle />, title: 'Verified Profiles', description: 'Secure and verified user accounts' }
  ];

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
                Join Our Community!
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
                Create your account and start your journey with Porter▸Xpresso. 
                Whether you're a customer or a porter, we have the perfect plan for you.
              </Typography>

              {/* Benefits */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {benefit.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Registration Form */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                borderRadius: '20px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                margin: '20px'
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
                    <PersonAdd sx={{ color: 'white', fontSize: 30 }} />
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
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Join Porter▸Xpresso and start your journey
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Basic Information Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                      Basic Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
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
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          type="email"
                          value={formData.email}
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
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          autoComplete="new-password"
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
                                  onClick={() => setShowPassword((x) => !x)}
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
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="confirmPassword"
                          label="Confirm Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={formData.confirmPassword}
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
                                  onClick={() => setShowConfirmPassword((x) => !x)}
                                  edge="end"
                                  size="small"
                                  sx={{ p: 0.5 }}
                                >
                                  {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="role-label">Account Type</InputLabel>
                          <Select
                            labelId="role-label"
                            id="role"
                            name="role"
                            value={formData.role}
                            label="Account Type"
                            onChange={handleChange}
                            sx={{
                              borderRadius: '12px',
                              '& .MuiOutlinedInput-notchedOutline': {
                                '&:hover': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                          >
                            <MenuItem value="USER">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person sx={{ fontSize: 20 }} />
                                User - Book Deliveries
                              </Box>
                            </MenuItem>
                            <MenuItem value="PORTER">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalShipping sx={{ fontSize: 20 }} />
                                Porter - Earn Money
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Porter-specific fields */}
                  {formData.role === 'PORTER' && (
                    <Box sx={{ mb: 4 }}>
                      <Divider sx={{ my: 3 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <LocalShipping sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Porter Information
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '&:hover fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                            <Select
                              labelId="vehicle-type-label"
                              id="vehicleType"
                              name="vehicleType"
                              value={formData.vehicleType}
                              label="Vehicle Type"
                              onChange={handleChange}
                              sx={{
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  '&:hover': {
                                    borderColor: '#1976d2',
                                  },
                                },
                              }}
                            >
                              <MenuItem value="BIKE">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DirectionsCar sx={{ fontSize: 20 }} />
                                  Bike
                                </Box>
                              </MenuItem>
                              <MenuItem value="SCOOTER">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DirectionsCar sx={{ fontSize: 20 }} />
                                  Scooter
                                </Box>
                              </MenuItem>
                              <MenuItem value="CAR">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DirectionsCar sx={{ fontSize: 20 }} />
                                  Car
                                </Box>
                              </MenuItem>
                              <MenuItem value="VAN">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DirectionsCar sx={{ fontSize: 20 }} />
                                  Van
                                </Box>
                              </MenuItem>
                              <MenuItem value="TRUCK">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DirectionsCar sx={{ fontSize: 20 }} />
                                  Truck
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="licenseNumber"
                            label="License Number"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            placeholder="Enter your driving license number"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '&:hover fieldset': {
                                  borderColor: '#1976d2',
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={loading ? null : <ArrowForward />}
                      sx={{
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
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    
                    <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        style={{ 
                          textDecoration: 'none',
                          color: '#1976d2',
                          fontWeight: 600
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Register;