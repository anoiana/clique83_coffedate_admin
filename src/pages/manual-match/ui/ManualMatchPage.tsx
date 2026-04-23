import React, { useState, useEffect, useMemo } from 'react';
import { Card, Typography, Badge, Button } from '../../../shared/components';
import { userApi, UserSummary } from '../../../features/user/api/userApi';
import { matchingApi } from '../../../features/matching/api/matchingApi';
import { Search, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../../shared/context/LoadingContext';

const ManualMatchPage: React.FC = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [searchA, setSearchA] = useState('');
    const [searchB, setSearchB] = useState('');
    const [selectedA, setSelectedA] = useState<UserSummary | null>(null);
    const [selectedB, setSelectedB] = useState<UserSummary | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userApi.getUsers({ limit: 100 });
                setUsers(response?.users || []);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const filteredA = useMemo(() => {
        if (!searchA) return [];
        const term = searchA.toLowerCase();
        return users.filter(u => 
            (u.id?.toLowerCase().includes(term) || u.fullName?.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)) &&
            u.id !== selectedB?.id
        ).slice(0, 5);
    }, [users, searchA, selectedB]);

    const filteredB = useMemo(() => {
        if (!searchB) return [];
        const term = searchB.toLowerCase();
        return users.filter(u => 
            (u.id?.toLowerCase().includes(term) || u.fullName?.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)) &&
            u.id !== selectedA?.id
        ).slice(0, 5);
    }, [users, searchB, selectedA]);

    const handleMatch = async () => {
        if (!selectedA || !selectedB) return;
        
        showLoader('INITIATING MANUAL MATCH & AI STORY GENERATION');
        try {
            const result = await matchingApi.manualMatch(selectedA.id, selectedB.id);
            if (result.success) {
                navigate(`/matching/${result.suggestionA.id}`);
            }
        } catch (error: any) {
            alert(error.message || 'Failed to match users. Check if they meet all conditions.');
        } finally {
            hideLoader();
        }
    };

    const UserSelector = ({ 
        label, 
        search, 
        setSearch, 
        selected, 
        setSelected, 
        results 
    }: { 
        label: string, 
        search: string, 
        setSearch: (v: string) => void, 
        selected: UserSummary | null, 
        setSelected: (u: UserSummary | null) => void,
        results: UserSummary[]
    }) => (
        <Card style={{ flex: 1, position: 'relative' }}>
            <Typography variant="caption" style={{ fontWeight: 800, marginBottom: '12px', display: 'block', color: 'var(--primary)' }}>{label}</Typography>
            
            {selected ? (
                <div style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    background: 'rgba(255,215,0,0.05)', 
                    border: '1px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {selected.fullName?.[0] || 'U'}
                        </div>
                        <div>
                            <Typography variant="body" style={{ fontWeight: 700 }}>{selected.fullName || 'Unnamed'}</Typography>
                            <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{selected.email}</Typography>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => setSelected(null)} style={{ padding: '4px 8px', fontSize: '10px' }}>Change</Button>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ 
                            width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', 
                            background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-primary)',
                            fontSize: '14px'
                        }}
                    />
                    {results.length > 0 && (
                        <div style={{ 
                            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px',
                            marginTop: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden'
                        }}>
                            {results.map(u => (
                                <div 
                                    key={u.id}
                                    onClick={() => { setSelected(u); setSearch(''); }}
                                    style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,215,0,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body" style={{ fontWeight: 600, fontSize: '14px' }}>{u.fullName || 'Unnamed'}</Typography>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {u.isMember ? <Badge variant="success" style={{ fontSize: '8px' }}>MEMBER</Badge> : <Badge variant="danger" style={{ fontSize: '8px' }}>GUEST</Badge>}
                                            {u.round2Completed ? <Badge variant="info" style={{ fontSize: '8px' }}>R2 DONE</Badge> : <Badge variant="warning" style={{ fontSize: '8px' }}>R2 PENDING</Badge>}
                                        </div>
                                    </div>
                                    <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                                        {u.email} <span style={{ opacity: 0.5 }}>| ID: {u.id?.substring(0, 8)}...</span>
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selected && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {selected.isMember ? <CheckCircle size={14} color="#10b981" /> : <AlertCircle size={14} color="#ef4444" />}
                        <Typography variant="caption" style={{ color: selected.isMember ? 'var(--text-primary)' : '#ef4444' }}>Official Member Status</Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {selected.round2Completed ? <CheckCircle size={14} color="#10b981" /> : <AlertCircle size={14} color="#ef4444" />}
                        <Typography variant="caption" style={{ color: selected.round2Completed ? 'var(--text-primary)' : '#ef4444' }}>Round 2 Completion</Typography>
                    </div>
                </div>
            )}
        </Card>
    );

    return (
        <div style={{ maxWidth: '1000px', padding: '24px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <Typography variant="h1" style={{ fontSize: '32px', marginBottom: '12px', fontWeight: 800 }}>Force Manual Match</Typography>
                <Typography variant="body" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Bypass the automated engine to pair two specific users. AI will still generate their compatibility stories instantly.
                </Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <UserSelector 
                    label="FIRST USER (USER A)" 
                    search={searchA} 
                    setSearch={setSearchA} 
                    selected={selectedA} 
                    setSelected={setSelectedA} 
                    results={filteredA}
                />
                
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,215,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--primary)' }}>
                    <Zap size={24} color="var(--primary)" />
                </div>

                <UserSelector 
                    label="SECOND USER (USER B)" 
                    search={searchB} 
                    setSearch={setSearchB} 
                    selected={selectedB} 
                    setSelected={setSelectedB} 
                    results={filteredB}
                />
            </div>

            <Card style={{ background: 'rgba(255,215,0,0.02)', border: '1px solid rgba(255,215,0,0.1)', padding: '32px', textAlign: 'center' }}>
                <Typography variant="body" style={{ marginBottom: '24px', display: 'block' }}>
                    Both users must be <strong>Members</strong> and have <strong>Completed Round 2</strong> to be matched.
                </Typography>
                
                <Button 
                    variant="success" 
                    disabled={!selectedA || !selectedB || !selectedA.isMember || !selectedB.isMember || !selectedA.round2Completed || !selectedB.round2Completed}
                    onClick={handleMatch}
                    style={{ minWidth: '300px', padding: '16px', fontWeight: 800, borderRadius: '12px', fontSize: '16px' }}
                >
                    GENERATE MATCH & AI STORIES
                </Button>
            </Card>
        </div>
    );
};

export default ManualMatchPage;
