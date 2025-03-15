import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const Operators = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New operator form
  const [openForm, setOpenForm] = useState(false);
  const [newOperator, setNewOperator] = useState({
    code: '',
    name: '',
    role: '',
    skills: [],
    contactNumber: '',
    email: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Available roles and skills for selection
  const availableRoles = ['Production Manager', 'Technician', 'Assembler', 'Quality Control', 'Logistics'];
  const availableSkills = ['Woodworking', 'Metalworking', 'Electronics', 'Programming', 'Welding', 'Painting', 'Quality Inspection', 'Packaging'];

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/operators');
      setOperators(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching operators');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter operators based on search term
  const filteredOperators = operators.filter((operator) =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handling
  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setNewOperator({
      code: '',
      name: '',
      role: '',
      skills: [],
      contactNumber: '',
      email: '',
      notes: '',
    });
    setFormErrors({});
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewOperator({
      ...newOperator,
      [name]: value,
    });
    
    // Clear specific field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newOperator.code) errors.code = 'Operator code is required';
    if (!newOperator.name) errors.name = 'Name is required';
    if (!newOperator.role) errors.role = 'Role is required';
    if (newOperator.email && !/\S+@\S+\.\S+/.test(newOperator.email)) {
      errors.email = 'Please enter a valid email';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setFormSubmitting(true);
      const res = await axios.post('/api/operators', newOperator);
      
      setOperators([...operators, res.data]);
      handleCloseForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating operator');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Operators</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Operator
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center">
          <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          <TextField
            variant="outlined"
            size="small"
            label="Search Operators"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Operators Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Operator</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
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
            ) : filteredOperators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No operators found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOperators.map((operator) => (
                <TableRow key={operator._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {getInitials(operator.name)}
                      </Avatar>
                      {operator.name}
                    </Box>
                  </TableCell>
                  <TableCell>{operator.code}</TableCell>
                  <TableCell>{operator.role}</TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {operator.skills && operator.skills.length > 0
                        ? operator.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          ))
                        : 'No skills specified'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {operator.contactNumber || operator.email ? (
                      <Box>
                        {operator.contactNumber && (
                          <Typography variant="body2">
                            {operator.contactNumber}
                          </Typography>
                        )}
                        {operator.email && (
                          <Typography variant="body2" color="text.secondary">
                            {operator.email}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      'No contact info'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={operator.isActive ? 'Active' : 'Inactive'}
                      color={operator.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/operators/${operator._id}`}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/operators/${operator._id}/workload`}
                      color="info"
                      size="small"
                    >
                      <PersonIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Operator Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Operator</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            
            <TextField
              margin="dense"
              label="Operator Code"
              name="code"
              fullWidth
              variant="outlined"
              value={newOperator.code}
              onChange={handleFormChange}
              error={!!formErrors.code}
              helperText={formErrors.code}
              required
            />
            
            <TextField
              margin="dense"
              label="Full Name"
              name="name"
              fullWidth
              variant="outlined"
              value={newOperator.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            
            <FormControl 
              fullWidth 
              margin="dense" 
              error={!!formErrors.role}
              required
            >
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={newOperator.role}
                label="Role"
                onChange={handleFormChange}
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="skills-label">Skills</InputLabel>
              <Select
                labelId="skills-label"
                name="skills"
                multiple
                value={newOperator.skills}
                label="Skills"
                onChange={handleFormChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availableSkills.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="dense"
              label="Contact Number"
              name="contactNumber"
              fullWidth
              variant="outlined"
              value={newOperator.contactNumber}
              onChange={handleFormChange}
            />
            
            <TextField
              margin="dense"
              label="Email"
              name="email"
              fullWidth
              variant="outlined"
              value={newOperator.email}
              onChange={handleFormChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              type="email"
            />
            
            <TextField
              margin="dense"
              label="Notes"
              name="notes"
              fullWidth
              variant="outlined"
              value={newOperator.notes}
              onChange={handleFormChange}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} disabled={formSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitForm}
            color="primary"
            disabled={formSubmitting}
            startIcon={formSubmitting ? <CircularProgress size={20} /> : null}
          >
            Add Operator
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Operators;
