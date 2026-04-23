import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className, style, disabled, ...props }) => {
  const styles: Record<ButtonVariant, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--primary)', color: 'var(--bg-main)', fontWeight: 600, border: '1px solid var(--primary)' },
    secondary: { backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontWeight: 500 },
    danger: { backgroundColor: 'rgba(244, 63, 94, 0.08)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)', fontWeight: 600 },
    success: { backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600 },
  };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      className={className}
      disabled={disabled}
      {...props}
      style={{
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '14px',
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: disabled ? 0.5 : 1,
        filter: disabled ? 'grayscale(0.5)' : 'none',
        ...styles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.15)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.borderColor = 'var(--text-secondary)';
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
        } else if (variant === 'success') {
          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
          e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
        } else if (variant === 'danger') {
          e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.5)';
          e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        } else if (variant === 'secondary') {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.backgroundColor = 'var(--surface)';
        } else if (variant === 'success') {
          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
          e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
        } else if (variant === 'danger') {
          e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.2)';
          e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.08)';
        }
      }}
    >
      {children}
    </button>
  );
};
