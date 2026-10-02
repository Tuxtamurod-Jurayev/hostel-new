import React from 'react';
import { 
  LayoutDashboard, 
  LogIn, 
  LogOut, 
  Bed, 
  CalendarDays, 
  BookOpen, 
  DoorOpen, 
  Sparkles, 
  Wrench, 
  Users, 
  Tag, 
  BarChart3,
  Receipt
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { getTodayDate } from '../../utils/dates';

export type PMSTab = 
  | 'dashboard'
  | 'arrivals'
  | 'departures'
  | 'in_house'
  | 'calendar'
  | 'reservations'
  | 'rooms'
  | 'housekeeping'
  | 'maintenance'
  | 'guests'
  | 'rates'
  | 'reports';

interface PMSSidebarProps {
  activeTab: PMSTab;
  onTabChange: (tab: PMSTab) => void;
}

export const PMSSidebar: React.FC<PMSSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const { reservations, rooms, housekeepingTasks, maintenanceTickets } = useHotel();
  const today = getTodayDate();

  const todayArrivals = reservations.filter(r => r.checkInDate === today && r.status === 'confirmed').length;
  const todayDepartures = reservations.filter(r => r.checkOutDate === today && r.status === 'checked_in').length;
  const inHouseCount = reservations.filter(r => r.status === 'checked_in').length;
  const dirtyRooms = rooms.filter(r => r.status === 'dirty' || r.housekeepingStatus === 'dirty').length;
  const openMaintenance = maintenanceTickets.filter(m => m.status !== 'resolved').length;

  const menuItems = [
    { id: 'dashboard' as PMSTab, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { 
      id: 'arrivals' as PMSTab, 
      label: 'Bugun kelishlar', 
      icon: <LogIn size={18} />, 
      badge: todayArrivals > 0 ? todayArrivals : undefined,
      badgeColor: 'var(--status-reserved)'
    },
    { 
      id: 'departures' as PMSTab, 
      label: 'Bugun ketishlar', 
      icon: <LogOut size={18} />, 
      badge: todayDepartures > 0 ? todayDepartures : undefined,
      badgeColor: 'var(--status-maintenance)'
    },
    { 
      id: 'in_house' as PMSTab, 
      label: 'Yashayotganlar', 
      icon: <Bed size={18} />, 
      badge: inHouseCount > 0 ? inHouseCount : undefined,
      badgeColor: 'var(--status-occupied)'
    },
    { id: 'calendar' as PMSTab, label: 'Xona Kalendari', icon: <CalendarDays size={18} /> },
    { id: 'reservations' as PMSTab, label: 'Barcha bronlar', icon: <BookOpen size={18} /> },
    { id: 'rooms' as PMSTab, label: 'Xonalar fondi', icon: <DoorOpen size={18} /> },
    { 
      id: 'housekeeping' as PMSTab, 
      label: 'Housekeeping', 
      icon: <Sparkles size={18} />, 
      badge: dirtyRooms > 0 ? dirtyRooms : undefined,
      badgeColor: 'var(--status-dirty)'
    },
    { 
      id: 'maintenance' as PMSTab, 
      label: 'Texnik xizmat', 
      icon: <Wrench size={18} />, 
      badge: openMaintenance > 0 ? openMaintenance : undefined,
      badgeColor: 'var(--status-maintenance)'
    },
    { id: 'guests' as PMSTab, label: 'Mehmonlar CRM', icon: <Users size={18} /> },
    { id: 'rates' as PMSTab, label: 'Tariflar & Promo', icon: <Tag size={18} /> },
    { id: 'reports' as PMSTab, label: 'Hisobotlar & ADR', icon: <BarChart3 size={18} /> }
  ];

  return (
    <aside className="pms-sidebar no-print" style={{
      width: '240px',
      background: 'var(--navy-950)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      minHeight: 'calc(100vh - 100px)'
    }}>
      <div style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(197, 155, 39, 0.2)' : 'transparent',
                color: isActive ? 'var(--gold-300)' : 'var(--slate-300)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.86rem',
                textAlign: 'left',
                border: isActive ? '1px solid rgba(197, 155, 39, 0.4)' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ color: isActive ? 'var(--gold-400)' : 'var(--slate-400)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span style={{
                  background: item.badgeColor || 'var(--gold-500)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini hotel system status at bottom */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(0, 0, 0, 0.2)',
        fontSize: '0.75rem',
        color: 'var(--slate-400)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Tizim holati:</span>
          <span style={{ color: 'var(--status-available)', fontWeight: 700 }}>● Online</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Yagona bazada:</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{rooms.length} xona</span>
        </div>
      </div>
    </aside>
  );
};
