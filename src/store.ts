import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './features/auth/authSlice';
import agentReducer from './features/agent/agentSlice';
import managerReducer from './features/manager/managerSlice';
import adminReducer from './features/admin/adminSlice';
import fundReducer from './features/fund/fundSlice';
import userReducer from './features/user/userSlice';
import customerReducer from './features/customer/customerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agent: agentReducer,
    manager: managerReducer,
    admin: adminReducer,
    fund: fundReducer,
    user: userReducer,
    customer: customerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
