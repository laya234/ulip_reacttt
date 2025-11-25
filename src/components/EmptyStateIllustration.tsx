import { Box, Typography, Paper } from '@mui/material';
import type { ReactNode } from 'react';


interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyStateIllustration({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Paper 
      sx={{ 
        p: 4, 
        textAlign: 'center',
        borderRadius: 2,
        background: 'linear-gradient(135deg, #1a1f2e 0%, #1e293b 100%)',
        border: '1px solid #334155'
      }}
    >
      <Box sx={{ mb: 2, color: '#64748b' }}>
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: '#e2e8f0'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: action ? 3 : 0,
          color: '#94a3b8',
          maxWidth: 400,
          mx: 'auto'
        }}
      >
        {description}
      </Typography>
      {action && (
        <Box>
          {action}
        </Box>
      )}
    </Paper>
  );
}
