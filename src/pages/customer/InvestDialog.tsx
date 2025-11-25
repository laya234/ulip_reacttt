import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store';
import { invest, fundSwitch, requestApproval, clearApprovalState } from '../../features/customer/customerSlice';
import { fetchFunds } from '../../features/fund/fundSlice';

interface InvestDialogProps {
  open: boolean;
  policyId: number;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function InvestDialog({ open, policyId, onClose, onSuccess, onError }: InvestDialogProps) {
  const dispatch = useAppDispatch();
  const { lastInvestmentRequiresApproval, lastTransactionId } = useAppSelector((state) => state.customer);
  const { funds } = useAppSelector((state) => state.fund);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [investData, setInvestData] = useState({
    amount: '',
    fundId: '',
  });
  const [switchData, setSwitchData] = useState({
    fromFundId: '',
    toFundId: '',
    amount: '',
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchFunds());
    }
  }, [open, dispatch]);

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(invest({
        policyId,
        amount: parseFloat(investData.amount),
        fundId: parseInt(investData.fundId),
      })).unwrap();
      
      if (result.requiresApproval) {
        onSuccess('Investment submitted! Approval required - see banner below.');
      } else {
        onSuccess('Investment successful!');
        handleClose();
      }
    } catch (err: unknown) {
      console.error('Investment error:', err);
      onError((err as Error)?.message || 'Failed to process investment');
    } finally {
      setLoading(false);
    }
  };

  const handleFundSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Fund switch data:', {
      policyId,
      fromFundId: parseInt(switchData.fromFundId),
      toFundId: parseInt(switchData.toFundId),
      amount: parseFloat(switchData.amount),
      rawData: switchData
    });
    
    try {
      const result = await dispatch(fundSwitch({
        policyId,
        fromFundId: parseInt(switchData.fromFundId),
        toFundId: parseInt(switchData.toFundId),
        amount: parseFloat(switchData.amount),
      })).unwrap();
      
      console.log('Fund switch result:', result);
      onSuccess('Fund switch successful!');
      handleClose();
    } catch (err: unknown) {
      console.error('Fund switch error:', err);
      onError((err as Error)?.message || 'Failed to process fund switch');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestApproval = async () => {
    if (!lastTransactionId) return;
    
    setLoading(true);
    try {
      await dispatch(requestApproval(lastTransactionId)).unwrap();
      onSuccess('Approval request submitted successfully!');
      dispatch(clearApprovalState());
      handleClose();
    } catch (err: unknown) {
      console.error('Approval request error:', err);
      onError((err as Error)?.message || 'Failed to request approval');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setInvestData({ amount: '', fundId: '' });
      setSwitchData({ fromFundId: '', toFundId: '', amount: '' });
      setTabValue(0);
      dispatch(clearApprovalState());
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
PaperProps={{
        sx: {
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          '& .MuiDialogTitle-root': {
            backgroundColor: '#334155',
            color: '#f1f5f9',
            borderBottom: '1px solid #475569'
          },
          '& .MuiDialogContent-root': {
            backgroundColor: '#1e293b',
            color: '#e2e8f0'
          },
          '& .MuiDialogActions-root': {
            backgroundColor: '#334155',
            borderTop: '1px solid #475569'
          }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Investment Management</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {lastInvestmentRequiresApproval && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRequestApproval}
                disabled={loading}
              >
                Request Approval
              </Button>
            }
          >
            Your last investment requires manager approval. Click to request approval.
          </Alert>
        )}
        
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: '#94a3b8',
              fontWeight: 500,
              '&.Mui-selected': {
                color: '#60a5fa',
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#60a5fa'
            }
          }}
        >
          <Tab label="New Investment" />
          <Tab label="Fund Switch" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" id="invest-form" onSubmit={handleInvest} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Investment Amount"
              type="number"
              value={investData.amount}
              onChange={(e) => setInvestData({ ...investData, amount: e.target.value })}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              sx={{
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#334155',
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#60a5fa' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                },
                '& .MuiInputBase-input': { color: '#e2e8f0' }
              }}
            />
            
            <TextField
              select
              label="Select Fund"
              value={investData.fundId}
              onChange={(e) => setInvestData({ ...investData, fundId: e.target.value })}
              required
              fullWidth
              helperText="Choose fund for investment"
              sx={{
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#334155',
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#60a5fa' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                },
                '& .MuiInputBase-input': { color: '#e2e8f0' },
                '& .MuiFormHelperText-root': { color: '#94a3b8' }
              }}
            >
              {funds.map((fund) => (
                <MenuItem key={fund.fundId} value={fund.fundId.toString()}>
                  {fund.fundName} - NAV: ₹{fund.currentNAV}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box component="form" id="switch-form" onSubmit={handleFundSwitch} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="From Fund"
              value={switchData.fromFundId}
              onChange={(e) => setSwitchData({ ...switchData, fromFundId: e.target.value })}
              required
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#334155',
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#60a5fa' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                },
                '& .MuiInputBase-input': { color: '#e2e8f0' }
              }}
            >
              {funds.map((fund) => (
                <MenuItem key={fund.fundId} value={fund.fundId.toString()}>
                  {fund.fundName} - NAV: ₹{fund.currentNAV}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              select
              label="To Fund"
              value={switchData.toFundId}
              onChange={(e) => setSwitchData({ ...switchData, toFundId: e.target.value })}
              required
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#334155',
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#60a5fa' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                },
                '& .MuiInputBase-input': { color: '#e2e8f0' }
              }}
            >
              {funds.filter(fund => fund.fundId.toString() !== switchData.fromFundId).map((fund) => (
                <MenuItem key={fund.fundId} value={fund.fundId.toString()}>
                  {fund.fundName} - NAV: ₹{fund.currentNAV}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Amount to Switch"
              type="number"
              value={switchData.amount}
              onChange={(e) => setSwitchData({ ...switchData, amount: e.target.value })}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              sx={{
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#334155',
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#60a5fa' },
                  '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                },
                '& .MuiInputBase-input': { color: '#e2e8f0' }
              }}
            />
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ 
            color: '#94a3b8',
            '&:hover': { 
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              color: '#f1f5f9'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          form={tabValue === 0 ? 'invest-form' : 'switch-form'}
          variant="contained" 
          disabled={loading || (tabValue === 0 ? !investData.amount : !switchData.amount)}
        >
          {loading ? <CircularProgress size={20} /> : (tabValue === 0 ? 'Invest' : 'Switch Funds')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
