import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard } from 'lucide-react';
import { DashboardStats, AnalyticsCharts, DataManagement } from '../../../features/dashboard';
import { Typography } from '../../../shared/components';

const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const today = new Date().toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: 'var(--primary)' }}>
            <LayoutDashboard size={20} />
          </div>
          <Typography variant="h1" style={{ margin: 0 }}>{t('pages.dashboard.title')}</Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
            {t('pages.dashboard.welcome')}
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            {today.toUpperCase()}
          </Typography>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <DashboardStats />
      </div>

      <div style={{ marginTop: '24px' }}>
        <AnalyticsCharts />
      </div>

      <DataManagement />
    </div>
  );
};

export default DashboardPage;
