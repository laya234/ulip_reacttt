import { Typography } from '@mui/material';

interface SeverityChipProps {
  severity: 'success' | 'warning' | 'error' | 'info' | 'default' | 'cancelled';
  label: string;
  size?: 'small' | 'medium';
}

const severityColors = {
  success: '#10b981',
  warning: '#f59e0b', 
  error: '#ef4444',
  info: '#3b82f6',
  default: '#64748b',
  cancelled: '#6b7280'
};

export default function SeverityChip({ severity, label, size = 'small' }: SeverityChipProps) {
  const color = severityColors[severity] || severityColors.default;
  
  return (
    <Typography
      variant={size === 'small' ? 'body2' : 'body1'}
      sx={{
        color: color,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem'
      }}
    >
      {label}
    </Typography>
  );
}
