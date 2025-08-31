"use client";

import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';

interface SubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  fullWidth?: boolean;
  sx?: object;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  disabled = false,
  loadingText = "Processing...",
  children,
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  sx = {},
  type = 'submit',
  onClick
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={onClick}
      sx={{
        py: 1.5,
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '1rem',
        ...sx
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} color="inherit" />
          {loadingText}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
