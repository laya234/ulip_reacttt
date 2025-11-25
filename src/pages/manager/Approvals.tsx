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
  Visibility,
  CheckCircle,
  Cancel,
  Approval as ApprovalIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  fetchPendingApprovals,
  approveApproval,
  rejectApproval,
  clearError,
} from '../../features/manager/managerSlice';
import { type Approval } from '../../api/manager_api';
import PageHeader from '../../components/PageHeader';
import ApprovalDetailDialog from './ApprovalDetailDialog';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Approvals() {
  const dispatch = useAppDispatch();
  const { pending, loading, error } = useAppSelector((state) => state.manager);
  
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject';
    approval: Approval | null;
  }>({ open: false, type: 'approve', approval: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

  const handleViewDetails = (approval: Approval) => {
    setSelectedApproval(approval);
    setDetailDialog(true);
  };

  const handleQuickApprove = (approval: Approval) => {
    setConfirmDialog({ open: true, type: 'approve', approval });
  };

  const handleQuickReject = (approval: Approval) => {
    setConfirmDialog({ open: true, type: 'reject', approval });
  };

  const handleConfirmAction = async (comments?: string) => {
    if (!confirmDialog.approval) return;

    try {
      const approvalId = confirmDialog.approval.approvalId;
      if (!approvalId) throw new Error('No approval ID found');

      if (confirmDialog.type === 'approve') {
        await dispatch(approveApproval({
          id: approvalId,
          comments,
        })).unwrap();
        setSnackbar({
          open: true,
          message: 'Request approved successfully!',
          severity: 'success',
        });
      } else {
        await dispatch(rejectApproval({
          id: approvalId,
          comments: comments || '',
        })).unwrap();
        setSnackbar({
          open: true,
          message: 'Request rejected successfully!',
          severity: 'success',
        });
      }
    } catch (err: unknown) {
      setSnackbar({
        open: true,
        message: (err as Error)?.message || 'Action failed',
        severity: 'error',
      });
    }

    setConfirmDialog({ open: false, type: 'approve', approval: null });
  };

  const handleDetailApprove = async (approvalId: number, comments?: string) => {
    try {
      await dispatch(approveApproval({ id: approvalId, comments })).unwrap();
      setSnackbar({
        open: true,
        message: 'Request approved successfully!',
        severity: 'success',
      });
    } catch (err: unknown) {
      setSnackbar({
        open: true,
        message: (err as Error)?.message || 'Approval failed',
        severity: 'error',
      });
    }
  };

  const handleDetailReject = async (approvalId: number, comments: string) => {
    try {
      await dispatch(rejectApproval({ id: approvalId, comments })).unwrap();
      setSnackbar({
        open: true,
        message: 'Request rejected successfully!',
        severity: 'success',
      });
    } catch (err: unknown) {
      setSnackbar({
        open: true,
        message: (err as Error)?.message || 'Rejection failed',
        severity: 'error',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: (params) => `#${params.row.approvalId}`,
    },
    {
      field: 'requestType',
      headerName: 'Request Type',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" />
      ),
    },
    {
      field: 'requestedBy',
      headerName: 'Requested By',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.requestedByName || 'Unknown'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            User ID: {params.row.requestedBy}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600" sx={{ color: '#1976d2' }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'policyId',
      headerName: 'Policy ID',
      width: 100,
      renderCell: (params) => {
        const policyId = params.value || params.row.requestId;
        return policyId ? `#${policyId}` : '-';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'Pending'} 
          color={params.value === 'Approved' ? 'success' : params.value === 'Rejected' ? 'error' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 160,
      renderCell: (params) => formatDate(params.row.requestedAt),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleViewDetails(params.row)}
            title="View Details"
          >
            <Visibility />
          </IconButton>
          {params.row.status === 'Pending' && (
            <>
              <IconButton
                size="small"
                color="success"
                onClick={() => handleQuickApprove(params.row)}
                title="Approve"
              >
                <CheckCircle />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleQuickReject(params.row)}
                title="Reject"
              >
                <Cancel />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box p={3}>
      <PageHeader title="Pending Approvals" icon={<ApprovalIcon />} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="textSecondary">
          {pending.length} pending approval{pending.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={pending}
          columns={columns}
          getRowId={(row) => row.approvalId}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Box>

      <ApprovalDetailDialog
        open={detailDialog}
        approval={selectedApproval}
        onClose={() => {
          setDetailDialog(false);
          setSelectedApproval(null);
        }}
        onApprove={(_, comments) => selectedApproval && handleDetailApprove(selectedApproval.approvalId, comments)}
        onReject={(_, comments) => selectedApproval && handleDetailReject(selectedApproval.approvalId, comments)}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.type === 'approve' ? 'Approve Request' : 'Reject Request'}
        message={
          confirmDialog.approval
            ? confirmDialog.type === 'approve'
              ? `Are you sure you want to approve this ${confirmDialog.approval.requestType} request for ${formatCurrency(confirmDialog.approval.amount || 0)}?`
              : `Are you sure you want to reject this ${confirmDialog.approval.requestType} request? Please provide a reason.`
            : ''
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, type: 'approve', approval: null })}
        confirmText={confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
        requireComments={confirmDialog.type === 'reject'}
        commentsLabel={confirmDialog.type === 'approve' ? 'Comments (Optional)' : 'Rejection Reason'}
        severity={confirmDialog.type === 'approve' ? 'success' : 'error'}
      />

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
