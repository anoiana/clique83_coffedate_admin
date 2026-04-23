import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../../../features/authentication';
import { Typography, Card } from '../../../shared/components';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, rgba(10,7,5,0) 70%)',
        zIndex: 0
      }} />

      <div style={{ width: '100%', maxWidth: '440px', padding: '20px', zIndex: 1, animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Typography variant="h1" style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '36px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {t('pages.login.title')}
          </Typography>
          <Typography variant="body" style={{ color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '12px' }}>
            {t('pages.login.subtitle')}
          </Typography>
        </div>

        <Card style={{ padding: '40px' }}>
          <Typography variant="h2" style={{marginBottom: '8px'}}>
            {t('pages.login.restrictedAccess')}
          </Typography>
          <Typography variant="body" style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {t('pages.login.instruction')}
          </Typography>

          <LoginForm />
        </Card>

        {/* <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Typography variant="caption" style={{ color: '#4b5563' }}>
            &copy; 2026 Clique83 Team. Premium Dating Experience.
          </Typography>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
