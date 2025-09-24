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
    const response = await api.post('/feedback/delete', { ids });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;
