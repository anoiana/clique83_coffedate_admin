import React from 'react';
import { useTranslation } from 'react-i18next';
import { UsersTable } from '../../../features/dashboard';
import { Typography } from '../../../shared/components';

const UsersListPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <Typography variant="h1">{t('pages.users.list.title')}</Typography>
        <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
          {t('pages.users.list.description')}
        </Typography>
      </div>

      <UsersTable />
    </div>
  );
};

export default UsersListPage;
