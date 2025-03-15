import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  CheckCircle as CompleteIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Status update dialog
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [actualHours, setActualHours] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, operatorsRes] = await Promise.all([
        axios.get('/api/activities'),
        axios.get('/api/operators')
      ]);
      setActivities(activitiesRes.data);
      setOperators(operatorsRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Filter activities based on search term and status filter
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      (activity.activityCode && activity.activityCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Update status dialog handlers
  const handleOpenStatusDialog = (activity, initialStatus) => {
    setSelectedActivity(activity);
    setNewStatus(initialStatus || activity.status);
    setActualHours(activity.actualHours?.toString() || '');
    setOpenStatusDialog(true);
    setUpdateError(null);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedActivity(null);
    setNewStatus('');
    setActualHours('');
    setUpdateError(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedActivity || !newStatus) return;

    try {
      setUpdateLoading(true);
      
      // Include actual hours only if completing the activity
      const payload = { 
        status: newStatus 
      };
      
      if (newStatus === 'completed' && actualHours) {
        payload.actualHours = Number(actualHours);
      }
      
      const res = await axios.put(`/api/activities/${selectedActivity._id}/status`, payload);
      
      // Update the activity in the list
      setActivities(
        activities.map((activity) =>
          activity._id === selectedActivity._id ? res.data : activity
        )
      );
      
      handleCloseStatusDialog();
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Error updating activity status');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Get status chip color
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'paused':
        return 'error';
      default:
        return 'default';
    }
  };

  // Find operator name by ID
  const getOperatorName = (operatorId) => {
    const operator = operators.find((op) => op._id === operatorId);
    return operator ? operator.name : 'Unassigned';
  };

  // Format date or show placeholder
  const formatDate = (date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
  };

  // Calculate progress percentage
  const calculateProgress = (activity) => {
    if (activity.status === 'completed') return 100;
    if (activity.status === 'pending') return 0;
    
    // For in-progress, calculate based on actual vs estimated hours
    if (activity.actualHours && activity.estimatedHours) {
      const percentage = (activity.actualHours / activity.estimatedHours) * 100;
      return Math.min(percentage, 99); // Cap at 99% until completed
    }
    
    // Default for in-progress without hours
    return 50;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Activities</Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            <TextField
              variant="outlined"
              size="small"
              label="Search Activities"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Box>
          
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Activities Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Planned Dates</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Hours (Est / Act)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No activities found.
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.activityCode}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>
                    {activity.assignedTo ? getOperatorName(activity.assignedTo) : 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Start: {formatDate(activity.plannedStartDate)}
                    </Typography>
                    <Typography variant="body2">
                      End: {formatDate(activity.plannedEndDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      color={getStatusChipColor(activity.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {activity.estimatedHours} / {activity.actualHours || '-'}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row">
                      <IconButton
                        component={Link}
                        to={`/activities/${activity._id}`}
                        color="primary"
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                      
                      {/* Status update buttons */}
                      {activity.status === 'pending' && (
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => handleOpenStatusDialog(activity, 'in-progress')}
                          title="Start Activity"
                        >
                          <StartIcon />
                        </IconButton>
                      )}
                      
                      {activity.status === 'in-progress' && (
                        <>
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => handleOpenStatusDialog(activity, 'paused')}
                            title="Pause Activity"
                          >
                            <PauseIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleOpenStatusDialog(activity, 'completed')}
                            title="Complete Activity"
                          >
                            <CompleteIcon />
                          </IconButton>
                        </>
                      )}
                      
                      {activity.status === 'paused' && (
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => handleOpenStatusDialog(activity, 'in-progress')}
                          title="Resume Activity"
                        >
                          <StartIcon />
                        </IconButton>
                      )}
                      
                      {activity.status === 'completed' && (
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenStatusDialog(activity, '')}
                          title="Log Hours"
                        >
                          <TimeIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Status Update Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>
          Update Activity Status
        </DialogTitle>
        <DialogContent>
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Activity: {selectedActivity?.activityCode}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Description: {selectedActivity?.description}
            </Typography>
            
            {newStatus !== selectedActivity?.status && (
              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                Changing status from <Chip size="small" label={selectedActivity?.status} /> to{' '}
                <Chip 
                  size="small" 
                  label={newStatus} 
                  color={getStatusChipColor(newStatus)} 
                />
              </Typography>
            )}
            
            {/* Show hours input only when completing or already completed */}
            {(newStatus === 'completed' || selectedActivity?.status === 'completed') && (
              <TextField
                margin="dense"
                label="Actual Hours Spent"
                type="number"
                fullWidth
                variant="outlined"
                value={actualHours}
                onChange={(e) => setActualHours(e.target.value)}
                inputProps={{ min: 0, step: 0.5 }}
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            color="primary"
            disabled={updateLoading || (newStatus === selectedActivity?.status && actualHours === selectedActivity?.actualHours?.toString())}
            startIcon={updateLoading ? <CircularProgress size={20} /> : null}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Activities;
