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
  Stepper,
  Step,
  StepLabel
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

const deliverySteps = ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

const ActiveDeliveries = () => {
  const { reloadFlag } = useContext(DeliveryEventContext);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  useEffect(() => {
    // Refetch active deliveries when reloadFlag changes
    fetchActiveDeliveries();
  }, [reloadFlag]);

  const fetchActiveDeliveries = async () => {
    try {
      const deliveries = await porterService.getActiveDeliveries();
      setActiveDeliveries(deliveries);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch active deliveries');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedDelivery) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await porterService.updateDeliveryStatusWithLocation(selectedDelivery.id, newStatus, latitude, longitude);
            toast.success('Delivery status updated successfully!');
            setUpdateDialogOpen(false);
            setSelectedDelivery(null);
            fetchActiveDeliveries(); // Refresh the list
          } catch (err) {
            toast.error(err.message || 'Failed to update delivery status');
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Location Required',
            text: 'Location access is required to update delivery status.'
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

  const getNextStatus = (currentStatus) => {
    const currentIndex = deliverySteps.indexOf(currentStatus);
    return currentIndex < deliverySteps.length - 1 ? deliverySteps[currentIndex + 1] : null;
  };

  const handleOpenUpdateDialog = (delivery) => {
    setSelectedDelivery(delivery);
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedDelivery(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'info';
      case 'PICKED_UP':
        return 'warning';
      case 'IN_TRANSIT':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      default:
        return 'default';
    }
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
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Active Deliveries
        </Typography>

        {activeDeliveries.filter(d => ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(d.status)).length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
            No active deliveries at the moment
          </Typography>
        ) : (
          <List>
            {activeDeliveries.filter(d => ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(d.status)).map((delivery) => (
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
                      <Chip
                        size="small"
                        label={delivery.status}
                        color={getStatusColor(delivery.status)}
                        sx={{ ml: 1 }}
                      />
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
                  {getNextStatus(delivery.status) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenUpdateDialog(delivery)}
                    >
                      Update Status
                    </Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
      >
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the status of this delivery to track its progress.
          </DialogContentText>
          {selectedDelivery && (
            <>
              <Box sx={{ mt: 2, mb: 4 }}>
                <Stepper activeStep={deliverySteps.indexOf(selectedDelivery.status)}>
                  {deliverySteps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label.replace('_', ' ')}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Typography variant="subtitle2" gutterBottom>
                Next Status: {getNextStatus(selectedDelivery.status)?.replace('_', ' ')}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button
            onClick={() => handleUpdateStatus(getNextStatus(selectedDelivery.status))}
            variant="contained"
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActiveDeliveries; 