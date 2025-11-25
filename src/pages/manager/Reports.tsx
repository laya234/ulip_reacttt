import { useEffect, useState } from 'react';
import {
  Box,
  Alert,
} from '@mui/material';
import { Assessment } from '@mui/icons-material';
import { managerApi, type Approval } from '../../api/manager_api';
import PageHeader from '../../components/PageHeader';
import StatsCard from '../../components/StatsCard';
import Loader from '../../components/Loader';

interface ReportStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalAmount: number;
}

export default function Reports() {

  const [stats, setStats] = useState<ReportStats>({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await managerApi.getPendingApprovals();
      const allApprovals = response.data;
      
      setStats({
        totalPending: allApprovals.filter((a: Approval) => a.status === 'Pending').length,
        totalApproved: allApprovals.filter((a: Approval) => a.status === 'Approved').length,
        totalRejected: allApprovals.filter((a: Approval) => a.status === 'Rejected').length,
        totalAmount: allApprovals.reduce((sum: number, a: Approval) => sum + (a.amount || 0), 0),
      });
    } catch {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading reports..." />;

  return (
    <Box p={3}>
      <PageHeader title="Reports & Analytics" icon={<Assessment />} />
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        <StatsCard
          title="Pending Approvals"
          value={stats.totalPending}
          color="#ed6c02"
          icon={<Assessment />}
        />
        <StatsCard
          title="Approved Requests"
          value={stats.totalApproved}
          color="#2e7d32"
          icon={<Assessment />}
        />
        <StatsCard
          title="Rejected Requests"
          value={stats.totalRejected}
          color="#d32f2f"
          icon={<Assessment />}
        />
        <StatsCard
          title="Total Amount"
          value={`₹${stats.totalAmount.toLocaleString()}`}
          color="#1976d2"
          icon={<Assessment />}
        />
      </Box>
    </Box>
  );
}
