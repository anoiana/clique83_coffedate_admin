import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Badge } from '../../../shared/components';
import { meetingApi, Meeting } from '../../../features/meeting/api/meetingApi';
import { Clock, MapPin, CheckCircle, XCircle, Calendar } from 'lucide-react';

const STATUS_GROUPS: Meeting['status'][] = [
  'awaiting_availability',
  'awaiting_confirmation',
  'confirmed',
  'completed',
];

const getStatusConfig = (status: Meeting['status'], t: any) => {
  const keyMap: Record<Meeting['status'], string> = {
    awaiting_availability: 'pages.meetings.tabs.awaitingAvailability',
    awaiting_confirmation: 'pages.meetings.tabs.awaitingConfirmation',
    confirmed: 'pages.meetings.tabs.confirmed',
    completed: 'pages.meetings.tabs.completed',
    cancelled: 'pages.meetings.tabs.cancelled',
  };
  const variants: Record<Meeting['status'], 'success' | 'info' | 'warning' | 'danger'> = {
    awaiting_availability: 'info',
    awaiting_confirmation: 'warning',
    confirmed: 'success',
    completed: 'success',
    cancelled: 'danger',
  };
  const colors: Record<Meeting['status'], string> = {
    awaiting_availability: '#3b82f6',
    awaiting_confirmation: '#f59e0b',
    confirmed: '#10b981',
    completed: '#10b981',
    cancelled: '#ef4444',
  };
  return {
    label: t(keyMap[status]),
    variant: variants[status],
    color: colors[status],
  };
};

const MeetingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<Meeting['status'] | 'all'>('all');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await meetingApi.getMeetings();
        setMeetings(data?.meetings || []);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const filteredMeetings = (meetings || []).filter(m => 
    selectedStatus === 'all' ? true : m.status === selectedStatus
  );

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusCounts = () => {
    if (!meetings) return { all: 0 };
    const counts: Record<string, number> = { all: meetings.length };
    meetings.forEach(m => {
      if (m?.status) {
        counts[m.status] = (counts[m.status] || 0) + 1;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>{t('pages.meetings.loading')}</div>;
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <Typography variant="h1">{t('pages.meetings.title')}</Typography>
        <Typography variant="body" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          {t('pages.meetings.description')}
        </Typography>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedStatus('all')}
          style={{
            padding: '8px 20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: selectedStatus === 'all' ? 'var(--primary)' : 'var(--border)',
            backgroundColor: selectedStatus === 'all' ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
            color: selectedStatus === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          {t('pages.meetings.tabs.all')} ({statusCounts.all})
        </button>
        {STATUS_GROUPS.map(status => {
          const config = getStatusConfig(status, t);
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedStatus === status ? config.color : 'var(--border)',
                backgroundColor: selectedStatus === status ? `${config.color}15` : 'transparent',
                color: selectedStatus === status ? config.color : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              {config.label} ({statusCounts[status] || 0})
            </button>
          );
        })}
      </div>

      {/* Meetings List */}
      {filteredMeetings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
        }}>
          <Calendar size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
          <Typography variant="h2" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {t('pages.meetings.noMeetings')}
          </Typography>
          <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
            {selectedStatus === 'all'
              ? t('pages.meetings.noMeetingsAll')
              : t('pages.meetings.noMeetingsWithStatus', { status: t(`pages.meetings.status.${selectedStatus}`) })}
          </Typography>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredMeetings.map(meeting => (
            <Card key={meeting.id} style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Status Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: `${getStatusConfig(meeting.status, t).color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {meeting.status === 'completed' ? (
                    <CheckCircle size={22} color={getStatusConfig(meeting.status, t).color} />
                  ) : meeting.status === 'cancelled' ? (
                    <XCircle size={22} color={getStatusConfig(meeting.status, t).color} />
                  ) : (
                    <Clock size={22} color={getStatusConfig(meeting.status, t).color} />
                  )}
                </div>

                {/* Couple info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                  {/* User A */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, var(--primary) 0%, #B8860B 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--bg-main)',
                      fontWeight: 800,
                      fontSize: '13px',
                    }}>
                      {getInitials(meeting.userA.fullName)}
                    </div>
                    <div>
                      <Typography variant="body" style={{ fontWeight: 600, fontSize: '14px' }}>{meeting.userA.fullName}</Typography>
                      <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{meeting.userA.email}</Typography>
                    </div>
                  </div>

                  {/* Connector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '30px', height: '2px', backgroundColor: 'var(--border)' }} />
                    <span style={{ fontSize: '18px' }}>💕</span>
                    <div style={{ width: '30px', height: '2px', backgroundColor: 'var(--border)' }} />
                  </div>

                  {/* User B */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '13px',
                    }}>
                      {getInitials(meeting.userB.fullName)}
                    </div>
                    <div>
                      <Typography variant="body" style={{ fontWeight: 600, fontSize: '14px' }}>{meeting.userB.fullName}</Typography>
                      <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{meeting.userB.email}</Typography>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '180px' }}>
                  <MapPin size={14} color="var(--text-secondary)" />
                  <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {meeting.location?.name || 'Not set'}
                  </Typography>
                </div>

                {/* Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '140px' }}>
                  <Calendar size={14} color="var(--text-secondary)" />
                  <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {meeting.scheduledAt ? formatDate(meeting.scheduledAt) : formatDate(meeting.suggestedAt)}
                  </Typography>
                </div>

                {/* Status Badge */}
                <Badge variant={getStatusConfig(meeting.status, t).variant}>
                  {getStatusConfig(meeting.status, t).label}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
