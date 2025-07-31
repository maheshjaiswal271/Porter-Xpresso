import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Container, Typography, Paper, Box, CircularProgress, Alert, Chip, Modal, Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import API from '../config';


const OrderTracking = () => {
  const { deliveryId } = useParams();
  const [tracking, setTracking] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRefs = useRef({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 10000);
    return () => clearInterval(interval);
  }, [deliveryId]);

  const fetchTracking = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const trackingRes = await axios.get(`${API}/tracking/${deliveryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { tracking: newTracking, delivery: newDelivery } = trackingRes.data;

      setTracking(prev => {
        const last = prev[prev.length - 1];
        const newLast = newTracking[newTracking.length - 1];
        if (!last || last.timestamp !== newLast.timestamp) {
          return newTracking;
        }
        return prev;
      });

      if (newDelivery && !delivery) {
        setDelivery(newDelivery);
      }
    } catch (err) {
      setError('Order is not Accepted By Porter!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!delivery || !mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([
      delivery.pickupLocation.latitude,
      delivery.pickupLocation.longitude,
    ], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(mapInstance.current);

    // Pickup marker
    markerRefs.current.pickup = L.marker(
      [delivery.pickupLocation.latitude, delivery.pickupLocation.longitude],
      {
        title: 'Pickup Location',
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [32, 32],
        }),
      }
    ).addTo(mapInstance.current).bindPopup('Pickup Location');

    // Dropoff marker
    markerRefs.current.dropoff = L.marker(
      [delivery.deliveryLocation.latitude, delivery.deliveryLocation.longitude],
      {
        title: 'Dropoff Location',
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      }
    ).addTo(mapInstance.current).bindPopup('Dropoff Location');
  }, [delivery]);

  useEffect(() => {
    if (!mapInstance.current || !tracking.length) return;

    const latest = tracking[tracking.length - 1];
    if (!latest) return;

    if (markerRefs.current.porter) {
      markerRefs.current.porter.setLatLng([latest.latitude, latest.longitude]);
    } else {
      markerRefs.current.porter = L.marker(
        [latest.latitude, latest.longitude],
        {
          title: 'Porter Location',
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        }
      ).addTo(mapInstance.current).bindPopup('Porter Current Location');
    }

    mapInstance.current.setView([latest.latitude, latest.longitude], 14);
  }, [tracking]);

  useEffect(() => {
    if (delivery && delivery.status === 'DELIVERED' && !ratingSubmitted) {
      setShowRatingModal(true);
    }
  }, [delivery, ratingSubmitted]);

  const handleSubmitRating = async () => {
    if (!delivery?.porter?.id || !userRating) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/deliveries/rate-porter`, {
        porterId: delivery.porter.id,
        rating: userRating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRatingSubmitted(true);
      setShowRatingModal(false);
    } catch (err) {
      alert('Failed to submit rating');
    }
  };


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Order Tracking</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress />}
      {!loading && delivery && (
        <>
          {delivery.status === 'DELIVERED' && (
            <Alert severity="success" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold' }}>
              🎉 Order Delivered!
            </Alert>
          )}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Order Details</Typography>
            <Box sx={{ mb: 1 }}><strong>Order ID:</strong> {delivery.id}</Box>
            <Box sx={{ mb: 1 }}><strong>Status:</strong> <Chip label={delivery.status} color="primary" /></Box>
            <Box sx={{ mb: 1 }}><strong>Pickup:</strong> {delivery.pickupLocation.address}</Box>
            <Box sx={{ mb: 1 }}><strong>Dropoff:</strong> {delivery.deliveryLocation.address}</Box>
            <Box sx={{ mb: 1 }}><strong>Porter:</strong> {delivery.porter ? delivery.porter.name : 'Not assigned'}
              {delivery.porter && (
                <span style={{ marginLeft: 8 }}>
                  {delivery.porter.rating ? `${delivery.porter.rating.toFixed(1)} ⭐` : 'No rating yet'}
                </span>
              )}
            </Box>
            <Box sx={{ mb: 1 }}><strong>Package:</strong> {delivery.packageType} ({delivery.packageWeight} kg)</Box>
            <Box sx={{ mb: 1 }}><strong>Scheduled Time:</strong> {delivery.scheduledTime}</Box>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Live Map</Typography>
            <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
          </Paper>
        </>
      )}
      <Modal open={showRatingModal} onClose={() => setShowRatingModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>Rate Your Porter</Typography>
          <Rating
            name="porter-rating"
            value={userRating}
            onChange={(_, newValue) => setUserRating(newValue)}
            precision={1}
            size="large"
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleSubmitRating} disabled={!userRating}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default OrderTracking; 