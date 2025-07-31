import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Box,
  Alert,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  LocationSearching as LocationSearchingIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import DeliveryCard from '../components/DeliveryCard';
import Payment from '../components/Payment';
import { useNavigate, useLocation } from 'react-router-dom';
import { DeliveryEventContext } from '../contexts/DeliveryEventContext';
import API from '../config';

const statusColors = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  PICKED_UP: 'secondary',
  IN_TRANSIT: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error',
  COMPLETED: 'success',
  FAILED: 'error'
};

const DeliveryHistory = () => {
  const { reloadFlag } = useContext(DeliveryEventContext);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const statusOptions = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
  ];
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [confirmCancelDialog, setConfirmCancelDialog] = useState(false);
  const [deliveryToCancel, setDeliveryToCancel] = useState(null);
  const [actionError, setActionError] = useState('');
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDelivery, setPaymentDelivery] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  useEffect(() => {
    if (query.get('filter') === 'PAYMENT_PENDING') {
      setStatusFilter('PAYMENT_PENDING');
    }
  }, [location.search]);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [reloadFlag]);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/deliveries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDeliveries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDelivery = async (delivery) => {
    try {
      setActionError('');
      setSelectedDelivery(delivery);
      setShowDeliveryDialog(true);
    } catch (err) {
      setActionError('Failed to load delivery details');
    }
  };

  const handleCloseDeliveryDialog = () => {
    setShowDeliveryDialog(false);
    setSelectedDelivery(null);
    setActionError('');
  };

  const initiateDeliveryCancellation = (delivery) => {
    if (delivery.status !== 'PENDING') {
      setActionError('Only pending deliveries can be cancelled');
      return;
    }
    setDeliveryToCancel(delivery);
    setConfirmCancelDialog(true);
  };

  const handleCancelDelivery = async () => {
    if (!deliveryToCancel) return;
    
    try {
      setActionError('');
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API}/deliveries/${deliveryToCancel.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        await fetchDeliveries(); 
        setConfirmCancelDialog(false);
        setDeliveryToCancel(null);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to cancel delivery');
    }
  };

  const initiateDeliveryDeletion = (delivery) => {
    if (delivery.status !== 'CANCELLED') {
      setActionError('Only cancelled deliveries can be deleted');
      return;
    }
    setDeliveryToDelete(delivery);
    setConfirmDeleteDialog(true);
  };

  const handleDeleteDelivery = async () => {
    if (!deliveryToDelete) return;
    
    try {
      setActionError('');
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API}/deliveries/${deliveryToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        await fetchDeliveries(); // Refresh the list after deletion
        setConfirmDeleteDialog(false);
        setDeliveryToDelete(null);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete delivery');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const unpaidFilter = query.get('filter') === 'unpaid' || statusFilter === 'PAYMENT_PENDING';

  const filteredDeliveries = deliveries.filter(delivery => {
    if (unpaidFilter) {
      return delivery.status === 'DELIVERED' && delivery.paymentStatus === 'PENDING';
    }
    return statusFilter === 'ALL' ? true : delivery.status === statusFilter;
  });

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const handleOpenPaymentDialog = (delivery) => {
    setPaymentDelivery(delivery);
    setShowPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setShowPaymentDialog(false);
    setPaymentDelivery(null);
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/deliveries/delivery/${paymentDelivery.id}/payment`,
        { paymentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowPaymentDialog(false);
      setPaymentDelivery(null);
      await fetchDeliveries();
      setActionError('Payment successful! Invoice sent to your email.');
    } catch (error) {
      setActionError('Failed to update payment status. Please contact support.');
    }
  };

  const handlePaymentError = (error) => {
    setActionError(error);
    setShowPaymentDialog(false);
    setPaymentDelivery(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Delivery History
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 180, mr: 2 }}
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Pickup Location</TableCell>
                <TableCell>Dropoff Location</TableCell>
                <TableCell>Scheduled Time</TableCell>
                <TableCell>Porter</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Package Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDeliveries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon color="primary" sx={{ mr: 1 }} />
                        {delivery.pickupLocation.address}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon color="secondary" sx={{ mr: 1 }} />
                        {delivery.deliveryLocation.address}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDateTime(delivery.scheduledTime)}</TableCell>
                    <TableCell>{delivery.porter?.name == null ? '' : delivery.porter?.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={delivery.status}
                        color={statusColors[delivery.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={delivery.paymentStatus}
                        color={statusColors[delivery.paymentStatus]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{delivery.packageType}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDelivery(delivery)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        {delivery.status === 'PENDING' && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => initiateDeliveryCancellation(delivery)}
                          >
                            <CancelIcon />
                          </IconButton>
                        )}
                        {delivery.status === 'CANCELLED' && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => initiateDeliveryDeletion(delivery)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        {delivery.status === 'DELIVERED' && delivery.paymentStatus === 'PENDING' && (
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleOpenPaymentDialog(delivery)}
                            title="Pay Now"
                          >
                            <PaymentIcon />
                          </IconButton>
                        )}
                        {delivery.status != 'DELIVERED' && delivery.paymentStatus != 'PENDING' && (
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => window.open(`/track/${delivery.id}`, '_blank')}
                          title="Track Order"
                        >
                          <LocationSearchingIcon />
                        </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredDeliveries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No deliveries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDeliveries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Delivery Details Dialog */}
        <Dialog 
          open={showDeliveryDialog} 
          onClose={handleCloseDeliveryDialog}
          maxWidth="md"
          fullWidth
        >
          {actionError && (
            <Alert severity="error" sx={{ m: 2 }}>
              {actionError}
            </Alert>
          )}
          {selectedDelivery && (
            <DeliveryCard 
              delivery={selectedDelivery}
              onCancelDelivery={initiateDeliveryCancellation}
              isActiveDelivery={selectedDelivery.status === 'PENDING'}
            />
          )}
        </Dialog>

        {/* Confirmation Dialog for Cancellation */}
        <Dialog
          open={confirmCancelDialog}
          onClose={() => setConfirmCancelDialog(false)}
        >
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel this delivery? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmCancelDialog(false)}>No, Keep It</Button>
            <Button onClick={handleCancelDelivery} color="error" variant="contained">
              Yes, Cancel Delivery
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for Deletion */}
        <Dialog
          open={confirmDeleteDialog}
          onClose={() => setConfirmDeleteDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to permanently delete this delivery? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteDialog(false)}>No, Keep It</Button>
            <Button onClick={handleDeleteDelivery} color="error" variant="contained">
              Yes, Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog
          open={showPaymentDialog}
          onClose={handleClosePaymentDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogContent>
            {paymentDelivery && (
              <Payment
                amount={paymentDelivery.amount || paymentDelivery.deliveryFee}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                deliveryId={paymentDelivery.id}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePaymentDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default DeliveryHistory; 