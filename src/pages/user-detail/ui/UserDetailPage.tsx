import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Card, Badge } from '../../../shared/components';
import { userApi, UserDetail, UserPhoto } from '../../../features/user/api/userApi';
import { useLoading } from '../../../shared/context/LoadingContext';
import { RejectionModal, ResubmitStep } from '../../../features/user/components/RejectionModal';
import { optimizeImageUrl } from '../../../shared/lib/cloudinary';
import { Mail, Calendar, MapPin, CheckCircle, XCircle, Wallet, Image, Eye, EyeOff, Check, Ban, Heart, Activity, Globe, Info, Ruler, Star, Copy, Clock, Target, MessageSquare } from 'lucide-react';

const UserDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoading();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await userApi.getUserById(id);
        // Debug: verify backend returns photos relation (temporary — remove after verification)
        // eslint-disable-next-line no-console
        console.log('[UserDetail] photos:', data.photos);
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleApprove = async () => {
    if (!user) return;
    if (!confirm(t('common.confirmation.approveProfile'))) return;

    setActionLoading(true);
    showLoader(t('loading.approvingProfile'));
    try {
      await userApi.approveUser(user.id);
      setUser(prev => prev ? { ...prev, isInMatchingPool: true, status: 'APPROVED' } : null);
      alert(t('pages.users.detail.alerts.approveSuccess'));
    } catch (error) {
      console.error('Failed to approve:', error);
      alert(t('errors.approveProfile'));
    } finally {
      hideLoader();
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async (reason: string, resubmitStep?: ResubmitStep) => {
    if (!user) return;
    setRejectionModalOpen(false);

    setActionLoading(true);
    showLoader(t('loading.rejectingProfile'));
    try {
      await userApi.rejectUser(user.id, reason, resubmitStep);
      setUser(prev => prev ? { ...prev, status: 'REJECTED', adminStatus: 'REJECTED', adminRejectionReason: reason } : null);
      alert(t('pages.users.detail.alerts.rejectSuccess'));
    } catch (error) {
      console.error('Failed to reject:', error);
      alert(t('errors.rejectProfile'));
    } finally {
      hideLoader();
      setActionLoading(false);
    }
  };

  const handleTogglePhotoVisibility = async (photo: UserPhoto) => {
    if (!user) return;
    setActionLoading(true);
    try {
      await userApi.updatePhotoVisibility(user.id, {
        photoIds: [photo.id],
        isPublic: !photo.isPublic,
      });
      setUser(prev => prev ? {
        ...prev,
        photos: prev.photos?.map(p =>
          p.id === photo.id ? { ...p, isPublic: !p.isPublic } : p
        ),
      } : null);
    } catch (error) {
      console.error('Failed to toggle photo visibility:', error);
      alert(t('pages.users.detail.alerts.photoVisibilityFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>{t('pages.users.detail.loading')}</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Typography variant="h2">{t('pages.users.detail.notFound')}</Typography>
        <Button onClick={() => navigate('/users')}>{t('common.actions.back')}</Button>
      </div>
    );
  }

  const isPending = user.adminStatus === 'PENDING_REVIEW' || (!user.isInMatchingPool && user.round1Completed && user.round2Completed);
  const canApprove = isPending || user.status === 'PENDING';

  return (
    <div className="page-container" style={{ maxWidth: '1400px', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Button variant="secondary" onClick={() => navigate(-1)} style={{ borderRadius: '8px' }}>
          {t('pages.users.detail.backButton')}
        </Button>
        <Typography variant="h1" style={{ margin: 0, fontSize: '24px' }}>{t('pages.users.detail.title')}</Typography>
        {(user.adminStatus || user.status) && (
          <Badge variant={(user.adminStatus === 'APPROVED' || user.status === 'APPROVED') ? 'success' : (user.adminStatus === 'REJECTED' || user.status === 'REJECTED') ? 'danger' : 'warning'}>
            {user.adminStatus || user.status}
          </Badge>
        )}
        {user.adminRejectionReason && (
          <Badge variant="danger" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', fontSize: '12px' }}>
            {t('pages.users.detail.reasonBadge', { reason: user.adminRejectionReason })}
          </Badge>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px', alignItems: 'start' }}>

        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <Card>
            <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '24px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #B8860B 100%)',
                margin: '0 auto 16px auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(255, 215, 0, 0.2)'
              }}>
                <Typography variant="h1" style={{ margin: 0, color: 'var(--bg-main)', fontSize: '28px' }}>
                  {getInitials(user.fullName)}
                </Typography>
              </div>
              <Typography variant="h2" style={{ margin: '0 0 4px 0', fontSize: '22px' }}>{user.fullName}</Typography>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '11px' }}>
                  ID: {user.id}
                </Typography>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    alert(t('common.messages.copiedToClipboard'));
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    color: 'var(--primary)', display: 'flex', alignItems: 'center', opacity: 0.7
                  }}
                  title={t('pages.users.detail.copyIdButton')}
                >
                  <Copy size={12} />
                </button>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {user.emailVerified && (
                  <Badge variant="success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> {t('pages.users.detail.badges.emailVerified')}
                  </Badge>
                )}
                {user.isMember ? (
                  <Badge variant="success">{t('pages.users.detail.badges.verifiedMember')}</Badge>
                ) : (
                  <Badge variant="info">{t('badge.guest')}</Badge>
                )}
                {user.isInMatchingPool && (
                  <Badge variant="success">{t('pages.users.detail.badges.inPool')}</Badge>
                )}
                {isPending && (
                  <Badge variant="warning">{t('pages.users.detail.badges.pending')}</Badge>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Mail size={16} color="var(--primary)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.email')}</Typography>
                  <Typography variant="body" style={{ fontSize: '14px' }}>{user.email}</Typography>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Calendar size={16} color="var(--primary)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.joined')}</Typography>
                  <Typography variant="body" style={{ fontSize: '14px' }}>{formatDate(user.createdAt)}</Typography>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Clock size={16} color="var(--primary)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.lastUpdate')}</Typography>
                  <Typography variant="body" style={{ fontSize: '14px' }}>{formatDate(user.updatedAt)}</Typography>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={16} color="var(--primary)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.location')}</Typography>
                  <Typography variant="body" style={{ fontSize: '14px' }}>{user.evaluation?.location || t('pages.users.detail.fields.notSet')}</Typography>
                </div>
              </div>
            </div>
          </Card>

          {user.wallet && (
            <Card title={t('pages.users.detail.wallet.title')} style={{ background: 'rgba(255, 215, 0, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Wallet size={20} color="var(--primary)" />
                  <Typography variant="h2" style={{ margin: 0, fontSize: '24px' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.wallet.balance)}
                  </Typography>
                </div>
              </div>
              {user.membershipPaidAt && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> {t('pages.users.detail.wallet.membershipPaidOn', { date: new Date(user.membershipPaidAt).toLocaleDateString('vi-VN') })}
                </div>
              )}
            </Card>
          )}

          {/* Admin Actions */}
          {canApprove && (
            <Card title={t('pages.users.detail.adminActions.title')} style={{ border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Typography variant="body" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {t('pages.users.detail.adminActions.description')}
                </Typography>
                <Button
                  variant="success"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  <CheckCircle size={16} />
                  {t('pages.users.detail.adminActions.approve')}
                </Button>
                <Button
                  variant="danger"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setRejectionModalOpen(true)}
                  disabled={actionLoading}
                >
                  <Ban size={16} />
                  {t('pages.users.detail.adminActions.reject')}
                </Button>
              </div>
            </Card>
          )}

          {user && (
            <RejectionModal
              isOpen={rejectionModalOpen}
              onClose={() => setRejectionModalOpen(false)}
              userName={user.fullName}
              onConfirm={handleConfirmReject}
              loading={actionLoading}
            />
          )}

        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Photo Gallery — always rendered so admin sees empty state too */}
          <Card title={t('pages.users.detail.section.photos')}>
            {(!user.photos || user.photos.length === 0) ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <Image size={32} color="var(--text-secondary)" />
                <Typography variant="body" style={{ fontSize: '14px', margin: 0 }}>
                  {t('pages.users.detail.photosEmpty')}
                </Typography>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {['FACE', 'BODY', 'LIFESTYLE', 'OTHER'].map(category => {
                  // Case-insensitive matching; anything not FACE/BODY/LIFESTYLE (e.g. CCCD_FRONT/BACK or missing) falls into OTHER.
                  const categoryPhotos = user.photos?.filter(p => {
                    const raw = (p.category || '').toUpperCase();
                    const bucket = raw === 'FACE' || raw === 'BODY' || raw === 'LIFESTYLE' ? raw : 'OTHER';
                    return bucket === category;
                  });
                  if (!categoryPhotos || categoryPhotos.length === 0) return null;

                  return (
                    <div key={category}>
                      <Typography variant="h2" style={{ fontSize: '14px', marginBottom: '12px', opacity: 0.7, textTransform: 'uppercase' }}>
                        {t(`pages.users.detail.photos.${category.toLowerCase()}`)}
                      </Typography>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                        {categoryPhotos.map((photo) => (
                          <div key={photo.id} style={{ position: 'relative' }}>
                            <div style={{
                              width: '100%',
                              aspectRatio: '3/4',
                              borderRadius: '12px',
                              backgroundColor: 'var(--border)',
                              border: photo.isPublic ? '2px solid var(--success)' : '2px solid var(--border)',
                              overflow: 'hidden',
                              cursor: photo.url ? 'pointer' : 'default',
                              position: 'relative',
                            }}
                            onClick={() => {
                              // 'noreferrer' is critical: without it, window.open propagates the
                              // admin origin in the Referer header and Google Drive rate-limits (429).
                              // 'noopener' is standard hygiene so the new tab can't reach window.opener.
                              if (photo.url) window.open(photo.url, '_blank', 'noopener,noreferrer');
                            }}
                            >
                              {photo.url ? (
                                <img
                                  src={optimizeImageUrl(photo.url, 400)}
                                  alt=""
                                  loading="lazy"
                                  // Google Drive /thumbnail throttles per Referer. Without this
                                  // the browser sends our admin origin and Drive 429s the request.
                                  // Opening the URL in a new tab works because there is no Referer.
                                  referrerPolicy="no-referrer"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    img.style.display = 'none';
                                    const fallback = img.nextElementSibling as HTMLElement | null;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                style={{
                                  display: photo.url ? 'none' : 'flex',
                                  alignItems: 'center', justifyContent: 'center',
                                  width: '100%', height: '100%',
                                  position: 'absolute', inset: 0,
                                  backgroundColor: 'var(--border)',
                                  color: 'var(--text-secondary)',
                                  flexDirection: 'column', gap: '4px',
                                }}
                              >
                                <Image size={32} />
                                {photo.url && (
                                  <span style={{ fontSize: '10px', opacity: 0.7 }}>{t('pages.users.detail.photos.loadError', 'Không tải được ảnh')}</span>
                                )}
                              </div>
                            </div>
                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Badge variant={photo.isPublic ? 'success' : 'danger'} style={{ fontSize: '10px' }}>
                                {photo.isPublic ? t('pages.users.detail.photos.public') : t('pages.users.detail.photos.hidden')}
                              </Badge>
                              <button
                                onClick={() => handleTogglePhotoVisibility(photo)}
                                disabled={actionLoading}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: photo.isPublic ? 'var(--danger)' : 'var(--success)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '11px',
                                  padding: '4px',
                                  borderRadius: '6px',
                                }}
                              >
                                {photo.isPublic ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Round 2 Evaluation Data */}
          {user.round2Evaluation && (
            <Card title={t('pages.users.detail.section.personality')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* Bio Section */}
                {user.round2Evaluation.data.bio && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Info size={18} color="var(--primary)" />
                      <Typography variant="h2" style={{ margin: 0, fontSize: '16px' }}>{t('pages.users.detail.fields.bio')}</Typography>
                    </div>
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: 'rgba(255, 215, 0, 0.05)', 
                      borderRadius: '12px',
                      borderLeft: '4px solid var(--primary)',
                      fontStyle: 'italic',
                      lineHeight: '1.6'
                    }}>
                      <Typography variant="body">{user.round2Evaluation.data.bio}</Typography>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* Physical & Background */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Ruler size={18} color="var(--primary)" />
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.height')}</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{user.round2Evaluation.data.height} cm</Typography>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Globe size={18} color="var(--primary)" />
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.languages')}</Typography>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {user.round2Evaluation.data.languages.map(lang => (
                            <Badge key={lang} variant="info" style={{ textTransform: 'capitalize' }}>{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Star size={18} color="var(--primary)" />
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.religion')}</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{user.round2Evaluation.data.religionBelief}</Typography>
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Activity size={18} color="var(--primary)" />
                      <Typography variant="h2" style={{ margin: 0, fontSize: '16px' }}>{t('pages.users.detail.fields.interests')}</Typography>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {user.round2Evaluation.data.interests.map(interest => (
                        <Badge key={interest} style={{ 
                          backgroundColor: 'rgba(255, 215, 0, 0.1)', 
                          color: 'var(--primary)',
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                          textTransform: 'capitalize'
                        }}>
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

                {/* Deep Compatibility Traits */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                   <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Heart size={18} color="#ef4444" />
                      <Typography variant="h2" style={{ margin: 0, fontSize: '16px' }}>{t('pages.users.detail.fields.loveStyle')}</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.loveLanguages')}</Typography>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {user.round2Evaluation.data.loveLanguages.map(ll => (
                            <Badge key={ll} variant="success" style={{ textTransform: 'capitalize' }}>{ll.replace('_', ' ')}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.attachmentStyle')}</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{user.round2Evaluation.data.attachmentStyle}</Typography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Activity size={18} color="var(--primary)" />
                      <Typography variant="h2" style={{ margin: 0, fontSize: '16px' }}>{t('pages.users.detail.fields.dynamics')}</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.socialEnergy')}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}>
                            <div style={{ width: `${(user.round2Evaluation.data.socialEnergy / 5) * 100}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
                          </div>
                          <Typography variant="caption">{user.round2Evaluation.data.socialEnergy}/5</Typography>
                        </div>
                      </div>
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.fitnessLevel')}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}>
                            <div style={{ width: `${(user.round2Evaluation.data.fitnessLevel / 5) * 100}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                          </div>
                          <Typography variant="caption">{user.round2Evaluation.data.fitnessLevel}/5</Typography>
                        </div>
                      </div>
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.lifeOrientation')}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}>
                            <div style={{ width: `${(user.round2Evaluation.data.lifeOrientation / 5) * 100}%`, height: '100%', backgroundColor: '#8b5cf6', borderRadius: '2px' }}></div>
                          </div>
                          <Typography variant="caption">{user.round2Evaluation.data.lifeOrientation}/5</Typography>
                        </div>
                      </div>
                      {typeof user.round2Evaluation.data.openness === 'number' && (
                        <div>
                          <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.openness')}</Typography>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}>
                              <div style={{ width: `${(user.round2Evaluation.data.openness / 5) * 100}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
                            </div>
                            <Typography variant="caption">{user.round2Evaluation.data.openness}/5</Typography>
                          </div>
                        </div>
                      )}
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.decisionStyle')}</Typography>
                        <Typography variant="body" style={{ fontWeight: 600 }}>{user.round2Evaluation.data.decisionStyle}</Typography>
                      </div>
                      <div>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.communicationStyle')}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <MessageSquare size={14} color="var(--primary)" />
                          <Typography variant="body" style={{ fontWeight: 600 }}>{user.round2Evaluation.data.communicationStyle}</Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

                {/* Preferences & Matching Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Target size={18} color="var(--primary)" />
                      <Typography variant="h2" style={{ margin: 0, fontSize: '16px' }}>{t('pages.users.detail.section.matching')}</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '12px', backgroundColor: 'var(--border)', borderRadius: '8px', opacity: 0.8 }}>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.preferredAgeRange')}</Typography>
                        <Typography variant="h2" style={{ margin: '4px 0 0 0', fontSize: '18px', color: 'var(--primary)' }}>
                          {user.round2Evaluation.data.preferredAgeMin} — {user.round2Evaluation.data.preferredAgeMax} {t('pages.users.detail.yearsSuffix')}
                        </Typography>
                        <div style={{ marginTop: '8px' }}>
                          <Badge variant={user.round2Evaluation.data.ageFlexible ? 'success' : 'info'}>
                            {user.round2Evaluation.data.ageFlexible ? t('pages.users.detail.fields.ageFlexible') : t('pages.users.detail.fields.ageStrict')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Life Priorities */}
                <div>
                  <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>{t('pages.users.detail.fields.lifePriorities')}</Typography>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {user.round2Evaluation.data.lifePriorities.map((priority, index) => (
                      <div key={priority} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '6px 12px',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>#{index + 1}</span>
                        <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{priority}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Card>
          )}

          {user.evaluation && (
            <Card title={t('pages.users.detail.section.evaluation')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.gender')}</Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>{user.evaluation.gender}</Typography>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.preferGender')}</Typography>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {(user.evaluation.preferGender && user.evaluation.preferGender.length > 0) ? (
                        user.evaluation.preferGender.map((g, idx) => (
                          <Badge key={idx} variant="info">{g}</Badge>
                        ))
                      ) : (
                        <Typography variant="body" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.notProvided')}</Typography>
                      )}
                    </div>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.age')}</Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>
                      {formatDate(user.evaluation.birthdate)}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.education')}</Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>{user.evaluation.education}</Typography>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.phoneNumber')}</Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>{user.evaluation.phoneNumber || t('pages.users.detail.fields.notProvided')}</Typography>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.workField')}</Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>{user.evaluation.workField}</Typography>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.incomeRange')}</Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>{user.evaluation.incomeRange}</Typography>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.intent')}</Typography>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {user.evaluation.intentGoals.map((goal, idx) => (
                        <Badge key={idx} variant="info">{goal}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.source')}</Typography>
                    <Typography variant="body" style={{ fontWeight: 600 }}>{user.evaluation.source || t('pages.users.detail.fields.notProvided')}</Typography>
                  </div>
                  <div>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.openToSameGender')}</Typography>
                    <div style={{ marginTop: '4px' }}>
                      {user.evaluation.openToSameGenderForBusiness === true ? (
                        <Badge variant="success">{t('pages.users.detail.fields.yes')}</Badge>
                      ) : user.evaluation.openToSameGenderForBusiness === false ? (
                        <Badge variant="info">{t('pages.users.detail.fields.no')}</Badge>
                      ) : (
                        <Typography variant="body" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{t('pages.users.detail.fields.notProvided')}</Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card title={t('pages.users.detail.section.process')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user.round1Completed ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="var(--text-secondary)" />}
                <Typography variant="body">{t('pages.users.detail.rounds.round1')}</Typography>
              </div>
              <Badge variant={user.round1Completed ? 'success' : 'info'}>{user.round1Completed ? t('pages.users.detail.rounds.completed') : t('pages.users.detail.rounds.pending')}</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user.round2Completed ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="var(--text-secondary)" />}
                <Typography variant="body">{t('pages.users.detail.rounds.round2')}</Typography>
              </div>
              <Badge variant={user.round2Completed ? 'success' : 'info'}>{user.round2Completed ? t('pages.users.detail.rounds.completed') : t('pages.users.detail.rounds.pending')}</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user.isFullyOnboarded ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="var(--text-secondary)" />}
                <Typography variant="body">{t('pages.users.detail.rounds.fullOnboarding')}</Typography>
              </div>
              <Badge variant={user.isFullyOnboarded ? 'success' : 'info'}>{user.isFullyOnboarded ? t('pages.users.detail.rounds.completed') : t('badge.inProgress')}</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user.isInMatchingPool ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="var(--text-secondary)" />}
                <Typography variant="body">{t('pages.users.detail.rounds.matchingPool')}</Typography>
              </div>
              <Badge variant={user.isInMatchingPool ? 'success' : 'info'}>{user.isInMatchingPool ? t('badge.active') : t('badge.notInPool')}</Badge>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default UserDetailPage;
