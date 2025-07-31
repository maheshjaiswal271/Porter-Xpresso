import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #1976d2, #3f51b5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        px: 3
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Welcome to PORTER▸XPRESSO
        </Typography>
        <Typography variant="h5" align="center" sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
          Fast, reliable delivery service at your fingertips. Book your delivery, track your packages, and relax.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#3f51b5',
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Get Started
          </Button>

          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
