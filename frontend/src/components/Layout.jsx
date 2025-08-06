import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LocalShipping as LocalShippingIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  SupervisorAccount as AdminIcon,
  Assignment as TaskIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import logo from '../images/logo.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LightMode, DarkMode } from '@mui/icons-material';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggtheme = useMemo(() => 
    createTheme({
      palette: {
        mode
      },
    }), [mode]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen((prev) => !prev);
  };

  const getMenuItems = (role) => {
    const baseItems = [
      { text: 'Profile', icon: <PersonIcon />, path: '/#/profile' }
    ];

    switch (role) {
      case 'ADMIN':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/#/admin' },
          { text: 'Manage Users', icon: <AdminIcon />, path: '/#/admin/users' },
          { text: 'All Deliveries', icon: <LocalShippingIcon />, path: '/#/admin/deliveries' },
          ...baseItems
        ];
      case 'PORTER':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/#/porter' },
          { text: 'My Tasks', icon: <TaskIcon />, path: '/#/porter/tasks' },
          { text: 'Delivery History', icon: <HistoryIcon />, path: '/#/porter/history' },
          ...baseItems
        ];
      case 'USER':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/#/user' },
          { text: 'Book Delivery', icon: <LocalShippingIcon />, path: '/#/BookDelivery' },
          { text: 'Delivery History', icon: <HistoryIcon />, path: '/#/history' },
          ...baseItems
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems(user?.role);

  const handleNavigation = (path) => {
    // Remove the /#/ prefix since navigate will handle it
    const cleanPath = path.replace('/#/', '/');
    navigate(cleanPath);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/#/');
  };

  const drawer = (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 0 }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{ width: '133px', height: '111px', objectFit: 'cover', mx: 'auto', display: 'block' }}
        />
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      {/* <Toolbar /> */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path.replace('/#/', '/')}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={toggtheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
            ml: { sm: desktopOpen ? `${drawerWidth}px` : 0 }
          }}
        >
          <Toolbar>
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="toggle drawer"
                edge="start"
                onClick={handleDesktopDrawerToggle}
                sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              PORTER▸XPRESSO - {user?.role} Dashboard
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 2 }}>
              {mode === 'light' ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {user?.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout} sx={{ display: { xs: 'none', sm: 'block' } }}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="navigation menu"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: desktopOpen ? drawerWidth : 0,
                transition: 'width 0.3s',
                overflowX: 'hidden',
              },
            }}
            open={desktopOpen}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
            mt: 8
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 