import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Pagination } from '../../../shared/components';
import { matchingApi, MatchSuggestion } from '../../../features/matching/api/matchingApi';
import { useLoading } from '../../../shared/context/LoadingContext';
import { Clock, Search, ChevronRight, Timer } from 'lucide-react';

const MatchingListPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [deadlineLoading, setDeadlineLoading] = useState(false);
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoading();
    
    const itemsPerPage = 10;

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const data = await matchingApi.getSuggestions();
            setSuggestions(data);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const filteredSuggestions = useMemo(() => {
        return suggestions.filter(s => 
            s.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.suggested.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [suggestions, searchQuery]);

    const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
    const currentSuggestions = filteredSuggestions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const handleCheckDeadlines = async () => {
        if (!window.confirm(t('pages.matching.list.confirm.checkDeadlines'))) return;
        setDeadlineLoading(true);
        showLoader('pages.matching.list.loading.checkingDeadlines');
        try {
            const result = await matchingApi.checkDeadlines();
            alert(t('pages.matching.list.success.deadlinesChecked', { count: result.expiredCount }));
            fetchSuggestions();
        } catch (error) {
            console.error('Failed to check deadlines:', error);
            alert(t('pages.matching.list.error.deadlineCheckFailed'));
        } finally {
            hideLoader();
            setDeadlineLoading(false);
        }
    };

    if (loading && suggestions.length === 0) {
        return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--primary)' }}>{t('pages.matching.list.loading')}</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', padding: '24px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <Typography variant="h1" style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 800 }}>
                        {t('pages.matching.list.title')}
                    </Typography>
                    <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                        {t('pages.matching.list.description')}
                    </Typography>
                </div>
                <Button
                    variant="secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                    onClick={handleCheckDeadlines}
                    disabled={deadlineLoading}
                >
                    <Timer size={16} />
                    {t('pages.matching.list.actions.checkDeadlines')}
                </Button>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder={t('placeholders.searchPairings')}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        style={{
                            width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px',
                            background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {/* List Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1.5fr 80px 1.5fr 150px 100px', gap: '20px', padding: '0 24px', marginBottom: '8px' }}>
                    <Typography variant="caption" style={{ fontWeight: 800 }}>{t('pages.matching.list.table.matchId')}</Typography>
                    <Typography variant="caption" style={{ fontWeight: 800 }}>{t('pages.matching.list.table.userA')}</Typography>
                    <Typography variant="caption" style={{ fontWeight: 800, textAlign: 'center' }}>{t('pages.matching.list.table.score')}</Typography>
                    <Typography variant="caption" style={{ fontWeight: 800 }}>{t('pages.matching.list.table.userB')}</Typography>
                    <Typography variant="caption" style={{ fontWeight: 800 }}>{t('pages.matching.list.table.deadline')}</Typography>
                    <Typography variant="caption" style={{ fontWeight: 800, textAlign: 'right' }}>{t('common.actions.action')}</Typography>
                </div>

                {currentSuggestions.map((match) => (
                    <div 
                        key={match.id}
                        onClick={() => navigate(`/matching/${match.id}`)}
                        style={{ 
                            display: 'grid',
                            gridTemplateColumns: '120px 1.5fr 80px 1.5fr 150px 100px',
                            alignItems: 'center',
                            gap: '20px',
                            padding: '16px 24px', 
                            borderRadius: '16px', 
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                        <Typography variant="caption" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                            #{match.id.slice(0, 8).toUpperCase()}
                        </Typography>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,215,0,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                                {match.user.fullName[0]}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <Typography variant="body" style={{ fontWeight: 700, fontSize: '14px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.user.fullName}</Typography>
                                <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{match.user.email}</Typography>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                display: 'inline-block',
                                padding: '4px 8px', 
                                borderRadius: '8px', 
                                background: `${getScoreColor(match.score)}15`, 
                                color: getScoreColor(match.score),
                                fontWeight: 900,
                                fontSize: '13px'
                            }}>
                                {match.score}%
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                                {match.suggested.fullName[0]}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <Typography variant="body" style={{ fontWeight: 700, fontSize: '14px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.suggested.fullName}</Typography>
                                <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{match.suggested.email}</Typography>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                            <Clock size={14} />
                            <Typography variant="body" style={{ fontSize: '13px' }}>
                                {new Date(match.decisionDeadline).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </Typography>
                        </div>

                        <div style={{ textAlign: 'right', color: 'var(--primary)' }}>
                            <ChevronRight size={20} />
                        </div>
                    </div>
                ))}

                {currentSuggestions.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', background: 'var(--surface)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
                        <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>{t('common.messages.noData')}</Typography>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
};

export default MatchingListPage;
