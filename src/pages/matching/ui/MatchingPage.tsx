import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Badge, Button, Pagination } from '../../../shared/components';
import { matchingApi, MatchSuggestion } from '../../../features/matching/api/matchingApi';
import { Heart, Clock, Zap, Globe, Sparkles } from 'lucide-react';

const MatchingPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState<MatchSuggestion | null>(null);
    const [lang, setLang] = useState<'en' | 'vn'>('vn');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const data = await matchingApi.getSuggestions();
            setSuggestions(data);
            if (data.length > 0 && !selectedMatch) setSelectedMatch(data[0]);
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const totalPages = Math.ceil(suggestions.length / itemsPerPage);
    const currentSuggestions = useMemo(() => {
        return suggestions.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [suggestions, currentPage]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading && suggestions.length === 0) {
        return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--primary)' }}>{t('pages.matching.list.loading')}</div>;
    }

    return (
        <div style={{ maxWidth: '1400px', padding: '24px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <Typography variant="h1" style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 800 }}>
                        {t('pages.matching.detail.title')}
                    </Typography>
                    <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                        {t('pages.matching.detail.description')}
                    </Typography>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                        display: 'flex',
                        background: 'var(--surface)',
                        padding: '4px',
                        borderRadius: '10px',
                        border: '1px solid var(--border)'
                    }}>
                        <button
                            onClick={() => setLang('vn')}
                            style={{
                                padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: lang === 'vn' ? 'var(--primary)' : 'transparent',
                                color: lang === 'vn' ? 'var(--bg-main)' : 'var(--text-secondary)',
                                fontWeight: 600, fontSize: '12px'
                            }}
                        >{t('pages.matching.detail.languageToggle.vn')}</button>
                        <button
                            onClick={() => setLang('en')}
                            style={{
                                padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: lang === 'en' ? 'var(--primary)' : 'transparent',
                                color: lang === 'en' ? 'var(--bg-main)' : 'var(--text-secondary)',
                                fontWeight: 600, fontSize: '12px'
                            }}
                        >{t('pages.matching.detail.languageToggle.en')}</button>
                    </div>
                    <Button variant="secondary" onClick={fetchSuggestions} style={{ borderRadius: '10px' }}>
                        {t('pages.matching.list.actions.refresh') || 'Refresh Queue'}
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Suggestions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                        <Typography variant="caption" style={{ fontWeight: 800, letterSpacing: '1px', color: 'var(--text-secondary)' }}>
                            {t('pages.matching.list.title').toUpperCase()} ({suggestions.length})
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentSuggestions.map((match) => (
                            <div
                                key={match.id}
                                onClick={() => setSelectedMatch(match)}
                                style={{
                                    padding: '16px',
                                    borderRadius: '16px',
                                    background: selectedMatch?.id === match.id ? 'rgba(255, 215, 0, 0.08)' : 'var(--surface)',
                                    border: '1px solid',
                                    borderColor: selectedMatch?.id === match.id ? 'var(--primary)' : 'var(--border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {selectedMatch?.id === match.id && (
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--primary)' }} />
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Badge variant="info" style={{ fontSize: '10px' }}>#{match.id.slice(0, 6)}</Badge>
                                    </div>
                                    <div style={{ color: getScoreColor(match.score), fontWeight: 900, fontSize: '14px' }}>
                                        {match.score}%
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <Typography variant="body" style={{ fontWeight: 700, fontSize: '14px', display: 'block' }}>{match.user.fullName}</Typography>
                                    </div>
                                    <Zap size={14} color="var(--primary)" style={{ opacity: 0.5 }} />
                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                        <Typography variant="body" style={{ fontWeight: 700, fontSize: '14px', display: 'block' }}>{match.suggested.fullName}</Typography>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '11px' }}>
                                    <Clock size={12} />
                                    <span>{t('pages.matching.list.table.deadline')}: {formatDate(match.decisionDeadline)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', transform: 'scale(0.8)' }}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </div>

                {/* Detail View */}
                {selectedMatch ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <Card style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--surface)', boxShadow: '0 8px 16px rgba(255,215,0,0.2)' }}>
                                            <Typography style={{ color: 'var(--bg-main)', fontWeight: 900, fontSize: '24px' }}>{selectedMatch.user.fullName[0]}</Typography>
                                        </div>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-15px', border: '4px solid var(--surface)', boxShadow: '0 8px 16px rgba(59,130,246,0.2)' }}>
                                            <Typography style={{ color: 'white', fontWeight: 900, fontSize: '24px' }}>{selectedMatch.suggested.fullName[0]}</Typography>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <Typography variant="h2" style={{ margin: 0, fontSize: '24px' }}>{selectedMatch.user.fullName} & {selectedMatch.suggested.fullName}</Typography>
                                            <Badge variant="success" style={{ padding: '4px 12px' }}>{selectedMatch.score}% {t('pages.matching.list.table.score')}</Badge>
                                        </div>
                                        <Typography variant="body" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Globe size={14} /> {t('pages.matching.detail.story.title')} ({lang.toUpperCase()})
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                {/* User A Panel */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(255,215,0,0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                            <Sparkles size={18} color="var(--primary)" />
                                            <Typography variant="body" style={{ fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {t('pages.matching.detail.story.personalStoryFor', { name: selectedMatch.user.fullName })}
                                            </Typography>
                                        </div>
                                        <Typography variant="h2" style={{ fontSize: '18px', marginBottom: '12px', lineHeight: 1.4 }}>
                                            "{selectedMatch.aiStory.userAStory.heroIdentityLabel[lang]}"
                                        </Typography>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div>
                                                <Typography variant="caption" style={{ color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                                    {t('pages.matching.detail.story.hook')}
                                                </Typography>
                                                <Typography variant="body" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                                    {selectedMatch.aiStory.userAStory.hook[lang]}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption" style={{ color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                                    {t('pages.matching.detail.story.compatibilityThesis')}
                                                </Typography>
                                                <Typography variant="body">{selectedMatch.aiStory.userAStory.thesis[lang]}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption" style={{ color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                                    {t('pages.matching.detail.story.honestyCheck')}
                                                </Typography>
                                                <Typography variant="body" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    {selectedMatch.aiStory.userAStory.honestyCheck[lang]}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User B Panel */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                            <Sparkles size={18} color="#3b82f6" />
                                            <Typography variant="body" style={{ fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {t('pages.matching.detail.story.personalStoryFor', { name: selectedMatch.suggested.fullName })}
                                            </Typography>
                                        </div>
                                        <Typography variant="h2" style={{ fontSize: '18px', marginBottom: '12px', lineHeight: 1.4 }}>
                                            "{selectedMatch.aiStory.userBStory.heroIdentityLabel[lang]}"
                                        </Typography>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div>
                                                <Typography variant="caption" style={{ color: '#3b82f6', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                                    {t('pages.matching.detail.story.hook')}
                                                </Typography>
                                                <Typography variant="body" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                                    {selectedMatch.aiStory.userBStory.hook[lang]}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption" style={{ color: '#3b82f6', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                                    {t('pages.matching.detail.story.compatibilityThesis')}
                                                </Typography>
                                                <Typography variant="body">{selectedMatch.aiStory.userBStory.thesis[lang]}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption" style={{ color: '#3b82f6', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                                    {t('pages.matching.detail.story.honestyCheck')}
                                                </Typography>
                                                <Typography variant="body" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    {selectedMatch.aiStory.userBStory.honestyCheck[lang]}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                                <Button variant="secondary" style={{ borderRadius: '12px' }}>
                                    {t('pages.matching.detail.actions.regenerate')}
                                </Button>
                                <Button variant="danger" style={{ borderRadius: '12px' }}>
                                    {t('pages.matching.detail.actions.dismiss')}
                                </Button>
                                <Button variant="success" style={{ minWidth: '200px', borderRadius: '12px', fontWeight: 800 }}>
                                    {t('pages.matching.detail.actions.release')}
                                </Button>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div style={{ padding: '100px', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                        <Heart size={48} color="var(--border)" style={{ marginBottom: '16px' }} />
                        <Typography variant="h2" style={{ color: 'var(--text-secondary)' }}>
                            {t('pages.matching.detail.actions.selectPrompt')}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchingPage;
