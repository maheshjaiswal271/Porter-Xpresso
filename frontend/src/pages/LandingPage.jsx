import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { 
  LocalShipping, 
  LocationOn, 
  Security, 
  Speed,
  ArrowForward,
  PlayArrow,
  ExpandMore,
  Star,
  People,
  TrendingUp,
  CheckCircle,
  Phone,
  Email,
  WhatsApp,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';
import logo from '../images/logo.png';

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Fast Delivery',
      description: 'Lightning-fast delivery across the city with real-time tracking'
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Live Tracking',
      description: 'Track your package in real-time with our advanced GPS system'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Secure & Safe',
      description: 'Your packages are handled with utmost care and security'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Instant Booking',
      description: 'Book your delivery in seconds with our streamlined process'
    }
  ];

  const testimonials = [
    {
      name: 'Mahesh Jaiswal',
      role: 'Business Owner',
      avatar: 'S',
      rating: 5,
      text: 'Porter▸Xpresso has revolutionized our delivery process. Fast, reliable, and professional service every time!'
    },
    {
      name: 'Devang Chawala',
      role: 'E-commerce Manager',
      avatar: 'M',
      rating: 5,
      text: 'The real-time tracking feature is incredible. Our customers love knowing exactly where their packages are.'
    },
    {
      name: 'Arshit Mahajan',
      role: 'Online Seller',
      avatar: 'E',
      rating: 5,
      text: 'Best delivery service I\'ve ever used. Quick, safe, and the customer support is outstanding!'
    }
  ];

  const statistics = [
    { number: '50K+', label: 'Happy Customers', icon: <People /> },
    { number: '99.9%', label: 'Delivery Success', icon: <CheckCircle /> },
    { number: '15min', label: 'Average Delivery', icon: <Speed /> },
    { number: '24/7', label: 'Customer Support', icon: <Phone /> }
  ];

  const services = [
    {
      title: 'Same Day Delivery',
      description: 'Get your packages delivered within hours, not days',
      price: 'From $9.99',
      features: ['Real-time tracking', 'Insurance included', 'Professional handling']
    },
    {
      title: 'Express Delivery',
      description: 'Lightning-fast delivery for urgent packages',
      price: 'From $14.99',
      features: ['2-hour delivery', 'Priority handling', 'Dedicated courier']
    },
    {
      title: 'Scheduled Delivery',
      description: 'Choose your preferred delivery time',
      price: 'From $7.99',
      features: ['Flexible timing', 'Advance booking', 'Reliable service']
    }
  ];

  const faqs = [
    {
      question: 'How fast is your delivery service?',
      answer: 'We offer same-day delivery for orders placed before 2 PM, and express delivery within 2 hours for urgent packages.'
    },
    {
      question: 'Do you provide real-time tracking?',
      answer: 'Yes! Our advanced GPS system provides real-time tracking so you always know where your package is.'
    },
    {
      question: 'What areas do you serve?',
      answer: 'We currently serve all major cities and surrounding areas. Check our coverage map for specific locations.'
    },
    {
      question: 'Is my package insured?',
      answer: 'All packages are automatically insured up to $500. Additional coverage is available for high-value items.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-start' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                {/* Logo */}
                <Box
                  sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <img 
                    src={logo} 
                    alt="Porter Logo" 
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      borderRadius: '50%',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    PORTER▸XPRESSO
                  </Typography>
                </Box>

                <Typography 
                  variant="h2" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    color: 'white',
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Fast & Reliable
                  <br />
                  <span style={{ color: '#ffd700' }}>Delivery Service</span>
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    maxWidth: 500,
                    mb: 4,
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.6
                  }}
                >
                  Experience lightning-fast delivery with real-time tracking. 
                  Your packages are in safe hands with our professional team.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: '#ffd700',
                      color: '#333',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      boxShadow: '0 8px 25px rgba(255,215,0,0.3)',
                      '&:hover': {
                        bgcolor: '#ffed4e',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(255,215,0,0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>

                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 500,
                    height: 400,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.1)'
                  }}
                >
                  <img 
                    src={logo} 
                    alt="Porter Delivery" 
                    style={{ 
                      width: '200px', 
                      height: '200px',
                      borderRadius: '50%',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {statistics.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2, color: '#1976d2' }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h3" 
                      component="div"
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1976d2',
                        mb: 1
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: 'text.primary'
            }}
          >
            Why Choose Porter▸Xpresso?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: 'text.primary'
            }}
          >
            Our Delivery Services
          </Typography>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: '20px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    }
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}
                    >
                      {service.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      {service.description}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      component="div"
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1976d2',
                        mb: 3
                      }}
                    >
                      {service.price}
                    </Typography>
                    <Box>
                      {service.features.map((feature, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CheckCircle sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: 'text.primary'
            }}
          >
            What Our Customers Say
          </Typography>

          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Card
              sx={{
                p: 4,
                borderRadius: '20px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} sx={{ color: '#ffd700', fontSize: 24 }} />
                  ))}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    color: 'text.primary'
                  }}
                >
                  "{testimonials[currentTestimonial].text}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: '#1976d2',
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    {testimonials[currentTestimonial].avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {testimonials[currentTestimonial].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonials[currentTestimonial].role}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: 'text.primary'
            }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Get in Touch
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Have questions? We're here to help! Contact our support team for any inquiries about our delivery services.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: '#1976d2' }} />
                  <Typography>+91 6239674164</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: '#1976d2' }} />
                  <Typography>support@porterxpresso.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WhatsApp sx={{ color: '#1976d2' }} />
                  <Typography>WhatsApp Support</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        bgcolor: '#1976d2',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#1565c0',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 8, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Join thousands of satisfied customers who trust Porter▸Xpresso for their delivery needs
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: '#ffd700',
                color: '#333',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '50px',
                boxShadow: '0 8px 25px rgba(255,215,0,0.3)',
                '&:hover': {
                  bgcolor: '#ffed4e',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(255,215,0,0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
