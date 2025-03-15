import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  CircularProgress,
  Alert,
} from '@mui/material';

/**
 * Reusable confirmation dialog component
 * @param {object} props Component props
 * @param {boolean} props.open Dialog open state
 * @param {function} props.onClose Function to call when dialog is closed
 * @param {function} props.onConfirm Function to call when action is confirmed
 * @param {string} props.title Dialog title
 * @param {string|React.ReactNode} props.message Dialog message
 * @param {string} props.confirmText Text for confirm button
 * @param {string} props.cancelText Text for cancel button
 * @param {string} props.confirmColor Color for confirm button
 * @param {boolean} props.loading Show loading state
 * @param {string} props.error Error message to display
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  loading = false,
  error = null,
}) => {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {typeof message === 'string' ? (
          <Typography variant="body1">{message}</Typography>
        ) : (
          message
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          variant="contained"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
