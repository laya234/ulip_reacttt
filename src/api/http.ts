import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../features/auth/authSlice';

const pendingRequests = new Map<string, { promise: Promise<unknown>, timestamp: number }>();
const DEDUP_TIMEOUT = 1000; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Duplicate request cancelled' || error.CANCEL) {
      console.log('Duplicate request cancelled, ignoring...');
      return Promise.resolve({ data: [] });
    }
    
    if (error.response?.status === 403 && error.config?.url?.includes('generate-statement')) {
      return Promise.resolve({
        status: 200,
        data: { 
          success: false, 
          message: error.response?.data?.message || 'Access denied for statement generation'
        }
      });
    }
    
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const cleanExpiredRequests = () => {
  const now = Date.now();
  for (const [key, value] of pendingRequests.entries()) {
    if (now - value.timestamp > DEDUP_TIMEOUT) {
      pendingRequests.delete(key);
    }
  }
};

const originalGet = api.get;
api.get = function<T = unknown, R = AxiosResponse<T>>(url: string, config: AxiosRequestConfig = {}) {
  cleanExpiredRequests();
  
  const requestKey = `GET_${url}_${JSON.stringify(config.params || {})}`;
  const existing = pendingRequests.get(requestKey);
  
  if (existing && (Date.now() - existing.timestamp < DEDUP_TIMEOUT)) {
    return existing.promise as Promise<R>;
  }
  
  const promise = originalGet.call(this, url, config) as Promise<R>;
  pendingRequests.set(requestKey, { promise, timestamp: Date.now() });
  
  promise.finally(() => {
    setTimeout(() => pendingRequests.delete(requestKey), 100);
  });
  
  return promise;
};

export { api };
export default api;
