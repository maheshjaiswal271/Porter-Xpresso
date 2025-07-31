import React, { useState, useEffect, useContext } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  LocalShipping as DeliveryIcon
} from '@mui/icons-material';
// Removed date-fns import - using native JavaScript date formatting
import { toast } from 'react-toastify';
import porterService from '../../services/porterService';
import Swal from 'sweetalert2';
import { DeliveryEventContext } from '../../contexts/DeliveryEventContext';
import { connectWebSocket } from '../../services/websocketService';

const AvailableTasks = ({ onTaskAccepted }) => {
  const { reloadFlag } = useContext(DeliveryEventContext);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bannerDeliveries, setBannerDeliveries] = useState([]);

  useEffect(() => {
    fetchAvailableDeliveries();
  }, []);

  useEffect(() => {
    fetchAvailableDeliveries();
  }, [reloadFlag]);

  useEffect(() => {
    const handleNewDelivery = (delivery) => {
      if (delivery.status === 'PENDING') {
        setBannerDeliveries((prev) => {
          if (prev.some((b) => b.delivery.id === delivery.id)) return prev;
          return [...prev, { delivery, timer: 8 }];
        });
      }
    };
    connectWebSocket(handleNewDelivery);
    return () => {};
  }, []);

  useEffect(() => {
    if (bannerDeliveries.length === 0) {
       fetchAvailableDeliveries();
    }
    const interval = setInterval(() => {
      setBannerDeliveries((prev) =>
        prev
          .map((b) => ({ ...b, timer: b.timer - 1 }))
          .filter((b) => b.timer > 0)
      );
    }, 1000);
    return () => clearInterval(interval);
    fetchAvailableDeliveries();
  }, [bannerDeliveries.length]);

  const handleAcceptBannerDelivery = async (bannerId) => {
    const banner = bannerDeliveries.find((b) => b.delivery.id === bannerId);
    if (!banner) return;
    const { delivery } = banner;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await porterService.acceptDeliveryWithLocation(delivery.id, latitude, longitude);
            toast.success('Delivery accepted successfully!');
            setBannerDeliveries((prev) => prev.filter((b) => b.delivery.id !== delivery.id));
            if (onTaskAccepted) onTaskAccepted();
            fetchAvailableDeliveries();
          } catch (err) {
            toast.error(err.message || 'Failed to accept delivery');
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Location Required',
            text: 'Location access is required to accept delivery.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Geolocation Not Supported',
        text: 'Geolocation is not supported by your browser.'
      });
    }
  };

  const fetchAvailableDeliveries = async () => {
    try {
      const deliveries = await porterService.getAvailableDeliveries();
      setAvailableDeliveries(deliveries);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch available deliveries');
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async () => {
    if (!selectedDelivery) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await porterService.acceptDeliveryWithLocation(selectedDelivery.id, latitude, longitude);
            toast.success('Delivery accepted successfully!');
            setConfirmDialogOpen(false);
            setSelectedDelivery(null);
            if (onTaskAccepted) {
              onTaskAccepted();
            }
            fetchAvailableDeliveries();
          } catch (err) {
            toast.error(err.message || 'Failed to accept delivery');
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Location Required',
            text: 'Location access is required to accept delivery.'
          });
          setConfirmDialogOpen(false);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Geolocation Not Supported',
        text: 'Geolocation is not supported by your browser.'
      });
    }
  };

  const handleOpenConfirmDialog = (delivery) => {
    setSelectedDelivery(delivery);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedDelivery(null);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      {/* Modal for new delivery banners */}
      <Dialog open={bannerDeliveries.length > 0} maxWidth="sm" fullWidth>
        <DialogTitle>New Delivery Available!</DialogTitle>
        <DialogContent>
          {bannerDeliveries.map((b) => (
            <Paper key={b.delivery.id} sx={{ p: 2, mb: 2, background: '#fffbe6', border: '2px solid #ffd700', position: 'relative' }} elevation={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" color="warning.main">Delivery</Typography>
                  <Typography variant="body1"><strong>From:</strong> {b.delivery.pickupLocation?.address}</Typography>
                  <Typography variant="body1"><strong>To:</strong> {b.delivery.deliveryLocation?.address}</Typography>
                  <Typography variant="body2">Scheduled: {b.delivery.scheduledTime && new Date(b.delivery.scheduledTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}</Typography>
                  <Typography variant="body2">Amount: ₹{b.delivery.amount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
                  <Button variant="contained" color="primary" onClick={() => handleAcceptBannerDelivery(b.delivery.id)} sx={{ mb: 1 }}>Accept</Button>
                  <LinearProgress variant="determinate" value={(b.timer / 10) * 100} sx={{ width: '100%', height: 8, borderRadius: 4, background: '#ffe082' }} />
                  <Typography variant="caption" color="warning.main">{b.timer}s</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBannerDeliveries([])} color="secondary">Dismiss All</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Available Deliveries
        </Typography>

        {availableDeliveries.length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
            No available deliveries at the moment
          </Typography>
        ) : (
          <List>
            {availableDeliveries.map((delivery) => (
              <ListItem
                key={delivery.id}
                divider
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DeliveryIcon color="primary" />
                      <Typography variant="subtitle1">
                        {delivery.packageType} - {delivery.weight}kg
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          From: {delivery.pickupLocation.address}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          To: {delivery.deliveryLocation.address}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          label={`Scheduled: ${new Date(delivery.scheduledTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}`}
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          size="small"
                          label={`₹${delivery.amount}`}
                          color="primary"
                        />
                      </Box>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenConfirmDialog(delivery)}
                  >
                    Accept
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirm Delivery Acceptance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to accept this delivery? You will be responsible for picking up and delivering the package according to the scheduled time.
          </DialogContentText>
          {selectedDelivery && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Delivery Details:
              </Typography>
              <Typography variant="body2">
                • Package Type: {selectedDelivery.packageType}
              </Typography>
              <Typography variant="body2">
                • Weight: {selectedDelivery.weight}kg
              </Typography>
              <Typography variant="body2">
                • Amount: ₹{selectedDelivery.amount}
              </Typography>
              <Typography variant="body2">
                • Scheduled Time: {new Date(selectedDelivery.scheduledTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleAcceptDelivery} variant="contained" color="primary">
            Accept Delivery
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AvailableTasks; 