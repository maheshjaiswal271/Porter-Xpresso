import axios from 'axios';
import API from '../config';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const handleError = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Unknown error');
};

const porterService = {
    // Get porter profile information
    getPorterProfile: async () => {
        try {
            const response = await axios.get(`${API}/porter/profile`, getAuthHeader());
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Get available deliveries that can be accepted
    getAvailableDeliveries: async () => {
        try {
            const response = await axios.get(`${API}/porter/available-deliveries`, getAuthHeader());
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Accept a delivery
    acceptDelivery: async (deliveryId) => {
        try {
            const response = await axios.put(
                `${API}/porter/deliveries/${deliveryId}/accept`,
                {},
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Accept a delivery with location
    acceptDeliveryWithLocation: async (deliveryId, latitude, longitude) => {
        try {
            const response = await axios.post(
                `${API}/deliveries/${deliveryId}/status`,
                { status: 'ACCEPTED', latitude, longitude },
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Update delivery status
    updateDeliveryStatus: async (deliveryId, status) => {
        try {
            const response = await axios.put(
                `${API}/porter/deliveries/${deliveryId}/status`,
                { status },
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Update delivery status with location
    updateDeliveryStatusWithLocation: async (deliveryId, status, latitude, longitude) => {
        try {
            const response = await axios.post(
                `${API}/deliveries/${deliveryId}/status`,
                { status, latitude, longitude },
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Get porter's active deliveries
    getActiveDeliveries: async () => {
        try {
            const response = await axios.get(`${API}/porter/active-deliveries`, getAuthHeader());
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Get porter's delivery history
    getDeliveryHistory: async () => {
        try {
            const response = await axios.get(`${API}/porter/delivery-history`, getAuthHeader());
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    // Get porter's performance stats
    getPorterStats: async () => {
        try {
            const response = await axios.get(`${API}/porter/stats`, getAuthHeader());
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }
};

export default porterService; 