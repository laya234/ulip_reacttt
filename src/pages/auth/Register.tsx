import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, Security, ContactPhone } from '@mui/icons-material';
import { useAppDispatch } from '../../store';
import { authStart, authFailure } from '../../features/auth/authSlice';
import { authApi } from '../../api/auth_api';
import type { RegisterDto, UserRole } from '../../types/auth';
import { getErrorMessage } from '../../utils/errorHandler';

const roles: UserRole[] = ['Customer', 'Agent', 'Manager', 'Admin'];

const steps = ['Personal Info', 'Contact Details', 'Account Setup'];

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    panNumber: '',
    role: 'Customer',
  });

  const validateForm = () => {
    if (!formData.email.includes('@')) return 'Invalid email format';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) return 'Invalid PAN format';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    dispatch(authStart());
    
    try {
      const response = await authApi.register(formData);
      
      if (response.data.success === false) {
        setError(response.data.message || 'Registration failed');
        dispatch(authFailure(response.data.message || 'Registration failed'));
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      dispatch(authFailure(message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="PAN Number"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={handleChange('panNumber')}
                helperText="Enter your 10-digit PAN number"
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange('address')}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                select
                label="Role"
                value={formData.role}
                onChange={handleChange('role')}
                helperText="Select your role in the organization"
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                helperText="Minimum 6 characters"
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'text.primary'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.panNumber;
      case 1:
        return formData.phoneNumber && formData.address && formData.role;
      case 2:
        return formData.email && formData.password && formData.confirmPassword;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backgroundColor: 'background.paper',
            display: 'flex',
            minHeight: '700px'
          }}
        >
          {/* Hero Section */}
          <Box
            sx={{
              width: '40%',
              background: 'linear-gradient(135deg, #0d7377 0%, #1e3a5f 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              p: 3,
              position: 'relative'
            }}
          >
            <Box sx={{ textAlign: 'center', zIndex: 2 }}>
                  <PersonAdd sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    Join ULIP Portal
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    Start your journey with Unit Linked Insurance Plans
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Security sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Typography variant="body1">Secure Registration Process</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <ContactPhone sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Typography variant="body1">24/7 Customer Support</Typography>
                    </Box>
                  </Box>
            </Box>
          </Box>
          
          {/* Form Section */}
          <Box
            sx={{ 
              width: '60%',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              p: 4
            }}
          >
            <Box sx={{ maxWidth: 500, mx: 'auto', width: '100%' }}>

                
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Create Account
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Fill in your details to get started with ULIP Portal
                </Typography>
                
                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                <Box component="form" onSubmit={handleSubmit}>
                  {renderStepContent(activeStep)}
                  
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        '& .MuiAlert-message': { fontSize: '0.9rem' }
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !validateStep(activeStep)}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600
                        }}
                      >
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} color="inherit" />
                            Creating Account...
                          </Box>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!validateStep(activeStep)}
                        sx={{ px: 4 }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Button
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{ 
                          textTransform: 'none', 
                          p: 0, 
                          minWidth: 'auto',
                          fontWeight: 600,
                          color: '#1976d2',
                          '&:hover': {
                            color: '#1565c0',
                            backgroundColor: 'transparent'
                          }
                        }}
                      >
                        Sign in here
                      </Button>
                    </Typography>
                  </Box>
                </Box>
            </Box>
          </Box>
        </Paper>
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            Registration successful! Redirecting to login...
          </Alert>
        )}
      </Container>
    </Box>
  );
}
