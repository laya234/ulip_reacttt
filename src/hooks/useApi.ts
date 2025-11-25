import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchPendingProposals, fetchMyPolicies } from '../features/customer/customerSlice';
import { fetchFunds } from '../features/fund/fundSlice';

export interface DashboardData {
  policies: unknown[];
  pendingProposals: unknown[];
  funds: unknown[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  const isLoading = useRef(false);
  const hasFetched = useRef(false);
  
  const { policies = [], pendingProposals = [], loading: customerLoading, error: customerError } = useAppSelector(state => state.customer);
  const { funds = [], loading: fundLoading, error: fundError } = useAppSelector(state => state.fund);
  
  const loading = customerLoading || fundLoading;
  const error = customerError || fundError;

  const fetchDashboardData = useCallback(async () => {
    if (isLoading.current || hasFetched.current) {
      return;
    }
    
    try {
      isLoading.current = true;
      hasFetched.current = true;
      
      await Promise.all([
        dispatch(fetchPendingProposals()).unwrap(),
        dispatch(fetchMyPolicies()).unwrap(),
        dispatch(fetchFunds()).unwrap()
      ]);
      
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      hasFetched.current = false;
    } finally {
      isLoading.current = false;
    }
  }, [dispatch]);

  return {
    data: {
      policies: policies || [],
      pendingProposals: pendingProposals || [],
      funds: funds || [],
      loading,
      error
    } as DashboardData,
    fetchDashboardData,
    loading,
    error,
    refetch: () => {
      hasFetched.current = false;
      fetchDashboardData();
    }
  };
};

export default useDashboardData;
