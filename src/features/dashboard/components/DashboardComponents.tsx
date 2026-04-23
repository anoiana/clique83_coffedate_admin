import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Card } from '../../../shared/components';
import { Users, UserCheck, ShieldCheck, Heart, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { dashboardApi, DashboardAnalytics, RevenueAnalytics, DemographicData } from '../api/dashboardApi';

export const DashboardStats: React.FC = () => {
    const { t } = useTranslation();
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await dashboardApi.getAnalytics();
                setAnalytics(data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        fetchAnalytics();
    }, []);

    const stats = analytics ? [
        { label: t('pages.dashboard.stats.totalUsers'), value: analytics.totalUsers.toLocaleString(), icon: Users, color: '#FFD700', trend: '+12.5%', isUp: true },
        { label: t('pages.dashboard.stats.evaluations'), value: analytics.totalEvaluations.toLocaleString(), icon: ShieldCheck, color: '#10b981', trend: '+8.2%', isUp: true },
        { label: t('pages.dashboard.stats.members'), value: analytics.totalMembers.toLocaleString(), icon: UserCheck, color: '#3b82f6', trend: '+5.1%', isUp: true },
        { label: t('pages.dashboard.stats.activeMatches'), value: analytics.activeMatches.toLocaleString(), icon: Heart, color: '#f59e0b', trend: '+15.3%', isUp: true },
        { label: t('pages.dashboard.stats.completedDates'), value: analytics.completedDates.toLocaleString(), icon: Calendar, color: '#ec4899', trend: '+2.4%', isUp: true },
    ] : [
        { label: t('pages.dashboard.stats.totalUsers'), value: '...', icon: Users, color: '#FFD700', trend: undefined, isUp: undefined },
        { label: t('pages.dashboard.stats.evaluations'), value: '...', icon: ShieldCheck, color: '#10b981', trend: undefined, isUp: undefined },
        { label: t('pages.dashboard.stats.members'), value: '...', icon: UserCheck, color: '#3b82f6', trend: undefined, isUp: undefined },
        { label: t('pages.dashboard.stats.activeMatches'), value: '...', icon: Heart, color: '#f59e0b', trend: undefined, isUp: undefined },
        { label: t('pages.dashboard.stats.completedDates'), value: '...', icon: Calendar, color: '#ec4899', trend: undefined, isUp: undefined },
    ];

    return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {stats.map((stat, idx) => (
                <div key={idx} className="dashboard-stat-card" style={{
                    flex: 1,
                    minWidth: '200px',
                    backgroundColor: 'var(--surface)',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '1px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {/* Background glow effect */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '80px',
                        height: '80px',
                        background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                        zIndex: 0
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{
                            padding: '10px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border)',
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <stat.icon size={22} />
                        </div>
                        {stat.trend && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '20px',
                                backgroundColor: stat.isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: stat.isUp ? '#10b981' : '#ef4444',
                                fontSize: '11px',
                                fontWeight: 700
                            }}>
                                {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stat.trend}
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h2" style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                            {stat.value}
                        </Typography>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px' }}>
                            {stat.label}
                        </Typography>
                    </div>

                    <style>{`
                        .dashboard-stat-card:hover {
                            transform: translateY(-5px);
                            border-color: var(--primary);
                            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export const AnalyticsCharts: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState<RevenueAnalytics | null>(null);
    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenueAnalytics = async () => {
            setLoading(true);
            try {
                const result = await dashboardApi.getRevenueAnalytics(timeframe);
                setData(result);
            } catch (error) {
                console.error('Failed to fetch revenue analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenueAnalytics();
    }, [timeframe]);

    // Normalization logic for messy data
    const normalizedData = useMemo(() => {
        if (!data) return null;

        const normalizeGender = (items: DemographicData[]) => {
            const map: Record<string, number> = {};
            items.forEach(item => {
                let label = item.label.toUpperCase();
                if (label.includes('MALE') || label === 'NAM') label = 'Male';
                else if (label.includes('FEMALE') || label === 'NỮ') label = 'Female';
                else if (label.includes('BINARY') || label.includes('NHỊ NGUYÊN')) label = 'Non-binary';
                else label = 'Other';

                map[label] = (map[label] || 0) + item.value;
            });
            return Object.entries(map).map(([label, value]) => ({ label, value }));
        };

        const normalizeCity = (items: DemographicData[]) => {
            const map: Record<string, number> = {};
            items.forEach(item => {
                let label = item.label;
                if (label.toLowerCase().includes('hồ chí minh') || label.toLowerCase().includes('saigon')) label = 'TP. HCM';
                else if (label.toLowerCase().includes('hà nội') || label.toLowerCase().includes('hanoi')) label = 'Hà Nội';

                map[label] = (map[label] || 0) + item.value;
            });
            return Object.entries(map)
                .map(([label, value]) => ({ label, value }))
                .sort((a, b) => b.value - a.value); // Sort by most users
        };

        return {
            ...data,
            demographics: {
                ...data.demographics,
                gender: normalizeGender(data.demographics.gender),
                city: normalizeCity(data.demographics.city)
            }
        };
    }, [data]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
    };

    const COLORS = ['#FFD700', '#FF8C00', '#FF4500', '#10b981', '#3b82f6', '#8b5cf6'];

    if (loading && !data) {
        return (
            <Card>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    {t('pages.dashboard.analytics.loading') || 'Loading intelligence data...'}
                </div>
            </Card>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h2" style={{ fontSize: '20px', margin: 0, letterSpacing: '0.02em' }}>
                    {t('pages.dashboard.analytics.title')}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {t('pages.dashboard.analytics.timeframe')}
                    </Typography>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value as any)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                        <option value="day">{t('pages.dashboard.analytics.daily')}</option>
                        <option value="week">{t('pages.dashboard.analytics.weekly')}</option>
                        <option value="month">{t('pages.dashboard.analytics.monthly')}</option>
                        <option value="year">{t('pages.dashboard.analytics.yearly')}</option>
                    </select>
                </div>
            </div>

            <Card>
                <div style={{ padding: '8px 0 24px 0' }}>
                    <Typography variant="h2" style={{ fontSize: '16px', margin: '0 0 4px 0' }}>
                        {t('pages.dashboard.analytics.revenueTitle')}
                    </Typography>
                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>
                        {t('pages.dashboard.analytics.revenueDescription')}
                    </Typography>
                </div>
                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={normalizedData?.revenue || []}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                dy={10}
                            />
                            <YAxis
                                tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                            />
                            <Tooltip
                                formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']}
                                contentStyle={{
                                    background: 'var(--surface)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                    border: '1px solid var(--border)'
                                }}
                                itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#FFD700"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Card>
                        <Typography variant="h2" style={{ fontSize: '15px', marginBottom: '20px' }}>
                            {t('pages.dashboard.analytics.genderTitle')}
                        </Typography>
                        <div style={{ height: '240px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={normalizedData?.demographics.gender || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        nameKey="label"
                                        stroke="none"
                                    >
                                        {(normalizedData?.demographics.gender || []).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                        <Typography variant="h2" style={{ fontSize: '15px', marginBottom: '20px' }}>
                            {t('pages.dashboard.analytics.ageTitle')}
                        </Typography>
                        <div style={{ height: '240px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={normalizedData?.demographics.age || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        nameKey="label"
                                        stroke="none"
                                    >
                                        {(normalizedData?.demographics.age || []).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <Card>
                    <Typography variant="h2" style={{ fontSize: '15px', marginBottom: '20px' }}>
                        {t('pages.dashboard.analytics.geographicTitle')}
                    </Typography>
                    <div style={{ height: '280px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={normalizedData?.demographics.city.slice(0, 6) || []}
                                layout="vertical"
                                margin={{ left: 20, right: 30 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="label"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#FFD700"
                                    radius={[0, 6, 6, 0]}
                                    barSize={20}
                                    name={t('pages.dashboard.stats.users') || 'Active Users'}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
