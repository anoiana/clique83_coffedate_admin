import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Button } from '../../../shared/components';
import { matchingApi, MatchSuggestion } from '../../../features/matching/api/matchingApi';
import { Sparkles, BookOpen, Info, ArrowLeft, Zap } from 'lucide-react';

const MatchingDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [match, setMatch] = useState<MatchSuggestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<'en' | 'vn'>('vn');

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                // If backend doesn't have getById, we fetch all and find
                // But let's assume getSuggestionById works or we use a fallback
                const data = await matchingApi.getSuggestionById(id);
                setMatch(data);
            } catch (error) {
                console.error('Failed to fetch match detail:', error);
                // Fallback: fetch all and filter
                const all = await matchingApi.getSuggestions();
                const found = all.find(s => s.id === id);
                if (found) setMatch(found);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--primary)' }}>{t('pages.matching.detail.loading')}</div>;
    }
    if (!match) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>
            <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>{t('common.messages.notFound')}</Typography>
        </div>;
    }

    return (
        <div style={{ maxWidth: '1000px', padding: '24px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <Button variant="secondary" onClick={() => navigate('/matching')} style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> {t('common.actions.back')}
                </Button>
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
            </div>

            <Card style={{ padding: '40px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', marginBottom: '48px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', border: '4px solid var(--surface)', boxShadow: '0 8px 16px rgba(255,215,0,0.2)' }}>
                            <Typography style={{ color: 'var(--bg-main)', fontWeight: 900, fontSize: '32px' }}>{match.user.fullName[0]}</Typography>
                        </div>
                        <Typography variant="body" style={{ fontWeight: 800 }}>{match.user.fullName}</Typography>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.matching.detail.userLabelA')}</Typography>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(255,215,0,0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '50px', fontWeight: 900, fontSize: '20px', marginBottom: '8px' }}>
                            {match.score}%
                        </div>
                        <Zap size={24} color="var(--primary)" />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', border: '4px solid var(--surface)', boxShadow: '0 8px 16px rgba(59,130,246,0.2)' }}>
                            <Typography style={{ color: 'white', fontWeight: 900, fontSize: '32px' }}>{match.suggested.fullName[0]}</Typography>
                        </div>
                        <Typography variant="body" style={{ fontWeight: 800 }}>{match.suggested.fullName}</Typography>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{t('pages.matching.detail.userLabelB')}</Typography>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {/* User A Panel */}
                    <div style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(255,215,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Sparkles size={20} color="var(--primary)" />
                            <Typography variant="body" style={{ fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                                {t('pages.matching.detail.story.personalStoryFor', { name: match.user.fullName })}
                            </Typography>
                        </div>
                        <Typography variant="h2" style={{ fontSize: '22px', marginBottom: '20px', lineHeight: 1.4 }}>
                            "{match.aiStory.userAStory.heroIdentityLabel[lang]}"
                        </Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <Typography variant="caption" style={{ color: 'var(--primary)', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                                    {t('pages.matching.detail.story.hook')}
                                </Typography>
                                <Typography variant="body" style={{ fontStyle: 'italic', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {match.aiStory.userAStory.hook[lang]}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" style={{ color: 'var(--primary)', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                                    {t('pages.matching.detail.story.compatibilityThesis')}
                                </Typography>
                                <Typography variant="body" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                                    {match.aiStory.userAStory.thesis[lang]}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    {/* User B Panel */}
                    <div style={{ padding: '32px', borderRadius: '24px', background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Sparkles size={20} color="#3b82f6" />
                            <Typography variant="body" style={{ fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' }}>
                                {t('pages.matching.detail.story.personalStoryFor', { name: match.suggested.fullName })}
                            </Typography>
                        </div>
                        <Typography variant="h2" style={{ fontSize: '22px', marginBottom: '20px', lineHeight: 1.4 }}>
                            "{match.aiStory.userBStory.heroIdentityLabel[lang]}"
                        </Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <Typography variant="caption" style={{ color: '#3b82f6', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                                    {t('pages.matching.detail.story.hook')}
                                </Typography>
                                <Typography variant="body" style={{ fontStyle: 'italic', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {match.aiStory.userBStory.hook[lang]}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" style={{ color: '#3b82f6', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                                    {t('pages.matching.detail.story.compatibilityThesis')}
                                </Typography>
                                <Typography variant="body" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                                    {match.aiStory.userBStory.thesis[lang]}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '40px', padding: '24px', borderRadius: '20px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <BookOpen size={18} color="var(--primary)" />
                        <Typography variant="body" style={{ fontWeight: 800 }}>
                            {t('pages.matching.detail.story.complementarity')}
                        </Typography>
                    </div>
                    <Typography variant="body" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px', display: 'block' }}>
                        {match.aiStory.userAStory.complementarity[lang]}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                        <Info size={16} />
                        <Typography variant="body" style={{ fontSize: '14px', fontWeight: 600 }}>
                            {match.aiStory.userAStory.dateVisualization[lang]}
                        </Typography>
                    </div>
                </div>

                <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <Button variant="danger" style={{ minWidth: '160px', padding: '14px' }}>
                        {t('pages.matching.detail.actions.dismiss')}
                    </Button>
                    <Button variant="success" style={{ minWidth: '240px', padding: '14px', fontWeight: 800 }}>
                        {t('pages.matching.detail.actions.release')}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default MatchingDetailPage;
