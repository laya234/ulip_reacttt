import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchDashboardData } from '../features/agent/agentSlice';

export interface AgentDashboardData {
  pipeline: unknown[];
  conversionRate: number;
  commission: number;
  loading: boolean;
  error: string | null;
}

export const useAgentDashboard = () => {
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const isLoading = useRef(false);
  
  const { leads = [], conversionRate = 0, totalCommission = 0, loading, error } = useAppSelector(state => state.agent);

  const fetchAgentDashboardData = useCallback(async () => {
    if (isLoading.current || hasFetched.current) {
      return;
    }
    
    try {
      isLoading.current = true;
      hasFetched.current = true;
      
      await dispatch(fetchDashboardData()).unwrap();
    } catch (err) {
      console.error('Agent dashboard data fetch error:', err);
      hasFetched.current = false;
    } finally {
      isLoading.current = false;
    }
  }, [dispatch]);

  return {
    data: {
      pipeline: leads || [],
      conversionRate: conversionRate || 0,
      commission: totalCommission || 0,
      loading,
      error
    } as AgentDashboardData,
    fetchAgentDashboardData,
    loading,
    error
  };
};

export default useAgentDashboard;
