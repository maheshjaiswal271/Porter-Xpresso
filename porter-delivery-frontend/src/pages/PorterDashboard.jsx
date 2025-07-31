import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Assignment as TaskIcon,
  History as HistoryIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import DashboardStats from '../components/DashboardStats';
import AvailableTasks from '../components/porter/AvailableTasks';
import ActiveDeliveries from '../components/porter/ActiveDeliveries';
import DeliveryHistory from '../components/porter/PorterDeliveryHistory';
import PerformanceStats from '../components/porter/PerformanceStats';
import porterService from '../services/porterService';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PorterDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [overviewDeliveries, setOverviewDeliveries] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchOverviewDeliveries();
  }, []);

  const fetchStats = async () => {
    try {
       const token = localStorage.getItem('token');
      const stats = await porterService.getPorterStats();
      // Process the data for charts
      const data = {
        totalDeliveries: stats.totalDeliveries,
        completedDeliveries: stats.completedDeliveries,
        pendingDeliveries: stats.pendingDeliveries,
        cancelledDeliveries: stats.cancelledDeliveries,
        packageTypes: Object.entries(stats.packageTypeDistribution).map(([type, count]) => ({
          type,
          count
        })),
        deliveriesByDate: stats.deliveriesByDate
      };
      setStatsData(data);
      setLoading(false);
    } catch (err)
     {
        setError(err.message || 'Failed to fetch statistics');
        setLoading(false);
      }
  };

  const fetchOverviewDeliveries = async () => {
    try {
      const deliveries = await porterService.getAvailableDeliveries();
      setOverviewDeliveries(deliveries);
      setOverviewLoading(false);
    } catch (err) {
      setOverviewError(err.message || 'Failed to fetch available deliveries');
      setOverviewLoading(false);
    }
  };

  const handleAcceptOverviewDelivery = async (delivery) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await porterService.acceptDeliveryWithLocation(delivery.id, latitude, longitude);
            fetchOverviewDeliveries();
            fetchStats();
          } catch (err) {
            alert(err.message || 'Failed to accept delivery');
          }
        },
        (error) => {
          alert('Location access is required to accept delivery.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Porter Dashboard
      </Typography>

      {/* Dashboard Stats */}
      {tabValue === 0 && statsData && (
        <Box sx={{ mb: 4 }}>
          <DashboardStats data={statsData} />
        </Box>
      )}

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="porter dashboard tabs"
        >
          <Tab icon={<StatsIcon />} label="Overview" />
          <Tab icon={<TaskIcon />} label="Available Tasks" />
          <Tab icon={<DeliveryIcon />} label="Active Deliveries" />
          <Tab icon={<HistoryIcon />} label="Delivery History" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Today's Summary
              </Typography>
              <PerformanceStats />
            </Paper>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Deliveries
            </Typography>
            {overviewLoading ? (
              <Typography>Loading...</Typography>
            ) : overviewError ? (
              <Typography color="error">{overviewError}</Typography>
            ) : overviewDeliveries.length === 0 ? (
              <Typography>No available deliveries at the moment</Typography>
            ) : (
              <List>
                {overviewDeliveries.map((delivery) => (
                  <ListItem key={delivery.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {delivery.packageType} - {delivery.weight}kg
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="body2">
                              From: {delivery.pickupLocation.address}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="body2">
                              To: {delivery.deliveryLocation.address}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption">
                              Scheduled: {delivery.scheduledTime && new Date(delivery.scheduledTime).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" sx={{ ml: 2 }}>
                              ₹{delivery.amount}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAcceptOverviewDelivery(delivery)}
                      >
                        Accept
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AvailableTasks />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ActiveDeliveries />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <DeliveryHistory />
      </TabPanel>
    </Container>
  );
};

export default PorterDashboard; 