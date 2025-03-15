import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  People as OperatorIcon,
  Assignment as ActivityIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

// Chart component imports
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    products: { total: 0, items: [] },
    orders: { total: 0, pending: 0, inProgress: 0, completed: 0, items: [] },
    operators: { total: 0, items: [] },
    activities: { total: 0, pending: 0, inProgress: 0, completed: 0, items: [] },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch products count
        const productsRes = await axios.get('/api/products');
        
        // Fetch orders with stats
        const ordersRes = await axios.get('/api/orders');
        const orders = ordersRes.data;
        const orderStats = {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          inProgress: orders.filter(o => o.status === 'in-progress').length,
          completed: orders.filter(o => o.status === 'completed').length,
          items: orders.slice(0, 5), // Latest 5 orders
        };
        
        // Fetch operators
        const operatorsRes = await axios.get('/api/operators');
        
        // Fetch activities with stats
        const activitiesRes = await axios.get('/api/activities');
        const activities = activitiesRes.data;
        const activityStats = {
          total: activities.length,
          pending: activities.filter(a => a.status === 'pending').length,
          inProgress: activities.filter(a => a.status === 'in-progress').length,
          completed: activities.filter(a => a.status === 'completed').length,
          items: activities.slice(0, 5), // Latest 5 activities
        };
        
        setStats({
          products: { 
            total: productsRes.data.length,
            items: productsRes.data.slice(0, 5), // Latest 5 products
          },
          orders: orderStats,
          operators: { 
            total: operatorsRes.data.length,
            items: operatorsRes.data.slice(0, 5), // Latest 5 operators
          },
          activities: activityStats,
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const orderStatusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [stats.orders.pending, stats.orders.inProgress, stats.orders.completed],
        backgroundColor: ['#ffb74d', '#64b5f6', '#81c784'],
        hoverBackgroundColor: ['#ffa726', '#42a5f5', '#66bb6a'],
      },
    ],
  };

  const activityStatusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Activities by Status',
        data: [stats.activities.pending, stats.activities.inProgress, stats.activities.completed],
        backgroundColor: ['#ffb74d', '#64b5f6', '#81c784'],
      },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        flexDirection="column"
      >
        <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome, {user?.name}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 150,
              bgcolor: '#e3f2fd',
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <InventoryIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h6">Products</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stats.products.total}
            </Typography>
            <CardActions>
              <Button size="small" component={Link} to="/products">
                View All
              </Button>
            </CardActions>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 150,
              bgcolor: '#fff8e1',
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <OrderIcon color="warning" sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h6">Orders</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stats.orders.total}
            </Typography>
            <CardActions>
              <Button size="small" component={Link} to="/orders">
                View All
              </Button>
            </CardActions>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 150,
              bgcolor: '#f3e5f5',
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <OperatorIcon color="secondary" sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h6">Operators</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stats.operators.total}
            </Typography>
            <CardActions>
              <Button size="small" component={Link} to="/operators">
                View All
              </Button>
            </CardActions>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 150,
              bgcolor: '#e8f5e9',
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <ActivityIcon color="success" sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h6">Activities</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {stats.activities.total}
            </Typography>
            <CardActions>
              <Button size="small" component={Link} to="/activities">
                View All
              </Button>
            </CardActions>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Orders by Status
            </Typography>
            <Box height={300} display="flex" justifyContent="center">
              <Doughnut 
                data={orderStatusData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activities by Status
            </Typography>
            <Box height={300}>
              <Bar 
                data={activityStatusData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Items */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {stats.orders.items.length > 0 ? (
                  stats.orders.items.map((order) => (
                    <ListItem key={order._id} component={Link} to={`/orders/${order._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                      <ListItemText
                        primary={`${order.orderNumber}: ${order.customerName}`}
                        secondary={`Status: ${order.status} | Items: ${order.items.length}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No orders found.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {stats.activities.items.length > 0 ? (
                  stats.activities.items.map((activity) => (
                    <ListItem key={activity._id} component={Link} to={`/activities/${activity._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                      <ListItemText
                        primary={activity.activityCode}
                        secondary={`Status: ${activity.status} | Est. Hours: ${activity.estimatedHours}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No activities found.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
