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
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Register for PORTER▸XPRESSO
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((x) => !x)}
                          edge="end"
                          size="small"
                          sx={{ p: 0.5, ml: -1 }}
                        >
                          {showPassword ? <VisibilityOff fontSize="medium" color="primary" /> : <Visibility fontSize="medium" color="primary" />}
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((x) => !x)}
                          edge="end"
                          size="small"
                          sx={{ p: 0.5, ml: -1 }}
                        >
                          {showConfirmPassword ? <VisibilityOff fontSize="medium" color="primary" /> : <Visibility fontSize="medium" color="primary" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="PORTER">Porter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Porter-specific fields */}
            {formData.role === 'PORTER' && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                  Porter Information
                </Typography>
                
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
                      >
                        <MenuItem value="BIKE">Bike</MenuItem>
                        <MenuItem value="SCOOTER">Scooter</MenuItem>
                        <MenuItem value="CAR">Car</MenuItem>
                        <MenuItem value="VAN">Van</MenuItem>
                        <MenuItem value="TRUCK">Truck</MenuItem>
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
                    />
                  </Grid>
                </Grid>
              </>
            )}

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
              
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;