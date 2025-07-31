import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeafletLocationPicker from '../components/maps/LeafletLocationPicker';
import RouteMap from '../components/maps/RouteMap';
import Payment from '../components/Payment';
import axios from 'axios';
import { debounce } from 'lodash';
import API from '../config';

const calculatePrice = (distance) => {
  const basePrice = 20; // Base price per kilometer in INR
  const minPrice = 50; // Minimum delivery price in INR
  const price = distance * basePrice;
  return Math.max(price, minPrice);
};

const BookDelivery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [deliveryId, setDeliveryId] = useState(null);
  const [formData, setFormData] = useState({
    pickupLocation: null,
    deliveryLocation: null,
    packageType: 'SMALL',
    packageWeight: '',
    description: '',
    scheduledTime: new Date(),
    selectedRouteIndex: 0
  });
  const [availableRoutes, setAvailableRoutes] = useState([]);

   const debouncedPickupSelect = useCallback(
    debounce((location) => {
      handleLocationSelect('pickupLocation', location);
    }, 500),
    []
  );

  const debouncedDropoffSelect = useCallback(
    debounce((location) => {
      handleLocationSelect('deliveryLocation', location);
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedPickupSelect.cancel();
      debouncedDropoffSelect.cancel();
    };
  }, [debouncedPickupSelect, debouncedDropoffSelect]);

  const handleRouteCalculated = (routes, selectedIndex = 0) => {
    setAvailableRoutes(routes);
    if (routes.length > 0) {
      const selectedRoute = routes[selectedIndex];
      setFormData(prev => ({
        ...prev,
        selectedRouteIndex: selectedIndex
      }));
      toast.info(`Selected Route: ${selectedRoute.distance.toFixed(2)} km, estimated ${selectedRoute.duration} minutes`);
    }
  };

  const handleLocationSelect = (type, location) => {
    setFormData(prev => ({
      ...prev,
      [type]: location
    }));
    setError('');
    toast.success(`${type === 'pickupLocation' ? 'Pickup' : 'Dropoff'} location selected`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      scheduledTime: newValue
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.pickupLocation) {
      toast.error('Please select a pickup location');
      return false;
    }
    if (!formData.deliveryLocation) {
      toast.error('Please select a dropoff location');
      return false;
    }
    if (!formData.packageWeight || formData.packageWeight <= 0) {
      toast.error('Please enter a valid packageWeight');
      return false;
    }
    if (!formData.description) {
      toast.error('Please enter a package description');
      return false;
    }
    if (!formData.scheduledTime || formData.scheduledTime < new Date()) {
      toast.error('Please select a future delivery time');
      return false;
    }
    if (availableRoutes.length === 0) {
      toast.error('Please wait for route calculation');
      return false;
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
    const selectedRoute = availableRoutes[formData.selectedRouteIndex];

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to book a delivery');
      }

      const response = await axios.post(
        `${API}/deliveries/delivery`,
        {
          pickupLocation: {
            latitude: formData.pickupLocation.lat,
            longitude: formData.pickupLocation.lng,
            address: formData.pickupLocation.address
          },
          deliveryLocation: {
            latitude: formData.deliveryLocation.lat,
            longitude: formData.deliveryLocation.lng,
            address: formData.deliveryLocation.address
          },
          packageType: formData.packageType,
          packageWeight: parseFloat(formData.packageWeight),
          description: formData.description,
          scheduledTime: formData.scheduledTime.toISOString(),
          distance: selectedRoute.distance,
          amount: calculatePrice(selectedRoute.distance),
          deliveryFee: calculatePrice(selectedRoute.distance)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDeliveryId(response.data.id);
      setShowPayment(true);
      toast.success('Delivery details saved! Please proceed with payment.');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        const errorMessage = err.response?.data?.message || 'Failed to book delivery. Please try again.';
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/deliveries/delivery/${deliveryId}/payment`,
        { paymentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Delivery booked successfully!');
      navigate('/history');
    } catch (error) {
      toast.error('Failed to update payment status. Please contact support.');
    }
  };

  const handlePaymentError = (error) => {
    setError(error);
    setShowPayment(false);
  };

  return (
    <Container maxWidth="lg">
      <ToastContainer position="top-right" autoClose={3000} />

      <Typography variant="h4" gutterBottom>
        Book a Delivery
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!showPayment ? (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Pickup Location
                </Typography>
                <LeafletLocationPicker
                  key="pickup"
                  onLocationSelect={debouncedPickupSelect}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Dropoff Location
                </Typography>
                <LeafletLocationPicker
                  key="dropoff"
                  onLocationSelect={debouncedDropoffSelect}
                />
              </Paper>
            </Grid>

            {formData.pickupLocation && formData.deliveryLocation && (
              <Grid item xs={12}>
                <RouteMap
                  pickupLocation={formData.pickupLocation}
                  deliveryLocation={formData.deliveryLocation}
                  onRouteCalculated={handleRouteCalculated}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Package Type</InputLabel>
                      <Select
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleChange}
                        label="Package Type"
                      >
                        <MenuItem value="SMALL">Small</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="LARGE">Large</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      name="packageWeight"
                      type="number"
                      value={formData.packageWeight}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Package Description"
                      name="description"
                      multiline
                      rows={2}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Scheduled Time"
                        value={formData.scheduledTime}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDateTime={new Date()}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !formData.pickupLocation || !formData.deliveryLocation || availableRoutes.length === 0}
                  >
                    {loading ? 'Booking...' : 'Book Delivery'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Complete Payment
          </Typography>
          <Payment
            amount={calculatePrice(availableRoutes[formData.selectedRouteIndex].distance)}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            deliveryId={deliveryId}
          />
        </Box>
      )}
    </Container>
  );
};

export default BookDelivery;