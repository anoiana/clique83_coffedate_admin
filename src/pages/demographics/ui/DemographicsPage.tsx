import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Badge, Table } from '../../../shared/components';
import { dashboardApi, RevenueAnalytics } from '../../../features/dashboard/api/dashboardApi';
import { MapPin } from 'lucide-react';

const DemographicsPage: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<RevenueAnalytics | null>(null);
    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [loading, setLoading] = useState(true);

    const fetchDemographics = async () => {
        setLoading(true);
        try {
            const result = await dashboardApi.getRevenueAnalytics(timeframe);
            setData(result);
        } catch (error) {
            console.error('Failed to fetch demographics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemographics();
    }, [timeframe]);

    // Sorting logic for tables
    const sortedCities = useMemo(() => 
        [...(data?.demographics.city || [])].sort((a, b) => b.value - a.value), 
    [data]);

    const sortedGenders = useMemo(() => 
        [...(data?.demographics.gender || [])].sort((a, b) => b.value - a.value), 
    [data]);

    if (loading && !data) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>{t('pages.demographics.loading')}</div>;
    }

    return (
        <div style={{ maxWidth: '1400px', padding: '24px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <Typography variant="h1" style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 800 }}>
                        {t('pages.demographics.title')}
                    </Typography>
                    <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                        {t('pages.demographics.description')}
                    </Typography>
                </div>
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    style={{
                        background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)',
                        borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    <option value="day">{t('pages.demographics.dailyJoiners')}</option>
                    <option value="week">{t('pages.demographics.weeklyJoiners')}</option>
                    <option value="month">{t('pages.demographics.monthlyJoiners')}</option>
                    <option value="year">{t('pages.demographics.yearlyJoiners')}</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                
                {/* Left Column: Gender & Age */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Card title={t('pages.demographics.genderTitle')}>
                        <Table headers={[t('pages.demographics.identityLabel'), t('pages.demographics.count'), t('pages.demographics.percentage')]}>
                            {sortedGenders.map((item, i) => {
                                const total = sortedGenders.reduce((sum, current) => sum + current.value, 0);
                                const percentage = ((item.value / total) * 100).toFixed(1);
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px' }}>
                                            <Typography variant="body" style={{ fontWeight: 600, fontSize: '13px' }}>{item.label}</Typography>
                                        </td>
                                        <td style={{ padding: '12px' }}>{item.value}</td>
                                        <td style={{ padding: '12px' }}>
                                            <Badge variant="info">{percentage}%</Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </Card>

                    <Card title={t('pages.demographics.ageTitle')}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {data?.demographics.age.map((item, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <Typography variant="body" style={{ fontWeight: 600 }}>
                                            {t('pages.demographics.ageYears', { age: item.label })}
                                        </Typography>
                                        <Typography variant="body">
                                            {item.value} {t('pages.demographics.userCount', { count: item.value })}
                                        </Typography>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(item.value / (data.demographics.age.reduce((a,b)=>a+b.value, 0) || 1)) * 100}%`,
                                            height: '100%',
                                            background: 'var(--primary)',
                                            transition: 'width 1s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Full City List */}
                <Card title={t('pages.demographics.geoTitle')}>
                    <Table headers={[t('pages.demographics.cityLocation'), t('pages.demographics.userCount'), t('pages.demographics.marketShare')]}>
                        {sortedCities.map((item, i) => {
                            const total = sortedCities.reduce((sum, current) => sum + current.value, 0);
                            const percentage = ((item.value / total) * 100).toFixed(1);
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MapPin size={14} color="var(--primary)" />
                                            <Typography variant="body" style={{ fontWeight: 600 }}>{item.label}</Typography>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px' }}>{item.value}</td>
                                    <td style={{ padding: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '60px', height: '4px', background: 'var(--bg-main)', borderRadius: '2px' }}>
                                                <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)' }} />
                                            </div>
                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{percentage}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </Card>

            </div>
        </div>
    );
};

export default DemographicsPage;
