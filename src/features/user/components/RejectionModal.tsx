import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Typography } from '../../../shared/components/Typography/Typography';
import { Button } from '../../../shared/components/Button/Button';
import { AlertCircle } from 'lucide-react';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
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
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Từ chối hồ sơ"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm} 
            disabled={!reason.trim() || loading}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận Từ chối'}
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
            Bạn đang thực hiện từ chối hồ sơ của <strong>{userName}</strong>. Vui lòng cung cấp lý do chi tiết để gửi phản hồi cho người dùng.
          </Typography>
        </div>

        <div>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            LÝ DO TỪ CHỐI
          </Typography>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do chi tiết tại đây..."
            style={{
              width: '100%',
              height: '160px',
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
      </div>
    </Modal>
  );
};
