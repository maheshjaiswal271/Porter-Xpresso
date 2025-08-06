import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_API || 'http://localhost:8080/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  return request;
});

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 