import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
// Removed date-fns import - using native JavaScript date formatting
import porterService from '../../services/porterService';

const statusColors = {
  DELIVERED: 'success',
  CANCELLED: 'error'
};

const PorterDeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  const fetchDeliveryHistory = async () => {
    try {
      const deliveryHistory = await porterService.getDeliveryHistory();
      setDeliveries(deliveryHistory);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch delivery history');
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
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
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Package Type</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Scheduled Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((delivery) => (
                  <TableRow hover key={delivery.id}>
                    <TableCell>{delivery.id}</TableCell>
                    <TableCell>{delivery.packageType}</TableCell>
                    <TableCell>{delivery.user.username}</TableCell>
                    <TableCell>
                      {new Date(delivery.scheduledTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={delivery.status}
                        color={statusColors[delivery.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₹{delivery.amount}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetails(delivery)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {deliveries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No delivery history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={deliveries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delivery Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delivery Details</DialogTitle>
        <DialogContent>
          {selectedDelivery && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Package Information
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Type: {selectedDelivery.packageType}
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Weight: {selectedDelivery.weight}kg
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Description: {selectedDelivery.description}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                Locations
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <LocationIcon color="action" />
                <Typography variant="body2">
                  Pickup: {selectedDelivery.pickupLocation.address}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationIcon color="action" />
                <Typography variant="body2">
                  Dropoff: {selectedDelivery.deliveryLocation.address}
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                Timing & Status
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Scheduled: {new Date(selectedDelivery.scheduledTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Created: {new Date(selectedDelivery.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Last Updated: {new Date(selectedDelivery.updatedAt).toLocaleDateString('en-US', {
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
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PorterDeliveryHistory; 