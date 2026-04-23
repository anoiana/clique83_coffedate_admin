import React from 'react';
import { Typography } from '../Typography/Typography';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(9, 9, 11, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(255, 215, 0, 0.1)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spinLoader 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        marginBottom: '24px'
      }} />
      <style>{`
        @keyframes spinLoader { 
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <Typography variant="caption" style={{ color: 'var(--primary)', letterSpacing: '0.2em', fontWeight: 600 }}>
        {message || 'PREPARING YOUR EXPERIENCE'}
      </Typography>
    </div>
  );
};
