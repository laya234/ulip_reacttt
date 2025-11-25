export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  
  const err = error as { 
    response?: { 
      data?: { 
        message?: string;
        error?: string;
      } 
    };
    message?: string;
  };
  
  return err.response?.data?.message || 
         err.response?.data?.error || 
         err.message || 
         'An unexpected error occurred';
};
