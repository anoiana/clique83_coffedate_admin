import React from 'react';
import { Typography, Card } from '../../../shared/components';

export const UserAlbum: React.FC = () => (
    <Card title="Gallery">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ aspectRatio: '1/1', background: 'var(--border)', borderRadius: '8px' }} />)}
      </div>
    </Card>
);

export const UserHistory: React.FC = () => (
    <Card title="System Log">
      <Typography variant="caption">NO RECENT ACTIVITY RECORDED</Typography>
    </Card>
);

export const UserWallet: React.FC = () => (
    <Card title="Financial Profile">
        <Typography variant="h2" style={{ color: 'var(--primary)' }}>$ 0.00</Typography>
    </Card>
);
