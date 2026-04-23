import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Badge, Pagination } from '../../../shared/components';
import { userApi, PendingProfile } from '../../../features/user/api/userApi';
import { useLoading } from '../../../shared/context/LoadingContext';
import { CheckCircle, XCircle, Clock, Eye, UserPlus, Search } from 'lucide-react';

import { RejectionModal, ResubmitStep } from '../../../features/user/components/RejectionModal';

const ITEMS_PER_PAGE = 10;

const PendingProfilesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showLoader, hideLoader } = useLoading();
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Rejection Modal State
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({
    isOpen: false,
    userId: '',
    userName: ''
  });

  // Search and Pagination states from URL
  const searchTerm = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchPendingProfiles = async () => {
    setLoading(true);
    try {
      const data = await userApi.getPendingProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Failed to fetch pending profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  // Filter profiles based on search term
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => 
      profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [profiles, searchTerm]);

  // Paginate filtered profiles
  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
  
  const paginatedProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProfiles, currentPage]);

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm(t('common.confirmation.approveProfile'))) return;
    setActionLoading(id);
    showLoader('pages.pendingProfiles.loading.approving');
    try {
      await userApi.approveUser(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to approve:', error);
      alert(t('errors.approveProfile'));
    } finally {
      hideLoader();
      setActionLoading(null);
    }
  };

  const handleOpenRejectModal = (id: string, name: string) => {
    setRejectionModal({
      isOpen: true,
      userId: id,
      userName: name
    });
  };

  const handleConfirmReject = async (reason: string, resubmitStep?: ResubmitStep) => {
    const id = rejectionModal.userId;
    setRejectionModal(prev => ({ ...prev, isOpen: false }));

    setActionLoading(id);
    showLoader('pages.pendingProfiles.loading.rejecting');
    try {
      await userApi.rejectUser(id, reason, resubmitStep);
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to reject:', error);
      alert(t('errors.rejectProfile'));
    } finally {
      hideLoader();
      setActionLoading(null);
    }
  };

  const getProfileSubmittedAt = (profile: PendingProfile) => {
    return profile.round2Evaluation?.submittedAt || profile.submittedAt || profile.createdAt;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>{t('pages.pendingProfiles.loading')}</Typography>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h1">{t('pages.pendingProfiles.title')}</Typography>
          <Typography variant="body" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            {t('pages.pendingProfiles.count', { count: filteredProfiles.length, total: profiles.length })}
          </Typography>
        </div>
        <Badge variant="warning" style={{ padding: '8px 16px', fontSize: '14px' }}>
          <Clock size={14} style={{ marginRight: '6px' }} />
          {t('pages.pendingProfiles.pendingCount', { count: profiles.length })}
        </Badge>
      </div>

      {/* Search Bar */}
      <div style={{
        marginBottom: '24px',
        position: 'relative',
        maxWidth: '500px'
      }}>
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder={t('placeholders.searchUser')}
          value={searchTerm}
          onChange={(e) => updateParams({ search: e.target.value, page: '1' })}
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 2px rgba(255, 215, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {filteredProfiles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
        }}>
          {searchTerm ? (
             <>
               <Search size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
               <Typography variant="h2" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                 {t('common.messages.noResults')}
               </Typography>
               <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                 {t('common.messages.tryAdjustingSearch', { searchTerm })}
               </Typography>
             </>
          ) : (
            <>
              <UserPlus size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
              <Typography variant="h2" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('common.messages.allCaughtUp')}
              </Typography>
              <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                {t('pages.pendingProfiles.nothingPending')}
              </Typography>
            </>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paginatedProfiles.map((profile, index) => (
              <div
                key={profile.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Queue number */}
                <div style={{
                  minWidth: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  fontSize: '16px',
                }}>
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </div>

                {/* Avatar */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, #B8860B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Typography variant="h2" style={{ margin: 0, color: 'var(--bg-main)', fontSize: '20px' }}>
                    {getInitials(profile.fullName)}
                  </Typography>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <Typography variant="h2" style={{ margin: 0, fontSize: '18px' }}>
                      {profile.fullName}
                    </Typography>
                    <Badge variant={profile.round1Completed && profile.round2Completed ? 'success' : 'info'}>
                      {profile.round1Completed && profile.round2Completed ? t('badge.full') : t('badge.partial')}
                    </Badge>
                  </div>
                  <Typography variant="body" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {profile.email}
                  </Typography>
                  {(profile.location || profile.evaluation?.location) && (
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      📍 {profile.location || profile.evaluation?.location}
                    </Typography>
                  )}
                  {profile.adminStatus && (
                    <div style={{ marginTop: '4px' }}>
                      <Badge variant="info" style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {profile.adminStatus}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Submitted time */}
                <div style={{ textAlign: 'right', minWidth: '160px' }}>
                  <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('pages.pendingProfiles.submitted')}
                  </Typography>
                  <Typography variant="body" style={{ fontSize: '13px', marginTop: '2px' }}>
                    {formatDate(getProfileSubmittedAt(profile))}
                  </Typography>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    variant="secondary"
                    style={{ padding: '10px 12px' }}
                    onClick={() => navigate(`/users/${profile.id}`)}
                    title={t('common.actions.viewDetails')}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="success"
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleApprove(profile.id)}
                    disabled={actionLoading === profile.id}
                  >
                    <CheckCircle size={16} />
                    {t('pages.pendingProfiles.actions.approve')}
                  </Button>
                  <Button
                    variant="danger"
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleOpenRejectModal(profile.id, profile.fullName)}
                    disabled={actionLoading === profile.id}
                  >
                    <XCircle size={16} />
                    {t('pages.pendingProfiles.actions.reject')}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => updateParams({ page: page.toString() })}
              style={{ marginTop: '40px' }}
            />
          )}
        </>
      )}

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal(prev => ({ ...prev, isOpen: false }))}
        userName={rejectionModal.userName}
        onConfirm={handleConfirmReject}
        loading={actionLoading === rejectionModal.userId}
      />
    </div>
  );
};

export default PendingProfilesPage;
