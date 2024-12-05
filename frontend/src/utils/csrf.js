import axios from 'axios';

// Function to fetch CSRF token
export const fetchCSRFToken = async () => {
    try {
        const response = await axios.get('/api/csrf-token', { withCredentials: true });
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

// Axios interceptor to add CSRF token to requests
export const setupCSRFToken = async () => {
    try {
        const token = await fetchCSRFToken();
        axios.defaults.headers.common['X-CSRF-Token'] = token;
    } catch (error) {
        console.error('Error setting up CSRF token:', error);
    }
};

// Function to refresh CSRF token
export const refreshCSRFToken = async () => {
    try {
        await setupCSRFToken();
    } catch (error) {
        console.error('Error refreshing CSRF token:', error);
    }
};
