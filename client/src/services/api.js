import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login page
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API services
const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};

const productService = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  updateOrder: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

const operatorService = {
  getOperators: async () => {
    const response = await api.get('/operators');
    return response.data;
  },
  getOperatorById: async (id) => {
    const response = await api.get(`/operators/${id}`);
    return response.data;
  },
  getOperatorWorkload: async (id) => {
    const response = await api.get(`/operators/${id}/workload`);
    return response.data;
  },
  createOperator: async (operatorData) => {
    const response = await api.post('/operators', operatorData);
    return response.data;
  },
  updateOperator: async (id, operatorData) => {
    const response = await api.put(`/operators/${id}`, operatorData);
    return response.data;
  },
  deleteOperator: async (id) => {
    const response = await api.delete(`/operators/${id}`);
    return response.data;
  },
};

const activityService = {
  getActivities: async () => {
    const response = await api.get('/activities');
    return response.data;
  },
  getActivityById: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },
  getActivitiesByOrder: async (orderId) => {
    const response = await api.get(`/activities/order/${orderId}`);
    return response.data;
  },
  getActivitiesByOperator: async (operatorId) => {
    const response = await api.get(`/activities/operator/${operatorId}`);
    return response.data;
  },
  assignActivity: async (id, operatorId, plannedDates) => {
    const response = await api.put(`/activities/${id}/assign`, {
      operatorId,
      ...plannedDates,
    });
    return response.data;
  },
  updateActivityStatus: async (id, statusData) => {
    const response = await api.put(`/activities/${id}/status`, statusData);
    return response.data;
  },
  updateActivity: async (id, activityData) => {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },
};

export {
  api,
  authService,
  productService,
  orderService,
  operatorService,
  activityService,
};
