import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import axios from 'axios';
import DeliveryCard from '../components/DeliveryCard';
import WebSocketTest from '../components/WebSocketTest';
import { DeliveryEventContext } from '../contexts/DeliveryEventContext';
import AdminUsers from './AdminUsers';
import API from '../config';

const AdminDashboard = () => {

  const { reloadFlag } = useContext(DeliveryEventContext);
  const [recentDeliveries,setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [pendingPorters, setPendingPorters] = useState([]);
  const [porterLoading, setPorterLoading] = useState(true);
  const [porterError, setPorterError] = useState('');

  useEffect(() =>{
      fetchAdminDashboardData();
  },[]);

  useEffect(() => {
    if (reloadFlag !== undefined) {
      fetchAdminDashboardData();
    }
  }, [reloadFlag]);

  const fetchAdminDashboardData = async () => {
    setLoading(true);
    setPorterLoading(true);
    try {
      await Promise.all([
        fetchRecentDeliveries(),
        fetchStatistics(),
        fetchPendingPorters()
      ]);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
      setPorterLoading(false);
    }
  };

const fetchRecentDeliveries = async () => {
  try
  {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API}/admin/deliveries/recent`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setRecentDeliveries(response.data);

  }catch(err){
    setError(err.response?.data?.message || 'Failed to fetch recent deliveries');
  }
}

const fetchStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API}/admin/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStats(response.data);
  } catch (err) {
    setError('Failed to fetch statistics');
  }
};

const fetchPendingPorters = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API}/admin/porters/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPendingPorters(response.data);
  } catch (err) {
    setPorterError('Failed to fetch pending porters');
  }
};

const handleApprovePorter = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`${API}/admin/porters/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPendingPorters();
    fetchStatistics();
  } catch (err) {
    setPorterError('Failed to approve porter');
  }
};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {false && <WebSocketTest />}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              mb: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Deliveries
            </Typography>
         {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : recentDeliveries.length === 0 ? (
              <Typography>No recent deliveries</Typography>
            ) : (
              <Box
                sx={{
                  overflowY: 'auto',
                  flexGrow: 1,
                  pr: 1,
                  mt: 1,
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#aaa',
                    borderRadius: '4px',
                  },
                }}
              >
                {recentDeliveries.map(delivery => (
                  <DeliveryCard
                    key={delivery.id}
                    delivery={delivery}
                  />
                ))}
              </Box>
            )}
          </Paper>
          <Paper sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              mb: 2
            }}>
            <Typography variant="h6" gutterBottom>
              Pending Porter Approvals
            </Typography>
            {porterLoading ? (
              <Typography>Loading...</Typography>
            ) : porterError ? (
              <Typography color="error">{porterError}</Typography>
            ) : pendingPorters.length === 0 ? (
              <Typography>No pending porters</Typography>
            ) : (
              <Box
              sx={{
                overflowY: 'auto',
                 flexGrow: 1,
                  pr: 1,
                  mt: 1,
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#aaa',
                    borderRadius: '4px',
                  },
              }}
              >
                {pendingPorters.map(porter => (
                  <Box key={porter.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ flex: 1 }}>{porter.name} ({porter.email})</Typography>
                    <Button variant="contained" color="primary" onClick={() => handleApprovePorter(porter.id)}>
                      Approve
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : stats ? (
              <>
                <Typography>Total Users: {stats.totalUsers}</Typography>
                <Typography>Total Porters: {stats.totalPorters}</Typography>
                <Typography>Total Deliveries: {stats.totalDeliveries}</Typography>
                <Typography>Total Revenue: ₹{stats.totalRevenue}</Typography>
                <Typography>Active: {stats.activeDeliveries}</Typography>
                <Typography>Completed: {stats.completedDeliveries}</Typography>
                <Typography>Cancelled: {stats.cancelledDeliveries}</Typography>
              </>
            ) : null}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <AdminUsers />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 