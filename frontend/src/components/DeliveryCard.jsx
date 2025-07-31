import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  LocalShipping,
  AccessTime,
  LocationOn,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  DirectionsRun
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    case 'IN_TRANSIT':
      return 'info';
    default:
      return 'default';
  }
};

const DeliveryCard = ({ delivery, onCancelDelivery, onDeleteDelivery, isActiveDelivery }) => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [error, setError] = useState('');

  const handleOpenDialog = () => {
    setShowDetailsDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setShowDetailsDialog(false);
    setError('');
  };

  const handleConfirmDialogOpen = (action) => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
    setError('');
  };

  const handleConfirmDialogClose = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setError('');
  };

  const handleActionConfirm = async () => {
    try {
      if (confirmAction === 'cancel') {
        await onCancelDelivery(delivery);
      } else if (confirmAction === 'delete') {
        await onDeleteDelivery(delivery);
      }
      handleConfirmDialogClose();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          mb: 2,
          '&:hover': {
            boxShadow: 6
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="div">
              Delivery #{delivery.id}
            </Typography>
            <Chip
              label={delivery.status}
              color={getStatusColor(delivery.status)}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocalShipping sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {delivery.packageType} - {delivery.weight}kg
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(delivery.scheduledTime).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {delivery.pickupLocation.address} → {delivery.deliveryLocation.address}
            </Typography>
          </Box>

          {delivery.distance && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DirectionsRun sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Distance: {delivery.distance.toFixed(2)} km | Price: ₹{delivery.amount.toFixed(2)}
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={handleOpenDialog}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {delivery.status === 'PENDING' && (
            <Tooltip title="Cancel Delivery">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleConfirmDialogOpen('cancel')}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          )}
          {delivery.status === 'CANCELLED' && onDeleteDelivery && (
            <Tooltip title="Delete Delivery">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleConfirmDialogOpen('delete')}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={showDetailsDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Delivery Details #{delivery.id}
            </Typography>
            <Chip
              label={delivery.status}
              color={getStatusColor(delivery.status)}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="subtitle1" gutterBottom>
            Package Information
          </Typography>
          <Typography variant="body2" paragraph>
            Type: {delivery.packageType}<br />
            Weight: {delivery.weight}kg<br />
            Description: {delivery.description || 'No description provided'}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Locations
          </Typography>
          <Typography variant="body2" paragraph>
            Pickup: {delivery.pickupLocation.address}<br />
            Dropoff: {delivery.deliveryLocation.address}<br />
            {delivery.distance && (
              <>
                Distance: {delivery.distance.toFixed(2)} km<br />
                Price: ₹{delivery.amount.toFixed(2)}
              </>
            )}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Schedule
          </Typography>
          <Typography variant="body2" paragraph>
            Scheduled Time: {new Date(delivery.scheduledTime).toLocaleString()}
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {delivery.status === 'PENDING' && (
            <Button 
              color="error" 
              onClick={() => handleConfirmDialogOpen('cancel')}
            >
              Cancel Delivery
            </Button>
          )}
          {delivery.status === 'CANCELLED' && onDeleteDelivery && (
            <Button 
              color="error" 
              onClick={() => handleConfirmDialogOpen('delete')}
            >
              Delete Delivery
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleConfirmDialogClose}
      >
        <DialogTitle>
          {confirmAction === 'cancel' ? 'Confirm Cancellation' : 'Confirm Deletion'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction === 'cancel' 
              ? 'Are you sure you want to cancel this delivery? This action cannot be undone.'
              : 'Are you sure you want to permanently delete this delivery? This action cannot be undone.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>No, Keep It</Button>
          <Button 
            onClick={handleActionConfirm} 
            color="error" 
            variant="contained"
          >
            {confirmAction === 'cancel' ? 'Yes, Cancel Delivery' : 'Yes, Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeliveryCard;