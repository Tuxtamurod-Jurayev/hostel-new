import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { UserRole } from '../../types/hotel';
import { Globe, Building2, Bell, RefreshCw, Clock, ShieldCheck, User } from 'lucide-react';
import { getTodayDate } from '../../utils/dates';

export const SystemBanner: React.FC = () => {
  const { 
    systemMode, 
    setSystemMode, 
    currentUserRole, 
    setCurrentUserRole, 
    notifications, 
    unreadNotificationCount, 
    markAllNotificationsAsRead, 
    markNotificationAsRead,
    resetToDemoData 
  } = useHotel();

  const [showNotifications, setShowNotifications] = useState(false);

  const roles: { key: UserRole; label: string }[] = [
    { key: 'super_admin', label: 'Super Admin' },
    { key: 'reception', label: 'Reception / Front Desk' },
    { key: 'housekeeping', label: 'Housekeeping' },
    { key: 'accountant', label: 'Buxgalteriya' }
  ];

  const handleReset = () => {
    if (window.confirm("Barcha ma'lumotlarni boshlang'ich demo holatiga qaytarishni xohlaysizmi?")) {
      resetToDemoData();
      alert("Ma'lumotlar boshlang'ich holatga qaytarildi!");
    }
  };

  return (
    <>
      <div className="system-mode-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--gold-400)' }}>
            <Building2 size={18} />
            <span style={{ letterSpacing: '0.05em' }}>SILK ROAD PALACE</span>
          </div>

          {/* Mode Switcher */}
          <div className="mode-pills">
            <button 
              className={`mode-pill ${systemMode === 'public' ? 'active' : ''}`}
              onClick={() => setSystemMode('public')}
            >
              <Globe size={14} />
              <span>🌐 Mehmon Sayti & Online Bron</span>
            </button>
            <button 
              className={`mode-pill ${systemMode === 'pms' ? 'active' : ''}`}
              onClick={() => setSystemMode('pms')}
            >
              <Building2 size={14} />
              <span>🏨 Front Office PMS Panel</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Live Date info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-300)', fontSize: '0.8rem' }}>
            <Clock size={14} />
            <span>Toshkent: {getTodayDate()}</span>
          </div>

          {/* Role selector if in PMS */}
          {systemMode === 'pms' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-md)' }}>
              <ShieldCheck size={14} color="var(--gold-400)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--slate-300)' }}>Rol:</span>
              <select 
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '2px 4px',
                  cursor: 'pointer'
                }}
              >
                {roles.map(r => (
                  <option key={r.key} value={r.key} style={{ background: '#0c152e', color: '#fff' }}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Xabarnomalar"
            >
              <Bell size={16} />
              {unreadNotificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--status-maintenance)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '340px',
                background: '#ffffff',
                color: 'var(--slate-800)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--slate-200)',
                zIndex: 3000,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--slate-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--slate-50)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Bildirishnomalar</div>
                  {unreadNotificationCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      style={{ fontSize: '0.75rem', color: 'var(--navy-600)', fontWeight: 600 }}
                    >
                      Barchasini o'qilgan qilish
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                      Xabarnomalar yo'q
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--slate-100)',
                          background: n.isRead ? '#ffffff' : 'var(--status-reserved-bg)',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--navy-900)' }}>{n.title}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{n.timestamp}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.35 }}>{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo button */}
          <button 
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--slate-300)',
              fontSize: '0.78rem',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Barcha ma'lumotlarni qayta tiklash"
          >
            <RefreshCw size={12} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </>
  );
};
