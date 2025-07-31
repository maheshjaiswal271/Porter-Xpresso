import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import porterService from '../../services/porterService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <Paper sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Icon sx={{ mr: 1 }} color="primary" />
      <Typography variant="h6" component="div">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" component="div" gutterBottom>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

const PerformanceStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const porterStats = await porterService.getPorterStats();
      setStats(porterStats);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch performance stats');
      setLoading(false);
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

  if (!stats) {
    return <Alert severity="info">No performance data available</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12} md={3}>
        <StatCard
          icon={DeliveryIcon}
          title="Deliveries"
          value={stats.completedDeliveries}
          subtitle="Total completed"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          icon={MoneyIcon}
          title="Earnings"
          value={`₹${stats.totalEarnings.toFixed(2)}`}
          subtitle="Total earnings"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          icon={StarIcon}
          title="Rating"
          value={stats.averageRating.toFixed(1)}
          subtitle="Average rating"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          icon={TimerIcon}
          title="On-time Rate"
          value={`${(stats.onTimeRate * 100).toFixed(1)}%`}
          subtitle="Delivery punctuality"
        />
      </Grid>

      {/* Earnings Trend */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Earnings Trend
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.earningsByDay}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'PPP')}
                  formatter={(value) => [`₹${value}`, 'Earnings']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Delivery Type Distribution */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Delivery Types
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(stats.deliveriesByType).map(([name, value]) => ({
                    name,
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(stats.deliveriesByType).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} deliveries`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PerformanceStats; 