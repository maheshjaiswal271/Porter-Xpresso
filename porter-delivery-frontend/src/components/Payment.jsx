import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import API from '../config';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = ({ amount, onPaymentSuccess, onPaymentError, deliveryId }) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (paymentMethod === 'cod') {
      onPaymentSuccess('COD_' + Date.now());
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await axios.post(`${API}/payments/create-order`, {
        amount,
        deliveryId,
        currency: 'INR'
      });

      const options = {
        key: orderResponse.data.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: orderResponse.data.companyName,
        description: 'Delivery Payment',
        order_id: orderResponse.data.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              `${API}/payments/verify`,
              {},
              {
                headers: {
                  'X-Razorpay-Payment-ID': response.razorpay_payment_id,
                  'X-Razorpay-Order-ID': response.razorpay_order_id,
                  'X-Razorpay-Signature': response.razorpay_signature
                }
              }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              onPaymentSuccess(response.razorpay_payment_id);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Payment verification failed';
            toast.error(errorMessage);
            onPaymentError(errorMessage);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || ''
        },
        theme: {
          color: '#1976d2'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to initiate payment';
      toast.error(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Amount to Pay: ₹{amount.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        sx={{ mb: 3 }}
      >
        <FormControlLabel value="razorpay" control={<Radio />} label="Pay Online (Credit/Debit Card, UPI, etc.)" />
        <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
      </RadioGroup>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handlePayment}
          disabled={loading}
          sx={{ minWidth: 200 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Pay ₹${amount.toFixed(2)}`
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default Payment; 