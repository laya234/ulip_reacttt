import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function PageHeader({ title, icon, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => (
            crumb.href ? (
              <Link 
                key={index} 
                color="inherit" 
                href={crumb.href}
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {crumb.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && (
          <Box 
            sx={{ 
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        )}
        <Box>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
