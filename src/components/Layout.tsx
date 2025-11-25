import { Box } from '@mui/material';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <NavBar />
      <Box 
        component="main" 
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'background.default'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
