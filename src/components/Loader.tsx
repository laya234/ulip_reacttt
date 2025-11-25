import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loader({ message = 'Loading...', fullScreen = false }: LoaderProps) {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? '100vh' : '400px',
        backgroundColor: fullScreen ? 'background.default' : 'transparent',
        gap: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ color: 'primary.main' }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0d7377 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem'
          }}
        >
          U
        </Box>
      </Box>
      
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {message}
      </Typography>
    </Box>
  );
}
