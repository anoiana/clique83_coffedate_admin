import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Button, Badge } from '../../../shared/components';
import { dashboardApi } from '../api/dashboardApi';
import { useLoading } from '../../../shared/context/LoadingContext';
import { Sparkles, Trash2, Zap, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../../shared/context/NotificationContext';

export const DataManagement: React.FC = () => {
  const { t } = useTranslation();
  const { showLoader, hideLoader } = useLoading();
  const { showSuccess, showError, showWarning } = useNotification();
  const [seedLoading, setSeedLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [forceMatchLoading, setForceMatchLoading] = useState(false);

  // Force Match state
  const [forceAId, setForceAId] = useState('');
  const [forceBId, setForceBId] = useState('');
  const [forceResult, setForceResult] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!window.confirm(t('common.confirmation.seedData'))) return;
    setSeedLoading(true);
    showLoader('loading.seedingData');
    try {
      const result = await dashboardApi.seedData();
      showSuccess(`${result.message}. Seeded: ${result.seededCount || 'N/A'} records`);
      // Reload after a short delay to see updated charts
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      showError(t('pages.dashboard.errors.seedFailed', { error: error.message }));
    } finally {
      hideLoader();
      setSeedLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!window.confirm(t('common.confirmation.deleteSeedData'))) return;
    setCleanupLoading(true);
    showLoader('loading.cleaningUp');
    try {
      const result = await dashboardApi.cleanupData();
      showSuccess(result.message || t('pages.dashboard.dataManagement.cleanupCard.success') || 'Cleanup completed successfully!');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      showError(t('pages.dashboard.errors.cleanupFailed', { error: error.message }));
    } finally {
      hideLoader();
      setCleanupLoading(false);
    }
  };

  const handleForceMatch = async () => {
    if (!forceAId || !forceBId) {
      window.alert(t('common.messages.requiredField'));
      return;
    }
    setForceMatchLoading(true);
    showLoader('loading.forceMatching');
    setForceResult(null);
    try {
      await dashboardApi.forceMatch(forceAId, forceBId);
      showSuccess(t('pages.dashboard.dataManagement.forceMatchCard.success') || 'Match created between User A & User B. Check Matching Queue.');
      setForceAId('');
      setForceBId('');
    } catch (error: any) {
      showError(t('pages.dashboard.errors.forceMatchFailed', { error: error.message }));
    } finally {
      hideLoader();
      setForceMatchLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <Typography variant="h2" style={{ marginBottom: '16px' }}>
        {t('pages.dashboard.dataManagement.title')}
      </Typography>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        {/* Seed Data Card */}
        <Card style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={20} color="#10b981" />
            </div>
            <div>
              <Typography variant="h2" style={{ fontSize: '16px', marginBottom: '4px' }}>
                {t('pages.dashboard.dataManagement.seedCard.title') || 'Seed Demo Data'}
              </Typography>
              <Typography variant="caption" style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {t('pages.dashboard.dataManagement.seedCard.description')}
              </Typography>
            </div>
          </div>
          <Button
            variant="success"
            onClick={handleSeed}
            disabled={seedLoading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Sparkles size={16} />
            {seedLoading ? t('common.status.loading') : t('pages.dashboard.dataManagement.seedCard.button')}
          </Button>
        </Card>

        {/* Cleanup Data Card */}
        <Card style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trash2 size={20} color="#ef4444" />
            </div>
            <div>
              <Typography variant="h2" style={{ fontSize: '16px', marginBottom: '4px' }}>
                {t('pages.dashboard.dataManagement.cleanupCard.title') || 'Cleanup Demo Data'}
              </Typography>
              <Typography variant="caption" style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {t('pages.dashboard.dataManagement.cleanupCard.description')}
              </Typography>
            </div>
          </div>
          <Button
            variant="danger"
            onClick={handleCleanup}
            disabled={cleanupLoading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Trash2 size={16} />
            {cleanupLoading ? t('common.status.loading') : t('pages.dashboard.dataManagement.cleanupCard.button')}
          </Button>
        </Card>

        {/* Force Match Card */}
        <Card style={{ border: '1px solid rgba(255, 215, 0, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={20} color="var(--primary)" />
            </div>
            <div>
              <Typography variant="h2" style={{ fontSize: '16px', marginBottom: '4px' }}>
                {t('pages.dashboard.dataManagement.forceMatchCard.title')}
              </Typography>
              <Typography variant="caption" style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {t('pages.dashboard.dataManagement.forceMatchCard.description')}
              </Typography>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder={t('placeholders.userAId')}
              value={forceAId}
              onChange={(e) => setForceAId(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <input
              type="text"
              placeholder={t('placeholders.userBId')}
              value={forceBId}
              onChange={(e) => setForceBId(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleForceMatch}
            disabled={forceMatchLoading || !forceAId || !forceBId}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Zap size={16} />
            {forceMatchLoading ? t('common.status.loading') : t('pages.dashboard.dataManagement.forceMatchCard.button')}
          </Button>

          {forceResult && (
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: forceResult.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${forceResult.includes('✅') ? '#10b981' : '#ef4444'}`,
            }}>
              <Typography variant="caption" style={{ color: forceResult.includes('✅') ? '#10b981' : '#ef4444', fontSize: '12px' }}>
                {forceResult}
              </Typography>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
