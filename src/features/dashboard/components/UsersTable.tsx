import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, CheckCircle, Circle } from 'lucide-react';
import { Table, Badge, Button, Pagination, Typography } from '../../../shared/components';
import { userApi, UserSummary } from '../../user/api/userApi';

export const UsersTable: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(10);

  // Sync state with URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const filter = (searchParams.get('filter') || 'ALL') as 'ALL' | 'MEMBERS' | 'NON_MEMBERS' | 'COMPLETED_ALL' | 'R1_ONLY' | 'R2_ONLY' | 'NOT_STARTED';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let isMember: boolean | undefined = undefined;
        let round1Completed: boolean | undefined = undefined;
        let round2Completed: boolean | undefined = undefined;

        // Map filter selection to specific property values
        if (filter === 'MEMBERS') isMember = true;
        if (filter === 'NON_MEMBERS') isMember = false;
        
        if (filter === 'COMPLETED_ALL') {
          round1Completed = true;
          round2Completed = true;
        } else if (filter === 'R1_ONLY') {
          round1Completed = true;
          round2Completed = false;
        } else if (filter === 'R2_ONLY') {
          round1Completed = false;
          round2Completed = true;
        } else if (filter === 'NOT_STARTED') {
          round1Completed = false;
          round2Completed = false;
          isMember = false;
        }

        console.log(`[UsersTable] Fetching: filter=${filter}, r1=${round1Completed}, r2=${round2Completed}, isMember=${isMember}, page=${currentPage}`);

        const response = await userApi.getUsers({
          search: searchQuery || undefined,
          isMember,
          round1Completed,
          round2Completed,
          page: currentPage,
          limit: itemsPerPage,
        });

        // --- FALLBACK: Client-side filtering ---
        // If Backend ignores parameters, we filter the results locally
        let processedUsers = response.users;
        
        if (filter !== 'ALL') {
          processedUsers = processedUsers.filter(u => {
            if (filter === 'MEMBERS') return u.isMember === true;
            if (filter === 'NON_MEMBERS') return u.isMember === false;
            if (filter === 'COMPLETED_ALL') return u.round1Completed && u.round2Completed;
            if (filter === 'R1_ONLY') return u.round1Completed && !u.round2Completed;
            if (filter === 'R2_ONLY') return !u.round1Completed && u.round2Completed;
            if (filter === 'NOT_STARTED') return !u.round1Completed && !u.round2Completed;
            return true;
          });
        }

        setUsers(processedUsers);
        setTotalUsers(response.total || response.users.length);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery, filter, itemsPerPage]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && users.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>{t('pages.users.list.loading')}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search 
              size={18} 
              color="var(--text-secondary)" 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              placeholder={t('placeholders.searchUser')}
              value={searchQuery}
              onChange={(e) => {
                updateParams({ search: e.target.value, page: '1' });
              }}
              style={{
                width: '100%',
                padding: '10px 16px 10px 44px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              {t('pages.users.list.filterStatus')}
            </Typography>
            <select
              value={filter}
              onChange={(e) => {
                updateParams({ filter: e.target.value, page: '1' });
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                minWidth: '200px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="ALL">{t('pages.users.list.filters.all')}</option>
              <option value="MEMBERS">{t('pages.users.list.filters.verified')}</option>
              <option value="NON_MEMBERS">{t('pages.users.list.filters.guest')}</option>
              <option value="COMPLETED_ALL">{t('pages.users.list.filters.round2Complete')}</option>
              <option value="R1_ONLY">{t('pages.users.list.filters.round1Only')}</option>
              <option value="R2_ONLY">{t('pages.users.list.filters.round2Only')}</option>
              <option value="NOT_STARTED">{t('pages.users.list.filters.notStarted')}</option>
            </select>
          </div>
        </div>
      </div>

      <Table
        headers={[
          t('pages.users.list.table.user'),
          t('pages.users.list.table.location'),
          t('pages.users.list.table.membership'),
          t('pages.users.list.table.progress'),
          t('pages.users.list.table.status'),
          t('pages.users.list.table.joinedAt'),
          t('pages.users.list.table.actions')
        ]}
      >
        {users.map((user) => (
          <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.fullName || 'Unnamed'}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</span>
              </div>
            </td>
            <td style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <MapPin size={14} />
                {user.location || t('pages.users.detail.fields.notSet')}
              </div>
            </td>
            <td style={{ padding: '16px' }}>
              <Badge variant={user.isMember ? 'success' : 'info'}>
                {user.isMember ? t('badge.member') : t('badge.guest')}
              </Badge>
            </td>
            <td style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div title="Round 1" style={{ display: 'flex', alignItems: 'center', color: user.round1Completed ? '#10b981' : 'var(--text-secondary)' }}>
                  {user.round1Completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                  <span style={{ fontSize: '10px', marginLeft: '4px' }}>{t('badge.round1')}</span>
                </div>
                <div title="Round 2" style={{ display: 'flex', alignItems: 'center', color: user.round2Completed ? '#10b981' : 'var(--text-secondary)' }}>
                  {user.round2Completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                  <span style={{ fontSize: '10px', marginLeft: '4px' }}>{t('badge.round2')}</span>
                </div>
              </div>
            </td>
            <td style={{ padding: '16px' }}>
              <Badge variant={
                user.adminStatus === 'APPROVED' ? 'success' :
                user.adminStatus === 'REJECTED' ? 'danger' :
                'warning'
              }>
                {user.adminStatus ? t(`badge.${user.adminStatus.toLowerCase()}`) : t('badge.pending')}
              </Badge>
            </td>
            <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {formatDate(user.createdAt)}
            </td>
            <td style={{ padding: '16px' }}>
              <Button
                variant="secondary"
                onClick={() => navigate(`/users/${user.id}`)}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                {t('common.actions.viewProfile')}
              </Button>
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              {t('pages.users.list.empty')}
            </td>
          </tr>
        )}
      </Table>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
