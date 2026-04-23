import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, extra, className, style }) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        padding: '28px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {(title || extra) && (
        <div style={{ 
          marginBottom: '24px', 
          borderBottom: '1px solid rgba(255,255,255,0.05)', 
          paddingBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {title && (
            typeof title === 'string' ? (
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>{title}</h2>
            ) : (
               title
            )
          )}
          {extra && <div>{extra}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
