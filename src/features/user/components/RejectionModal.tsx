import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Typography } from '../../../shared/components/Typography/Typography';
import { Button } from '../../../shared/components/Button/Button';
import { AlertCircle } from 'lucide-react';

export type ResubmitStep =
  | 'ROUND_1'
  | 'ROUND_2_ALL'
  | 'ROUND_2_VALUES'
  | 'ROUND_2_MATCH'
  | 'ROUND_2_PERSONALITY'
  | 'ROUND_2_LIFESTYLE'
  | 'ROUND_2_INTERESTS'
  | 'ROUND_2_BACKGROUND'
  | 'ROUND_2_EXPRESSION'
  | 'PHOTOS'
  | 'ROUND_3'
  | 'FULL_RESET';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, resubmitStep?: ResubmitStep) => void;
  userName: string;
  loading?: boolean;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  loading = false
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [resubmitStep, setResubmitStep] = useState<ResubmitStep | ''>('');

  const resubmitStepOptions = useMemo<{ value: ResubmitStep | ''; label: string }[]>(() => [
    { value: '', label: t('rejection.resubmitSteps.none') },
    { value: 'ROUND_1', label: t('rejection.resubmitSteps.round1') },
    { value: 'ROUND_2_ALL', label: t('rejection.resubmitSteps.round2All') },
    { value: 'ROUND_2_VALUES', label: t('rejection.resubmitSteps.round2Values') },
    { value: 'ROUND_2_MATCH', label: t('rejection.resubmitSteps.round2Match') },
    { value: 'ROUND_2_PERSONALITY', label: t('rejection.resubmitSteps.round2Personality') },
    { value: 'ROUND_2_LIFESTYLE', label: t('rejection.resubmitSteps.round2Lifestyle') },
    { value: 'ROUND_2_INTERESTS', label: t('rejection.resubmitSteps.round2Interests') },
    { value: 'ROUND_2_BACKGROUND', label: t('rejection.resubmitSteps.round2Background') },
    { value: 'ROUND_2_EXPRESSION', label: t('rejection.resubmitSteps.round2Expression') },
    { value: 'PHOTOS', label: t('rejection.resubmitSteps.photos') },
    { value: 'ROUND_3', label: t('rejection.resubmitSteps.round3') },
    { value: 'FULL_RESET', label: t('rejection.resubmitSteps.fullReset') },
  ], [t]);

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason, resubmitStep || undefined);
    }
  };

  const handleClose = () => {
    setReason('');
    setResubmitStep('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('rejection.title')}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            {t('rejection.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
          >
            {loading ? t('rejection.processing') : t('rejection.confirmButton')}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          gap: '12px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <AlertCircle size={20} color="var(--danger)" style={{ flexShrink: 0 }} />
          <Typography variant="body" style={{ fontSize: '14px', margin: 0 }}>
            <span dangerouslySetInnerHTML={{ __html: t('rejection.message', { userName }) }} />
          </Typography>
        </div>

        <div>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            {t('rejection.label')}
          </Typography>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('rejection.placeholder')}
            style={{
              width: '100%',
              height: '140px',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              resize: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            {t('rejection.resubmitStepLabel')}
          </Typography>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {t('rejection.resubmitStepHint')}
          </Typography>
          <select
            value={resubmitStep}
            onChange={(e) => setResubmitStep(e.target.value as ResubmitStep | '')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {resubmitStepOptions.map(opt => (
              <option key={opt.value || 'none'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};
