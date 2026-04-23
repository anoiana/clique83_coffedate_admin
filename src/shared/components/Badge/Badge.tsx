import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', style }) => {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    success: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' },
    danger: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' },
    warning: { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' },
    info: { backgroundColor: 'rgba(255, 215, 0, 0.1)', color: 'var(--primary)', border: '1px solid rgba(255, 215, 0, 0.2)' },
  };

  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600,
        display: 'inline-block',
        ...styles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
};
