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
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Form states
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    category: '',
    estimatedProductionTime: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products');
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dialog handlers
  const handleOpenDialog = (product) => {
    setProductToDelete(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProductToDelete(null);
    setDeleteError(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`/api/products/${productToDelete._id}`);
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      handleCloseDialog();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Error deleting product');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Form handlers
  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setNewProduct({
      code: '',
      name: '',
      description: '',
      price: '',
      category: '',
      estimatedProductionTime: '',
    });
    setFormErrors({});
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
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
    if (!newProduct.code) errors.code = 'Product code is required';
    if (!newProduct.name) errors.name = 'Product name is required';
    if (!newProduct.description) errors.description = 'Description is required';
    if (!newProduct.price) {
      errors.price = 'Price is required';
    } else if (isNaN(newProduct.price) || Number(newProduct.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!newProduct.category) errors.category = 'Category is required';
    if (!newProduct.estimatedProductionTime) {
      errors.estimatedProductionTime = 'Production time is required';
    } else if (
      isNaN(newProduct.estimatedProductionTime) || 
      Number(newProduct.estimatedProductionTime) <= 0
    ) {
      errors.estimatedProductionTime = 'Production time must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setFormSubmitting(true);
      const res = await axios.post('/api/products', {
        ...newProduct,
        price: Number(newProduct.price),
        estimatedProductionTime: Number(newProduct.estimatedProductionTime),
      });
      
      setProducts([...products, res.data]);
      handleCloseForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating product');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Product
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center">
          <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          <TextField
            variant="outlined"
            size="small"
            label="Search Products"
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

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Est. Production Time (h)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.estimatedProductionTime}</TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/products/${product._id}`}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleOpenDialog(product)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            
            <TextField
              margin="dense"
              label="Product Code"
              name="code"
              fullWidth
              variant="outlined"
              value={newProduct.code}
              onChange={handleFormChange}
              error={!!formErrors.code}
              helperText={formErrors.code}
              required
            />
            
            <TextField
              margin="dense"
              label="Product Name"
              name="name"
              fullWidth
              variant="outlined"
              value={newProduct.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              variant="outlined"
              value={newProduct.description}
              onChange={handleFormChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              multiline
              rows={3}
              required
            />
            
            <TextField
              margin="dense"
              label="Price"
              name="price"
              fullWidth
              variant="outlined"
              value={newProduct.price}
              onChange={handleFormChange}
              error={!!formErrors.price}
              helperText={formErrors.price}
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
            
            <TextField
              margin="dense"
              label="Category"
              name="category"
              fullWidth
              variant="outlined"
              value={newProduct.category}
              onChange={handleFormChange}
              error={!!formErrors.category}
              helperText={formErrors.category}
              required
            />
            
            <TextField
              margin="dense"
              label="Estimated Production Time (hours)"
              name="estimatedProductionTime"
              fullWidth
              variant="outlined"
              value={newProduct.estimatedProductionTime}
              onChange={handleFormChange}
              error={!!formErrors.estimatedProductionTime}
              helperText={formErrors.estimatedProductionTime}
              type="number"
              inputProps={{ min: 0, step: 0.5 }}
              required
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
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
