import React, { useState, useEffect } from 'react';
import { Card, Typography } from '../../../shared/components';
import { dashboardApi, LifecycleStage } from '../../../features/dashboard/api/dashboardApi';
import { CheckCircle2, TrendingDown } from 'lucide-react';

const UserJourneyPage: React.FC = () => {
    const [stages, setStages] = useState<LifecycleStage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLifecycle = async () => {
            try {
                const data = await dashboardApi.getLifecycleAnalytics();
                setStages(data);
            } catch (error) {
                console.error('Failed to fetch lifecycle:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLifecycle();
    }, []);

    // Helper component for the funnel step
    const FunnelStep = ({ stage, nextValue, index }: { stage: LifecycleStage, nextValue?: number, index: number }) => {
        const dropoff = nextValue !== undefined ? (((stage.value - nextValue) / stage.value) * 100).toFixed(1) : null;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{ 
                    width: '100%', 
                    padding: '24px', 
                    background: 'var(--surface)', 
                    borderRadius: '20px', 
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                            width: '48px', height: '48px', borderRadius: '14px', 
                            background: 'rgba(255,215,0,0.1)', color: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Typography variant="h2" style={{ margin: 0, fontSize: '20px' }}>{index + 1}</Typography>
                        </div>
                        <div>
                            <Typography variant="h2" style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
                                {stage.label.replace(/_/g, ' ')}
                            </Typography>
                            <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>Lifecycle Phase</Typography>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <Typography variant="h1" style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{stage.value}</Typography>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>TOTAL USERS</Typography>
                    </div>
                </div>

                {nextValue !== undefined && (
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to bottom, var(--primary), transparent)' }} />
                        <div style={{ 
                            padding: '4px 12px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#ef4444', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' 
                        }}>
                            <TrendingDown size={12} /> {dropoff}% DROPOFF
                        </div>
                        <div style={{ width: '2px', height: '30px', background: 'linear-gradient(to top, var(--primary), transparent)' }} />
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Mapping User Journey...</div>;

    return (
        <div style={{ maxWidth: '800px', padding: '24px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <Typography variant="h1" style={{ fontSize: '32px', marginBottom: '12px', fontWeight: 800 }}>Conversion Funnel</Typography>
                <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                    Track user progression from initial lead to completed date. Identify where users are dropping off.
                </Typography>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {stages.map((stage, i) => (
                    <FunnelStep 
                        key={i} 
                        stage={stage} 
                        index={i}
                        nextValue={stages[i+1]?.value} 
                    />
                ))}
            </div>

            <Card style={{ marginTop: '40px', background: 'rgba(255,215,0,0.02)', border: '1px dashed var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,215,0,0.1)', color: 'var(--primary)' }}>
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <Typography variant="body" style={{ fontWeight: 700 }}>Funnel Optimization</Typography>
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)', display: 'block' }}>
                            Overall conversion rate from Lead to Completed: {stages.length > 0 ? ((stages[stages.length-1].value / stages[0].value) * 100).toFixed(2) : 0}%
                        </Typography>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserJourneyPage;
