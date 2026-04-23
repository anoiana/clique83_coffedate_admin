import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Card } from '../../../shared/components';

export const EvaluationPanel: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Card title={t('evaluationPanel.title')}>
      <Typography variant="body">{t('evaluationPanel.description')}</Typography>
    </Card>
  );
};
