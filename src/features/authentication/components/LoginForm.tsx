import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Typography } from '../../../shared/components';
import { useLoading } from '../../../shared/context/LoadingContext';
import { authApi } from '../api/authApi';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@clique.app');
  const [secret, setSecret] = useState('clique83');
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showLoader, hideLoader } = useLoading();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    showLoader('loading.verifyingProtocols');

    try {
      const response = await authApi.login({ email, secretKey: secret });

      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('adminId', response.adminId);
      localStorage.setItem('adminSecret', secret);

      navigate('/dashboard');
    } catch (err: any) {
      setError(t('pages.login.verificationFailed'));
    } finally {
      hideLoader();
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {t('pages.login.emailLabel')}
        </Typography>
        <div style={{ position: 'relative' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@clique.app"
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              outline: 'none',
              letterSpacing: '0.05em',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      <div>
        <Typography variant="caption" style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {t('pages.login.secretLabel')}
        </Typography>
        <div style={{ position: 'relative' }}>
          <input
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="••••••••••••"
            required
            style={{
              width: '100%',
              padding: '14px 48px 14px 16px',
              borderRadius: '10px',
              border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              outline: 'none',
              letterSpacing: showSecret ? '0.05em' : '0.2em',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && (
          <Typography variant="caption" style={{ color: 'var(--danger)', marginTop: '8px', display: 'block', textTransform: 'none' }}>
            {error}
          </Typography>
        )}
      </div>

      <Button variant="primary" style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '8px' }}>
        {t('pages.login.button')}
      </Button>
    </form>
  );
};
