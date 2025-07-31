import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocalShipping as AvailableIcon,
  DirectionsRun as ActiveIcon
} from '@mui/icons-material';
import AvailableTasks from './AvailableTasks';
import ActiveDeliveries from './ActiveDeliveries';
import { DeliveryEventContext } from '../../contexts/DeliveryEventContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `task-tab-${index}`,
    'aria-controls': `task-tabpanel-${index}`,
  };
}

const MyTasks = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { reloadFlag } = useContext(DeliveryEventContext);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ p: 2 }}>
            My Tasks
          </Typography>
          <Divider />
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="task management tabs"
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: isMobile ? '0.8rem' : '1rem',
              },
            }}
          >
            <Tab
              icon={<AvailableIcon />}
              label="Available Tasks"
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              icon={<ActiveIcon />}
              label="Active Deliveries"
              iconPosition="start"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <AvailableTasks onTaskAccepted={() => setSelectedTab(1)} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <ActiveDeliveries />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default MyTasks; 