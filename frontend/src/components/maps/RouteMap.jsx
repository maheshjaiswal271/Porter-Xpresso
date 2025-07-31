import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Box, Typography, Paper, List, ListItem, ListItemText, Radio, TextField } from '@mui/material';

const RouteMap = ({ pickupLocation, deliveryLocation, onRouteCalculated, pricePerKm: initialPricePerKm = 20 }) => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [hasCalculatedRoute, setHasCalculatedRoute] = useState(false);
  const [pricePerKm, setPricePerKm] = useState(initialPricePerKm);

  useEffect(() => {
    setHasCalculatedRoute(false);
    setRoutes([]);
    setSelectedRouteIndex(0);
  }, [pickupLocation, deliveryLocation]);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('route-map', {
        attributionControl: false, 
      }).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
      }).addTo(map);
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !pickupLocation || !deliveryLocation || hasCalculatedRoute) {
      return;
    }

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(pickupLocation.lat, pickupLocation.lng),
        L.latLng(deliveryLocation.lat, deliveryLocation.lng)
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving'
      }),
      lineOptions: {
        styles: [
          { color: '#4CAF50', opacity: 0.8, weight: 8 }
        ],
        addWaypoints: false,
        missingRouteTolerance: 0
      },
      altLineOptions: {
        styles: [
          { color: '#2196F3', opacity: 0.4, weight: 6 }
        ]
      },
      routeWhileDragging: false,
      showAlternatives: true,
      fitSelectedRoutes: true,
      show: false
    });

    control.on('routeselected', (e) => {
      const routes = control.getRoutes();
      const selectedIndex = routes.indexOf(e.route);
      handleRouteSelect(selectedIndex);
    });

    control.on('routesfound', (e) => {
      const newRoutes = e.routes.map(route => ({
        distance: route.summary.totalDistance / 1000,
        duration: Math.round(route.summary.totalTime / 60),
        coordinates: route.coordinates
      }));

      setRoutes(newRoutes);
      setHasCalculatedRoute(true);
      onRouteCalculated(newRoutes, 0);

      const bounds = L.latLngBounds(
        [pickupLocation.lat, pickupLocation.lng],
        [deliveryLocation.lat, deliveryLocation.lng]
      ).pad(0.1);
      mapRef.current.fitBounds(bounds);

      const routingContainer = control.getContainer();
      const routeLayers = routingContainer.getElementsByClassName('leaflet-routing-alternatives-container')[0];
      if (routeLayers) {
        routeLayers.style.display = 'none';
      }
    });

    control.addTo(mapRef.current);
    routingControlRef.current = control;

  }, [pickupLocation, deliveryLocation, hasCalculatedRoute, onRouteCalculated, mapRef.current]);

  const handleRouteSelect = (index) => {
    setSelectedRouteIndex(index);
    if (routes && routes.length > index) {
      onRouteCalculated(routes, index);
    }
  };

  const calculatePrice = (distance) => {
    return distance * pricePerKm;
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Available Routes
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Price per km (₹)"
          type="number"
          value={pricePerKm}
          onChange={e => setPricePerKm(Number(e.target.value))}
          inputProps={{ min: 0, step: 1 }}
          size="small"
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          id="route-map"
          sx={{
            height: '400px',
            width: '70%',
            '& .leaflet-routing-alt': {
              display: 'none'
            }
          }}
        />
        <Box sx={{ width: '30%' }}>
          <List>
            {routes.map((route, index) => (
              <ListItem
                key={index}
                dense
                button
                onClick={() => handleRouteSelect(index)}
                sx={{
                  bgcolor: selectedRouteIndex === index ? 'action.selected' : 'transparent',
                  borderRadius: 1,
                  mb: 1,
                  border: selectedRouteIndex === index ? '2px solid #4CAF50' : 'none'
                }}
              >
                <Radio
                  checked={selectedRouteIndex === index}
                  onChange={() => handleRouteSelect(index)}
                />
                <ListItemText
                  primary={
                    <Typography color={selectedRouteIndex === index ? '#4CAF50' : 'inherit'}>
                      {`Route ${index + 1}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="div">
                        Distance: {route.distance.toFixed(2)} km
                      </Typography>
                      <Typography variant="body2" component="div">
                        Duration: {route.duration} mins
                      </Typography>
                      <Typography variant="body2" component="div" color="success.main">
                        Price: ₹{calculatePrice(route.distance).toFixed(2)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Paper>
  );
};

export default RouteMap; 