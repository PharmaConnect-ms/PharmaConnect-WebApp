"use client";

import React from 'react';
import { FormControl, FormLabel, FormHelperText, Box } from '@mui/material';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  sx?: object;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  sx = {}
}) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <FormControl fullWidth error={!!error}>
        <FormLabel 
          sx={{ 
            mb: 1, 
            fontWeight: 600, 
            fontSize: '0.875rem',
            color: 'text.primary',
            '&.Mui-error': {
              color: 'error.main'
            }
          }}
        >
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </FormLabel>
        {children}
        {error && (
          <FormHelperText sx={{ fontSize: '0.75rem', mt: 0.5 }}>
            {error}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default FormField;
