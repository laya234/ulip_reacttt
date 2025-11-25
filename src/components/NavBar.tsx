import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
  Chip,
} from '@mui/material';
import { AccountCircle, Dashboard, Assessment, AdminPanelSettings, Logout, Person, MoreVert } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store';
import { logout } from '../features/auth/authSlice';

import type { UserRole } from '../types/auth';

const roleMenus: Record<UserRole, Array<{ label: string; path: string; icon: React.ReactNode }>> = {
  Customer: [
    { label: 'Dashboard', path: '/customer/dashboard', icon: <Dashboard /> },
    { label: 'My Policies', path: '/customer/policies', icon: <Assessment /> },
    { label: 'Pending Proposals', path: '/customer/proposals', icon: <AdminPanelSettings /> },
  ],
  Agent: [
    { label: 'Dashboard', path: '/agent/dashboard', icon: <Dashboard /> },
    { label: 'Pipeline', path: '/agent/pipeline', icon: <Assessment /> },
    { label: 'Documents', path: '/agent/documents', icon: <AdminPanelSettings /> },
  ],
  Manager: [
    { label: 'Dashboard', path: '/manager/dashboard', icon: <Dashboard /> },
    { label: 'Approvals', path: '/manager/approvals', icon: <Assessment /> },
    { label: 'Overdue Premiums', path: '/manager/overdue', icon: <AdminPanelSettings /> },
  ],
  Admin: [
    { label: 'Funds', path: '/admin/funds', icon: <AdminPanelSettings /> },
    { label: 'Users', path: '/admin/users', icon: <AccountCircle /> },
  ],
};

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const menuItems = user ? roleMenus[user.role] || [] : [];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>

        
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.3rem',
              boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            U
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
                lineHeight: 1
              }}
            >
              ULIP Portal
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#94a3b8',
                display: { xs: 'none', md: 'block' },
                fontSize: '0.7rem',
                fontWeight: 500
              }}
            >
              Investment Management
            </Typography>
          </Box>
        </Box>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {menuItems.slice(0, 3).map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: '#e2e8f0',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      color: '#60a5fa',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            
            {/* Mobile Navigation Menu */}
            <IconButton
              onClick={handleMobileMenu}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                color: '#e2e8f0',
                '&:hover': {
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  color: '#60a5fa'
                }
              }}
            >
              <MoreVert />
            </IconButton>
            
            {/* Role Badge */}
            <Chip 
              label={user.role} 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                color: '#60a5fa',
                fontWeight: 600,
                border: '1px solid rgba(96, 165, 250, 0.2)',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': {
                  backgroundColor: 'rgba(96, 165, 250, 0.1)'
                }
              }} 
            />
            
            {/* User Menu */}
            <IconButton
              onClick={handleMenu}
              sx={{ 
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 12px rgba(96, 165, 250, 0.2)'
                }}
              >
                {user.firstName[0]}{user.lastName[0]}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 220,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)'
                }
              }}
            >
              <MenuItem disabled sx={{ opacity: 1, py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {user.firstName[0]}{user.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              
              <MenuItem 
                onClick={() => { navigate('/profile'); handleClose(); }}
                sx={{ 
                  gap: 1.5,
                  color: '#e2e8f0',
                  '&:hover': {
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    color: '#60a5fa'
                  }
                }}
              >
                <Person fontSize="small" />
                Profile
              </MenuItem>
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  gap: 1.5, 
                  color: '#ef4444',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444'
                  }
                }}
              >
                <Logout fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
            
            {/* Mobile Menu */}
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)'
                }
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleMobileMenuClose();
                  }}
                  sx={{
                    gap: 1.5,
                    color: '#e2e8f0',
                    '&:hover': {
                      backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      color: '#60a5fa'
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
