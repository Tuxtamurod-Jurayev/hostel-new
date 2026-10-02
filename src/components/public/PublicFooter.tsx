import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Building2, Heart, ShieldCheck } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { setSystemMode } = useHotel();

  return (
    <footer style={{
      background: 'var(--navy-950)',
      color: '#ffffff',
      padding: '4rem 0 2rem',
      borderTop: '1px solid rgba(223, 183, 70, 0.2)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                SILK ROAD PALACE
              </span>
            </div>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Toshkent shahrining nufuzli markazidagi 5 yulduzli hashamatli mehmonxona. 
              Online bron qilish va yagona Front Office PMS avtomatlashtirish tizimi.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-400)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} />
              <span>Double-Booking'dan 100% kafolatlangan tizim</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.04em' }}>
              Sahifalar
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--slate-400)' }}>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Bosh sahifa</a></li>
              <li><a href="#rooms" style={{ transition: 'color 0.2s' }}>Xonalar va tariflar</a></li>
              <li><a href="#services" style={{ transition: 'color 0.2s' }}>Restoran & SPA</a></li>
              <li><a href="#gallery" style={{ transition: 'color 0.2s' }}>Galereya</a></li>
              <li><a href="#about" style={{ transition: 'color 0.2s' }}>Biz haqimizda</a></li>
            </ul>
          </div>

          {/* Room types */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.04em' }}>
              Xona toifalari
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--slate-400)' }}>
              <li>Single Deluxe (350 000 so'm)</li>
              <li>Standard Double (520 000 so'm)</li>
              <li>Deluxe King Room (780 000 so'm)</li>
              <li>Executive Suite (1 250 000 so'm)</li>
              <li>Presidential Suite (1 950 000 so'm)</li>
            </ul>
          </div>

          {/* Staff PMS direct switch */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.04em' }}>
              Xodimlar uchun
            </h4>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Reception, Housekeeping va menejerlar uchun to'liq boshqaruv tizimi.
            </p>
            <button 
              onClick={() => setSystemMode('pms')}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              <span>🏨 PMS Panelga kirish</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--slate-400)',
          gap: '1rem'
        }}>
          <div>
            © 2026 Silk Road Palace Hotel & Suites. Barcha huquqlar himoyalangan.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>To'lov tizimlari: Payme • Click • Uzum Bank • Visa • Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
