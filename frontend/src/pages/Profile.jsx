import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import porterService from '../services/porterService';
import API from '../config';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [porterInfo, setPorterInfo] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    if (user?.role === 'PORTER') {
      fetchPorterInfo();
    }
  }, [user]);

  const fetchPorterInfo = async () => {
    try {
      const data = await porterService.getPorterProfile();
      setPorterInfo(data);
    } catch (err) {
      console.error('Failed to fetch porter info:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/auth/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Password changed successfully. Logging out...');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        <Grid container spacing={3}>
          {/* User Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 3
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5">{user?.username}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {user?.email}
                  </Typography>
                  <Chip 
                    label={user?.role} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Porter-specific information */}
              {user?.role === 'PORTER' && porterInfo && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Porter Information
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1">
                        {porterInfo.phone || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Vehicle Type
                      </Typography>
                      <Typography variant="body1">
                        {porterInfo.vehicleType || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        License Number
                      </Typography>
                      <Typography variant="body1">
                        {porterInfo.licenseNumber || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Status
                      </Typography>
                      <Chip 
                        label={porterInfo.status || 'Unknown'} 
                        color={getStatusColor(porterInfo.status)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Rating
                      </Typography>
                      <Typography variant="body1">
                        {porterInfo.rating ? `${porterInfo.rating.toFixed(1)} ⭐` : 'No rating yet'}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Change Password Section */}
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handlePasswordChange}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{ mt: 1 }}
                    >
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Additional Information or Stats */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1">
                    {user?.role === 'PORTER'
                      ? 'Delivery Partner'
                      : user?.role === 'ADMIN'
                        ? 'Admin'
                        : 'Customer'}
                  </Typography>
                </Grid>

                {user?.role === 'PORTER' && porterInfo && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1">
                        {porterInfo.createdAt ? new Date(porterInfo.createdAt).toLocaleDateString() : 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {porterInfo.updatedAt ? new Date(porterInfo.updatedAt).toLocaleDateString() : 'Unknown'}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 