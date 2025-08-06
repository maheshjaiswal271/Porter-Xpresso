import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Snackbar, Alert, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { DeliveryEventContext } from '../contexts/DeliveryEventContext';
import API from '../config';

const statuses = ['ACTIVE', 'COMPLETED', 'CANCELLED'];

const AdminDeliveries = () => {
  const { reloadFlag } = useContext(DeliveryEventContext);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDelivery, setEditDelivery] = useState(null);
  const [deleteDelivery, setDeleteDelivery] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [viewDelivery, setViewDelivery] = useState(null);
  const [selected, setSelected] = useState([]);
  const [porters, setPorters] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    scheduledTime: false,
  });
  const [failedDeletions, setFailedDeletions] = useState([]);


  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/admin/deliveries`, { headers: { Authorization: `Bearer ${token}` } });
      setDeliveries(res.data);
    } catch (err) {
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const fetchPorters = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/porter/all`, { headers: { Authorization: `Bearer ${token}` } });
      setPorters(res.data);
    } catch { }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchPorters();
  }, []);

  useEffect(() => {
    // Refetch admin deliveries when reloadFlag changes
    fetchDeliveries();
  }, [reloadFlag]);

  const handleEdit = (delivery) => setEditDelivery(delivery);
  const handleEditClose = () => setEditDelivery(null);
  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/deliveries/${editDelivery.id}`, editDelivery, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'Delivery updated', severity: 'success' });
      fetchDeliveries();
    } catch {
      setSnackbar({ open: true, message: 'Failed to update delivery', severity: 'error' });
    }
    handleEditClose();
  };

  const handleDelete = (delivery) => setDeleteDelivery(delivery);
  const handleDeleteClose = () => setDeleteDelivery(null);
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/deliveries/${deleteDelivery.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'Delivery deleted', severity: 'success' });
      fetchDeliveries();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete delivery', severity: 'error' });
    }
    handleDeleteClose();
  };

  const handleView = (delivery) => setViewDelivery(delivery);
  const handleViewClose = () => setViewDelivery(null);
  const handleBulkDelete = async () => {
    const token = localStorage.getItem('token');
    if(selected.length == 0){
      setSnackbar({ open: true, message: 'Select delivery first!', severity: 'error' });
      return;
    }
    const selectedIds = Array.isArray(selected.ids) ? selected.ids : Array.from(selected.ids);
    const failed = [];

    await Promise.all(
      selectedIds.map(async (id) => {
        try {
          await axios.delete(`${API}/admin/deliveries/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          failed.push({ id, error: err.response?.data || 'Unknown error' });
        }
      })
    );

    if (failed.length === 0) {
      setSnackbar({ open: true, message: 'Delivery deleted successfully', severity: 'success' });
    } else {
      setFailedDeletions(failed); // Show in dialog
      setSnackbar({ open: true, message: 'Some deliveries failed to delete', severity: 'error' });
    }

    fetchDeliveries();
  };

  const filteredDeliveries = deliveries.filter(d =>
  (d.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
    d.porter?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.status?.toLowerCase().includes(search.toLowerCase()) ||
    String(d.id).includes(search))
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'user', headerName: 'User', flex: 1, valueGetter: params => params?.username || '' },
    { field: 'porter', headerName: 'Porter', flex: 1, valueGetter: params => params?.name || 'Not Assigned' },
    { field: 'pickupLocation', headerName: 'Pickup Location', flex: 1, valueGetter: params => params?.address || '' },
    { field: 'deliveryLocation', headerName: 'Delivery Location', flex: 1, valueGetter: params => params?.address || '' },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'paymentStatus', headerName: 'paymentStatus', flex: 1 },
    { field: 'scheduledTime', headerName: 'Scheduled Time', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleView(params.row)}><VisibilityIcon /></IconButton>
          <IconButton onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row)} color="error"><DeleteIcon /></IconButton>
          {/* Order Tracking button */}
          <IconButton onClick={() => window.open(`/#/track/${params.row.id}`, '_blank')} color="info" title="Track Order">
            <LocationSearchingIcon />
          </IconButton>
        </>
      ),
      flex: 1.5
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Deliveries</Typography>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <SearchIcon sx={{ mr: 1 }} />
        <TextField
          placeholder="Search by user, porter, status, or ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, mr: 2 }}
        />
        <Button variant="contained" color="error" onClick={handleBulkDelete}>Delete Selected</Button>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredDeliveries}
            columns={columns}
            getRowId={row => row.id}
            loading={loading}
            checkboxSelection
            onRowSelectionModelChange={(ids) => setSelected(ids)}
            selectionModel={selected}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          />
        </div>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
      {/* View Delivery Dialog */}
      <Dialog open={!!viewDelivery} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle>Delivery Details</DialogTitle>
        <DialogContent>
          {viewDelivery && (
            <>
              <Typography>ID: {viewDelivery.id}</Typography>
              <Typography>User: {viewDelivery.user?.username}</Typography>
              <Typography>Porter: {viewDelivery.porter?.name}</Typography>
              <Typography>Status: {viewDelivery.status}</Typography>
              <Typography>Scheduled Time: {viewDelivery.scheduledTime}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography>Pickup: {viewDelivery.pickupLocation?.address}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon color="secondary" sx={{ mr: 1 }} />
                <Typography>Dropoff: {viewDelivery.deliveryLocation?.address}</Typography>
              </Box>
              <Typography>Payment: {viewDelivery.payment?.status}</Typography>
              {/* Order Tracking button */}
              <Button
                variant="outlined"
                color="info"
                sx={{ mt: 2 }}
                onClick={() => window.open(`/#/track/${viewDelivery.id}`, '_blank')}
                startIcon={<LocationSearchingIcon />}
              >
                Track Order
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={!!editDelivery} onClose={handleEditClose}>
        <DialogTitle>Edit Delivery</DialogTitle>
        <DialogContent>
          <TextField label="ID" value={editDelivery?.id || ''} fullWidth margin="normal" disabled />
          <TextField label="User" value={editDelivery?.user?.username || ''} fullWidth margin="normal" disabled />
          <TextField select label="Porter" value={editDelivery?.porter?.id || ''} onChange={e => setEditDelivery({ ...editDelivery, porter: porters.find(p => p.id === e.target.value) })} fullWidth margin="normal">
            <MenuItem value="">Unassigned</MenuItem>
            {porters.map(porter => <MenuItem key={porter.id} value={porter.id}>{porter.name}</MenuItem>)}
          </TextField>
          <TextField select label="Status" value={editDelivery?.status || ''} onChange={e => setEditDelivery({ ...editDelivery, status: e.target.value })} fullWidth margin="normal">
            {statuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </TextField>
          <TextField label="Scheduled Time" value={editDelivery?.scheduledTime || ''} fullWidth margin="normal" disabled />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={!!deleteDelivery} onClose={handleDeleteClose}>
        <DialogTitle>Delete Delivery</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete delivery #{deleteDelivery?.id}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={failedDeletions.length > 0} onClose={() => setFailedDeletions([])}>
        <DialogTitle>Failed to Delete Deliveries</DialogTitle>
        <DialogContent dividers>
          {failedDeletions.map(({ id, error }) => (
            <Box key={id} sx={{ mb: 1 }}>
              <Typography><strong>ID:</strong> {id}</Typography>
              <Typography color="error" variant="body2">{error}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFailedDeletions([])}>Close</Button>
        </DialogActions>
      </Dialog>



    </Container>


  );
};

export default AdminDeliveries; 