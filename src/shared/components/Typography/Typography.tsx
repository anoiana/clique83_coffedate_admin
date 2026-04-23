import React from 'react';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  className?: string;
  style?: React.CSSProperties;
}

export const Typography: React.FC<TypographyProps> = ({ children, variant = 'body', className, style }) => {
  const styles: Record<TypographyVariant, React.CSSProperties> = {
    h1: { fontSize: '32px', fontWeight: 800, color: 'var(--primary)', margin: '0', letterSpacing: '0.3em', lineHeight: 1.2, textTransform: 'uppercase' },
    h2: { fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0', letterSpacing: '0.15em', lineHeight: 1.3, textTransform: 'uppercase' },
    h3: { fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0', lineHeight: 1.4, letterSpacing: '0.05em' },
    body: { fontSize: '15px', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.6 },
    caption: { fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em' },
  };

  const Component = variant === 'body' ? 'p' : (variant === 'caption' ? 'span' : variant);

  return (
    <Component className={className} style={{ ...styles[variant], ...style }}>
      {children}
    </Component>
  );
};
