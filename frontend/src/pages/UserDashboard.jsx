import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeliveryCard from '../components/DeliveryCard';
import DashboardStats from '../components/DashboardStats';
import { DeliveryEventContext } from '../contexts/DeliveryEventContext';
import API from '../config';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { reloadFlag } = useContext(DeliveryEventContext);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [unpaidDeliveries, setUnpaidDeliveries] = useState([]);

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
    fetchUnpaidDeliveries();
  }, []);

  useEffect(() => {
    // Refetch user deliveries when reloadFlag changes
    fetchDeliveries();
  }, [reloadFlag]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/deliveries/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Process the data for charts
      const data = {
        totalDeliveries: response.data.totalDeliveries,
        completedDeliveries: response.data.completedDeliveries,
        pendingDeliveries: response.data.pendingDeliveries,
        cancelledDeliveries: response.data.cancelledDeliveries,
        packageTypes: Object.entries(response.data.packageTypeDistribution).map(([type, count]) => ({
          type,
          count
        })),
        deliveriesByDate: response.data.deliveriesByDate.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          completed: item.completed,
          pending: item.pending,
          cancelled: item.cancelled
        }))
      };

      setStatsData(data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/deliveries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filter active deliveries (PENDING, ACCEPTED, PICKED_UP, IN_TRANSIT)
      const active = response.data.filter(delivery =>
        ['PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(delivery.status)
      );

      // Filter completed or cancelled deliveries
      const history = response.data.filter(delivery =>
        ['DELIVERED', 'CANCELLED'].includes(delivery.status)
      );

      setActiveDeliveries(active);
      setDeliveryHistory(history);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelivery = async (delivery) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/deliveries/${delivery.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchDeliveries();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel delivery');
    }
  };

  const handleDeleteDelivery = async (delivery) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API}/deliveries/${delivery.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchDeliveries();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete delivery');
    }
  };

  const fetchUnpaidDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/deliveries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter for delivered, COD, not paid
      const unpaid = response.data.filter(delivery =>
        delivery.status === 'DELIVERED' &&
        delivery.paymentStatus === 'PENDING'
      );
      setUnpaidDeliveries(unpaid);
    } catch (err) {
      // ignore
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {unpaidDeliveries.length > 0 && (
        <Box sx={{ mb: 2, p: 2, background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 2, color: '#856404', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            You have unpaid deliveries! Total due: ₹{unpaidDeliveries.reduce((sum, d) => sum + (d.amount || 0), 0)}
          </Typography>
          <Button variant="contained" color="warning" onClick={() => window.location.href = '/history?filter=PAYMENT_PENDING'}>
            Pay Now
          </Button>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Deliveries
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/BookDelivery')}
        >
          Book New Delivery
        </Button>
      </Box>

      {/* Statistics Section */}
      {statsData && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Delivery Statistics
          </Typography>
          <DashboardStats data={statsData} />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Active Deliveries */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 600,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Active Deliveries
            </Typography>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : activeDeliveries.length === 0 ? (
              <Typography>No active deliveries</Typography>
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
                {activeDeliveries.map(delivery => (
                  <DeliveryCard
                    key={delivery.id}
                    delivery={delivery}
                    onCancelDelivery={handleCancelDelivery}
                    onDeleteDelivery={handleDeleteDelivery}
                    isActiveDelivery={true}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Delivery History */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 600,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Delivery History
            </Typography>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : deliveryHistory.length === 0 ? (
              <Typography>No delivery history</Typography>
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
                {deliveryHistory.map(delivery => (
                  <DeliveryCard
                    key={delivery.id}
                    delivery={delivery}
                    onCancelDelivery={handleCancelDelivery}
                    onDeleteDelivery={handleDeleteDelivery}
                    isActiveDelivery={false}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard; 