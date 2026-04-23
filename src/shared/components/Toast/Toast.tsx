import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Typography } from '../Typography/Typography';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: (id: string) => void;
}

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)'
  },
  error: {
    icon: XCircle,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)'
  },
  warning: {
    icon: AlertCircle,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)'
  },
  info: {
    icon: Info,
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)'
  }
};

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: 'var(--surface)',
      border: `1px solid ${config.border}`,
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      minWidth: '320px',
      maxWidth: '450px',
      animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      position: 'relative',
      pointerEvents: 'auto',
      backdropFilter: 'blur(10px)',
      zIndex: 10000
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        backgroundColor: config.bg,
        color: config.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={20} />
      </div>

      <div style={{ flex: 1 }}>
        <Typography variant="body" style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
          {message}
        </Typography>
      </div>

      <button 
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '16px',
        right: '16px',
        height: '2px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: config.color,
          width: '100%',
          animation: 'progress 5s linear forwards'
        }} />
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};
