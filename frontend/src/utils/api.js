import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Health API calls
export const submitHealthForm = async (formData) => {
  const response = await api.post('/health/assessment', formData);
  return response.data;
};

export const getNutritionResults = async () => {
  const response = await api.get('/nutrition/results');
  return response.data;
};

export const getHealthHistory = async () => {
  const response = await api.get('/history/assessments');
  return response.data;
};

export const getMealPlan = async (preferences) => {
  const response = await api.post('/nutrition/meal-plan', preferences);
  return response.data;
};

export const getNutritionAnalysis = async (foodData) => {
  const response = await api.post('/nutrition/analyze', foodData);
  return response.data;
};

// Wolfram Alpha integration
export const getWolframNutrition = async (query) => {
  const response = await api.post('/wolfram/nutrition', { query });
  return response.data;
};

export const getHealthInsights = async (healthData) => {
  const response = await api.post('/wolfram/insights', healthData);
  return response.data;
};

export const generateCharts = async (data) => {
  const response = await api.post('/wolfram/charts', data);
  return response.data;
};

export default api;
