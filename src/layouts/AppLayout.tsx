import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, LogOut, Heart, SearchX, UserPlus, BarChart3, Rocket, ClipboardCheck, Calendar, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { Button, Typography } from '../shared/components';
import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';

export const AppLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [usersMenuOpen, setUsersMenuOpen] = useState(
    location.pathname.startsWith('/users') ||
    location.pathname === '/pending-profiles' ||
    location.pathname === '/user-journey'
  );

  const navItems = [
    { path: '/dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard },
    {
      label: t('navigation.users'),
      icon: Users,
      isSubmenu: true,
      isOpen: usersMenuOpen,
      toggle: () => setUsersMenuOpen(!usersMenuOpen),
      subItems: [
        { path: '/user-journey', label: t('navigation.userJourney'), icon: Rocket },
        { path: '/users', label: t('navigation.userManagement'), icon: Users },
        { path: '/pending-profiles', label: t('navigation.pendingProfiles'), icon: ClipboardCheck },
      ]
    },
    { path: '/demographics', label: t('navigation.demographics'), icon: BarChart3 },
    { path: '/matching', label: t('navigation.matching'), icon: Heart },
    { path: '/unmatched', label: t('navigation.unmatched'), icon: SearchX },
    { path: '/manual-match', label: t('navigation.manualMatch'), icon: UserPlus },
    { path: '/meetings', label: t('navigation.meetings'), icon: Calendar },
    { path: '/locations', label: t('navigation.locations'), icon: MapPin },
  ];

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return t('pages.dashboard.title');
    if (location.pathname === '/user-journey') return t('navigation.userJourney');
    if (location.pathname.startsWith('/users') && location.pathname !== '/users') {
      if (location.pathname.includes('/user-journey')) return t('navigation.userJourney');
      return t('navigation.userManagement');
    }
    if (location.pathname === '/pending-profiles') return t('navigation.pendingProfiles');
    if (location.pathname === '/demographics') return t('navigation.demographics');
    if (location.pathname.startsWith('/matching')) return t('navigation.matchingEngine');
    if (location.pathname === '/unmatched') return t('navigation.unmatchedPool');
    if (location.pathname === '/manual-match') return t('navigation.forceManualMatch');
    if (location.pathname === '/meetings') return t('navigation.meetingsManagement');
    if (location.pathname === '/locations') return t('navigation.meetingLocations');
    return t('app.title');
  };

  const isUserRoute = location.pathname.startsWith('/users') ||
                      location.pathname === '/pending-profiles' ||
                      location.pathname === '/user-journey';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 50
      }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255, 215, 0, 0.1)' }} />
              <div style={{ position: 'absolute', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid rgba(255, 215, 0, 0.2)' }} />
              <div style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 800, marginTop: '-1px' }}>C</span>
              </div>
            </div>
            <Typography variant="h2" style={{ color: 'var(--primary)', margin: 0, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '22px' }}>
              Clique83
            </Typography>
          </div>
          <Typography variant="caption" style={{color: 'var(--text-secondary)', marginLeft: '4px'}}>
            {t('layout.sidebar.brandSubtitle')}
          </Typography>
        </div>

        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            if (item.isSubmenu) {
              const isActive = item.subItems?.some(si => location.pathname === si.path || (si.path === '/users' && location.pathname.startsWith('/users')));
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    onClick={item.toggle}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <item.icon size={20} />
                      {item.label}
                    </div>
                    {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>

                  {item.isOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '12px', marginBottom: '8px' }}>
                      {item.subItems?.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          style={({ isActive }) => ({
                            textDecoration: 'none',
                            padding: '10px 16px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                            backgroundColor: isActive ? 'rgba(255, 215, 0, 0.08)' : 'transparent',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          })}
                        >
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: location.pathname === subItem.path || (subItem.path === '/users' && location.pathname.startsWith('/users')) ? 'var(--primary)' : 'transparent' }} />
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path || item.label}
                to={item.path || '#'}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: isActive ? '0 4px 20px rgba(255, 215, 0, 0.2)' : 'none'
                })}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
             <Typography variant="caption" style={{color: 'var(--text-secondary)', fontSize: '11px'}}>
              {t('app.version')}
            </Typography>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{
          height: '80px',
          backgroundColor: 'rgba(9, 9, 11, 0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <Typography variant="h2" style={{ margin: 0 }}>{getPageTitle()}</Typography>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <LanguageSwitcher />
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-inverse)', fontWeight: 'bold'}}>
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body" style={{ fontWeight: 600, fontSize: '14px' }}>
                  {t('layout.header.adminLabel')}
                </Typography>
                <Typography variant="caption" style={{ fontSize: '11px' }}>
                  {t('layout.header.status')}
                </Typography>
              </div>
            </div>
            <Button variant="secondary" onClick={() => {
              localStorage.removeItem('isAuth');
              localStorage.removeItem('adminId');
              localStorage.removeItem('adminSecret');
              navigate('/login');
            }} style={{padding: '8px 16px', fontSize: '13px', gap: '8px'}}>
              <LogOut size={16} />
              {t('layout.header.logout')}
            </Button>
          </div>
        </header>

        {/* Page Body */}
        <main style={{ flex: 1, overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
