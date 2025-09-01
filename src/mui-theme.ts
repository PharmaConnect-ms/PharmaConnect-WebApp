import { createTheme } from '@mui/material/styles';
import { PharmaColors } from './theme';

// Create MUI theme with proper z-index configuration
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: PharmaColors.primary,
    },
    secondary: {
      main: PharmaColors.secondary,
    },
  },
  // Configure z-index to work properly with dialogs and modals
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 9998, // Lower than our dialog content
    snackbar: 1400,
    tooltip: 1500,
  },
  components: {
    // Ensure MUI components work properly in dialogs
    MuiPopover: {
      styleOverrides: {
        root: {
          zIndex: 10000,
        },
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          zIndex: 10000,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiSelect-paper': {
            zIndex: 10000,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          zIndex: 10000,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          zIndex: 9999,
        },
      },
    },
  },
});
