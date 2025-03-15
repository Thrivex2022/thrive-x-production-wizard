import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Reusable page header component with breadcrumbs and action button
 * @param {object} props Component props
 * @param {string} props.title Page title
 * @param {Array} props.breadcrumbs Array of breadcrumb objects with text and link
 * @param {string} props.buttonText Text for action button (optional)
 * @param {function} props.buttonAction Function for button click (optional)
 * @param {string} props.buttonVariant Button variant (default: 'contained')
 * @param {string} props.buttonColor Button color (default: 'primary')
 * @param {React.ReactNode} props.buttonIcon Icon to display in button (optional)
 */
const PageHeader = ({
  title,
  breadcrumbs = [],
  buttonText,
  buttonAction,
  buttonVariant = 'contained',
  buttonColor = 'primary',
  buttonIcon,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography key={index} color="text.primary">
                {crumb.text}
              </Typography>
            ) : (
              <MuiLink
                key={index}
                component={RouterLink}
                to={crumb.link}
                underline="hover"
                color="inherit"
              >
                {crumb.text}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        
        {buttonText && buttonAction && (
          <Button
            variant={buttonVariant}
            color={buttonColor}
            onClick={buttonAction}
            startIcon={buttonIcon}
          >
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
