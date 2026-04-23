import React, { useState, useEffect, useMemo } from 'react';
import { Card, Typography, Badge, Table, Button, Pagination } from '../../../shared/components';
import { matchingApi, UnmatchedRecord } from '../../../features/matching/api/matchingApi';
import { Filter, AlertTriangle, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnmatchedPage: React.FC = () => {
    const [records, setRecords] = useState<UnmatchedRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUnmatched = async () => {
            try {
                const data = await matchingApi.getUnmatched();
                setRecords(data);
            } catch (error) {
                console.error('Failed to fetch unmatched pool:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnmatched();
    }, []);

    const filteredRecords = useMemo(() => {
        return records.filter(record => 
            record.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [records, searchQuery]);

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const currentRecords = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: 'var(--primary)' }}>Scanning Unmatched Pool...</div>;

    return (
        <div style={{ maxWidth: '1400px', padding: '24px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <Typography variant="h1" style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 800 }}>Unmatched Pool</Typography>
                    <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                        Review users who couldn't be automatically matched by the engine.
                    </Typography>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        style={{ 
                            width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px', 
                            background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' 
                        }}
                    />
                </div>
            </div>

            <Card style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
                <Table headers={['User Info', 'Last Attempt', 'Steps', 'Criteria Snapshot', 'Actions']}>
                    {currentRecords.map((record) => (
                        <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body" style={{ fontWeight: 700 }}>{record.user.fullName}</Typography>
                                    <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>{record.user.email}</Typography>
                                </div>
                            </td>
                            <td style={{ padding: '20px' }}>
                                <Typography variant="body" style={{ fontSize: '14px' }}>
                                    {new Date(record.date).toLocaleDateString()}
                                </Typography>
                            </td>
                            <td style={{ padding: '20px' }}>
                                <Badge variant="info">{record.maxStepTried}</Badge>
                            </td>
                            <td style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '400px' }}>
                                    <Badge variant="secondary" style={{ fontSize: '10px' }}>{record.criteriaSnapshot.gender}</Badge>
                                    {record.criteriaSnapshot.intentGoals.map((goal, i) => (
                                        <Badge key={i} variant="info" style={{ fontSize: '10px' }}>{goal}</Badge>
                                    ))}
                                </div>
                            </td>
                            <td style={{ padding: '20px' }}>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => navigate(`/users/${record.userId}`)}
                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                    View Profile
                                </Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default UnmatchedPage;
