import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { AccountCircle, Edit, Person, Email, Phone, Home, Badge, CalendarToday } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchProfile, updateProfile } from '../../features/user/userSlice';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import type { UpdateProfileRequest } from '../../types/user';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.user);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleEditClick = () => {
    if (profile) {
      setEditData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
      });
      setEditDialog(true);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await dispatch(updateProfile(editData)).unwrap();
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setEditDialog(false);
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Failed to update profile';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return <Alert severity="info">No profile data found</Alert>;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Manager': return 'warning';
      case 'Agent': return 'info';
      case 'Customer': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <PageHeader 
        title="Profile" 
        icon={<AccountCircle />}
        subtitle="Manage your personal information and account settings"
      />
      
      {/* Profile Header Card */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 600
            }}
          >
            {profile.firstName[0]}{profile.lastName[0]}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip 
                label={profile.role} 
                color={getRoleColor(profile.role) as 'error' | 'warning' | 'info' | 'success' | 'default'}
                size="small"
                icon={<Badge />}
              />
              <Typography variant="body2" color="text.secondary">
                User ID: {profile.userId}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEditClick}
            sx={{ alignSelf: 'flex-start' }}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
      
      {/* Information Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.firstName} {profile.lastName}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Badge sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">PAN Number</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.panNumber}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Phone sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Contact Information
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.phoneNumber}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Home sx={{ color: 'text.secondary', fontSize: 20, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="First Name"
              value={editData.firstName}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
              required
            />
            <TextField
              label="Last Name"
              value={editData.lastName}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
              required
            />
            <TextField
              label="Phone Number"
              value={editData.phoneNumber}
              onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
              required
            />
            <TextField
              label="Address"
              multiline
              rows={3}
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained">Update Profile</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
