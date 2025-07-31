import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { DeliveryEventContext } from '../contexts/DeliveryEventContext';
import { isConnected } from '../services/websocketService';

const WebSocketTest = () => {
  const { reloadFlag } = useContext(DeliveryEventContext);
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const checkConnection = () => {
      const connected = isConnected();
      setConnectionStatus(connected ? 'Connected' : 'Disconnected');
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (reloadFlag !== undefined) {
      setLastUpdate(new Date().toLocaleTimeString());
      console.log('🔄 WebSocket update received at:', new Date().toLocaleTimeString());
    }
  }, [reloadFlag]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        WebSocket Status
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip 
          label={connectionStatus} 
          color={connectionStatus === 'Connected' ? 'success' : 'error'}
          size="small"
        />
        {lastUpdate && (
          <Typography variant="body2" color="text.secondary">
            Last update: {lastUpdate}
          </Typography>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        reloadFlag: {reloadFlag ? 'true' : 'false'}
      </Typography>
    </Paper>
  );
};

export default WebSocketTest; 