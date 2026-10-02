import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Building2, Search, Phone, CalendarCheck } from 'lucide-react';

interface PublicNavbarProps {
  onOpenCheckBooking: () => void;
  onScrollToRooms: () => void;
  onScrollToServices: () => void;
  onScrollToGallery: () => void;
  onScrollToAbout: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onOpenCheckBooking,
  onScrollToRooms,
  onScrollToServices,
  onScrollToGallery,
  onScrollToAbout
}) => {
  const { setSystemMode } = useHotel();

  return (
    <header style={{
      background: 'rgba(12, 21, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(223, 183, 70, 0.2)',
      position: 'sticky',
      top: '41px',
      zIndex: 900,
      padding: '0.9rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            background: 'linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%)',
            color: '#ffffff',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(197, 155, 39, 0.35)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              SILK ROAD PALACE
              <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', letterSpacing: '0.15em' }}>★★★★★</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', letterSpacing: '0.05em' }}>
              HOTEL & EXECUTIVE SUITES
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}
          >
            Bosh sahifa
          </button>
          <button 
            onClick={onScrollToRooms}
            style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}
          >
            Xonalar & Narxlar
          </button>
          <button 
            onClick={onScrollToServices}
            style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}
          >
            Xizmatlar
          </button>
          <button 
            onClick={onScrollToGallery}
            style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}
          >
            Galereya
          </button>
          <button 
            onClick={onScrollToAbout}
            style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}
          >
            Mehmonxona haqida
          </button>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button 
            onClick={onOpenCheckBooking}
            className="btn btn-secondary btn-sm"
            style={{ 
              background: 'rgba(255, 255, 255, 0.08)', 
              color: '#ffffff', 
              borderColor: 'rgba(255, 255, 255, 0.2)' 
            }}
          >
            <CalendarCheck size={15} color="var(--gold-400)" />
            <span>Bronni tekshirish</span>
          </button>

          <button 
            onClick={onScrollToRooms}
            className="btn btn-primary btn-sm"
          >
            <Search size={15} />
            <span>Xona Tanlash</span>
          </button>

          <button 
            onClick={() => setSystemMode('pms')}
            className="btn btn-sm"
            style={{
              background: 'rgba(223, 183, 70, 0.15)',
              color: 'var(--gold-400)',
              border: '1px solid rgba(223, 183, 70, 0.4)'
            }}
            title="Front Office / Reception xodimlari paneli"
          >
            <span>PMS Panel ➔</span>
          </button>
        </div>
      </div>
    </header>
  );
};
