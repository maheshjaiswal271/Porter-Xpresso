import React, { useState, useCallback, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import { TextField, Box, Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import debounce from 'lodash/debounce';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzE5NzZkMiIgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Map event handler component
const MapEventHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          onLocationSelect({
            lat,
            lng,
            address: data.display_name
          });
        })
        .catch((error) => console.error('Reverse geocoding failed:', error));
    }
  });
  return null;
};

// Map view controller component
const MapViewController = ({ marker }) => {
  const map = useMap();

  useEffect(() => {
    if (marker) {
      map.setView([marker.lat, marker.lng], map.getZoom());
    }
  }, [marker, map]);

  return null;
};

const defaultCenter = { lat: 31.3260, lng: 75.5762 };

const LeafletLocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [marker, setMarker] = useState(initialLocation);
  const [address, setAddress] = useState(initialLocation?.address || '');

  const handleLocationUpdate = useCallback(
    (location) => {
      setMarker(location);
      setAddress(location.address);
      onLocationSelect(location);
    },
    [onLocationSelect]
  );

  const geocodeAddress = useCallback(
    debounce((inputAddress) => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          inputAddress
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            handleLocationUpdate({
              lat: parseFloat(lat),
              lng: parseFloat(lon),
              address: inputAddress
            });
          }
        })
        .catch((err) => console.error('Forward geocoding failed:', err));
    }, 600),
    [handleLocationUpdate]
  );

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    geocodeAddress(newAddress);
  };

  const mapCenter = marker
    ? [marker.lat, marker.lng]
    : [defaultCenter.lat, defaultCenter.lng];

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter an address or click on the map"
        />
      </Box>
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          key={mapCenter.join(',')}
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventHandler onLocationSelect={handleLocationUpdate} />
          <MapViewController marker={marker} />
          {marker && (
            <Marker position={[marker.lat, marker.lng]} icon={customIcon}>
              <Popup>{marker.address}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </Paper>
  );
};

export default LeafletLocationPicker;
