import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Send,
  Warning

} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  fetchOverduePremiums,
  sendPremiumReminder,
  clearError,
} from '../../features/manager/managerSlice';
import PageHeader from '../../components/PageHeader';

export default function OverduePremiums() {
  const dispatch = useAppDispatch();
  const { overdue, loading, error } = useAppSelector((state) => state.manager);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    dispatch(fetchOverduePremiums());
  }, [dispatch]);

  const handleSendReminder = async (policyId: number) => {
    try {
      await dispatch(sendPremiumReminder(policyId)).unwrap();
      setSnackbar({
        open: true,
        message: 'Reminder sent successfully!',
        severity: 'success',
      });
    } catch (err: unknown) {
      setSnackbar({
        open: true,
        message: (err as Error)?.message || 'Failed to send reminder',
        severity: 'error',
      });
    }
  };



  const formatCurrency = (amount: number | undefined | null) => {
    return `₹${(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSeverityColor = (daysOverdue: number) => {
    if (daysOverdue >= 30) return 'error';
    if (daysOverdue >= 15) return 'warning';
    return 'info';
  };

  const columns: GridColDef[] = [
    {
      field: 'policyId',
      headerName: 'Policy ID',
      width: 100,
      renderCell: (params) => `#${params.value}`,
    },
    {
      field: 'policyNumber',
      headerName: 'Policy Number',
      width: 150,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'customerName',
      headerName: 'Policy Holder',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'premiumAmount',
      headerName: 'Due Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium" color="error">
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 120,
      renderCell: (params) => {
        return params.value ? formatDate(params.value) : '-';
      },
    },
    {
      field: 'daysOverdue',
      headerName: 'Days Overdue',
      width: 130,
      renderCell: (params) => {
        const dueDate = new Date(params.row.dueDate);
        const now = new Date();
        const days = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
        return (
          <Chip
            label={`${days} days`}
            color={getSeverityColor(days)}
            size="small"
            icon={<Warning />}
          />
        );
      },
    },
    {
      field: 'contact',
      headerName: 'Contact',
      width: 200,
      renderCell: () => (
        <Typography variant="body2" color="textSecondary">
          Contact info not available
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleSendReminder(params.row.policyId)}
          title="Send Reminder"
        >
          <Send />
        </IconButton>
      ),
    },
  ];


  const criticalOverdue = overdue.filter(item => item.daysOverdue >= 30).length;

  return (
    <Box p={3}>
      <PageHeader title="Overdue Premiums" icon={<Warning />} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, color: 'error.contrastText' }}>
          <Typography variant="h4" fontWeight="bold">
            {overdue.length}
          </Typography>
          <Typography variant="body2">
            Total Overdue Policies
          </Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, color: 'warning.contrastText' }}>
          <Typography variant="h4" fontWeight="bold">
            {criticalOverdue}
          </Typography>
          <Typography variant="body2">
            Critical (30+ days)
          </Typography>
        </Box>

      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          {overdue.length} overdue premium{overdue.length !== 1 ? 's' : ''}
        </Typography>

      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={overdue}
          columns={columns}
          getRowId={(row) => row.policyId}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: {
              sortModel: [{ field: 'daysOverdue', sort: 'desc' }],
            },
          }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Box>

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
