import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      main: string;
      light: string;
      dark: string;
    };
  }

  interface PaletteOptions {
    accent?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e3a5f',
      light: '#2d5a87',
      dark: '#0f1f2f',
    },
    secondary: {
      main: '#0d7377',
      light: '#4a9b9f',
      dark: '#064d50',
    },
    accent: {
      main: '#f4a261',
      light: '#f7b885',
      dark: '#e8944a',
    },
    background: {
      default: '#0a0e13',
      paper: '#1a1f2e',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#5a6c7d',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1f2e',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: 12,
          transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            borderColor: '#475569',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1f2e',
          border: '1px solid #334155',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        },
        elevation2: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
        },
        elevation3: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 120ms ease',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#0f172a',
            borderRadius: 8,
            transition: 'all 120ms ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#475569',
            },
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0d7377',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0d7377',
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94a3b8',
            '&.Mui-focused': {
              color: '#0d7377',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1f2e',
          borderBottom: '1px solid #334155',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          color: '#94a3b8',
          '&:hover': {
            backgroundColor: 'rgba(13, 115, 119, 0.1)',
            color: '#e2e8f0',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(13, 115, 119, 0.15)',
            borderLeft: '3px solid #0d7377',
            color: '#e2e8f0',
            '&:hover': {
              backgroundColor: 'rgba(13, 115, 119, 0.2)',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fcd34d',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#93c5fd',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#1a1f2e',
            color: '#e2e8f0',
            border: '1px solid #334155',
          },
        },
      },
    },
  },
});
