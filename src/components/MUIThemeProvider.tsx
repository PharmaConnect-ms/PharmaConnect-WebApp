'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { muiTheme } from '../mui-theme';

interface MUIThemeProviderProps {
  children: React.ReactNode;
}

const MUIThemeProvider: React.FC<MUIThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MUIThemeProvider;
