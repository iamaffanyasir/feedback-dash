import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllFeedbacks = async () => {
  try {
    const response = await api.get('/feedback/all');
    return response.data.data || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getFeedbackById = async (id) => {
  try {
    const response = await api.get(`/feedback/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const deleteFeedbacks = async (ids) => {
  try {
    // Log the request URL and data for debugging
    console.log(`Deleting feedbacks with URL: ${API_BASE_URL}/feedback/delete`);
    console.log('Delete payload:', { ids });
    
    // Add a direct endpoint if the /feedback/delete fails
    let response;
    try {
      // Try the regular endpoint
      response = await api.post('/feedback/delete', { ids });
    } catch (error) {
      console.log('First attempt failed, trying alternative endpoint...');
      // If that fails, try a direct endpoint
      response = await api.post('/deleteFeedbacks', { ids });
    }
    
    // Log successful response
    console.log('Delete operation successful:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Add more detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    }
    
    throw error;
  }
};

export default api;