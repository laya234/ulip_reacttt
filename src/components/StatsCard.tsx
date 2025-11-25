import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

const Sparkline = ({ trend = 'neutral' }: { trend?: 'up' | 'down' | 'neutral' }) => {
  const paths = {
    up: 'M2,20 L8,15 L14,18 L20,8 L26,12 L32,4',
    down: 'M2,8 L8,12 L14,10 L20,18 L26,15 L32,22',
    neutral: 'M2,14 L8,16 L14,12 L20,15 L26,13 L32,14'
  };
  
  const colors = {
    up: '#22c55e',
    down: '#ef4444',
    neutral: '#6b7280'
  };

  return (
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
      <path
        d={paths[trend]}
        stroke={colors[trend]}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function StatsCard({ title, value, icon, color, trend, onClick }: StatsCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        background: 'linear-gradient(135deg, #1a1f2e 0%, #1e293b 100%)',
        border: '1px solid #334155',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
          borderColor: '#475569',
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              color="text.secondary" 
              gutterBottom 
              variant="body2"
              sx={{ 
                fontWeight: 500, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px', 
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 600, 
                color: '#e2e8f0', 
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sparkline trend={trend} />
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              color, 
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              border: `1px solid ${color}40`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
