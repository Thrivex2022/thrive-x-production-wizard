import React from 'react';
import { Chip } from '@mui/material';

/**
 * Reusable status chip component with color mapping
 * @param {object} props Component props
 * @param {string} props.status Status value
 * @param {object} props.size Chip size ('small' or 'medium')
 * @param {object} props.variant Chip variant ('filled' or 'outlined')
 * @param {boolean} props.label Use custom label instead of capitalized status
 */
const StatusChip = ({ 
  status, 
  size = 'small', 
  variant = 'filled',
  label = null,
  ...props 
}) => {
  // Map status values to colors
  const getStatusColor = (status) => {
    const statusMap = {
      // Order statuses
      'pending': 'warning',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'error',
      
      // Activity statuses
      'paused': 'error',
      
      // Operator statuses
      'active': 'success',
      'inactive': 'error',
      
      // Priority levels
      'low': 'info',
      'medium': 'primary',
      'high': 'warning',
      'urgent': 'error',
      
      // Default
      'default': 'default',
    };
    
    return statusMap[status.toLowerCase()] || 'default';
  };
  
  // Format label with capitalization
  const getLabel = () => {
    if (label !== null) return label;
    
    if (!status) return '';
    
    // Handle specific formats (e.g., "in-progress" → "In Progress")
    if (status.includes('-')) {
      return status
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Simple capitalization
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Chip
      label={getLabel()}
      color={getStatusColor(status)}
      size={size}
      variant={variant}
      {...props}
    />
  );
};

export default StatusChip;
