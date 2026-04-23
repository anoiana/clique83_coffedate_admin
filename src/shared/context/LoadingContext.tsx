import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';

interface LoadingContextProps {
  showLoader: (msg?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextProps>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
});

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoader = useCallback((msg = 'PREPARING YOUR EXPERIENCE') => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
      <LoadingOverlay isVisible={isLoading} message={message} />
    </LoadingContext.Provider>
  );
};
