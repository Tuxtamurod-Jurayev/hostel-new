import React from 'react';
import { Calendar, Users, BedDouble, Search, Award, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateNights } from '../../utils/dates';

interface HeroSectionProps {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  childrenCount: number;
  selectedRoomTypeFilter: string;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  onAdultsChange: (val: number) => void;
  onChildrenChange: (val: number) => void;
  onRoomTypeFilterChange: (val: string) => void;
  onSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  checkInDate,
  checkOutDate,
  adults,
  childrenCount,
  selectedRoomTypeFilter,
  onCheckInChange,
  onCheckOutChange,
  onAdultsChange,
  onChildrenChange,
  onRoomTypeFilterChange,
  onSearch
}) => {
  const nights = calculateNights(checkInDate, checkOutDate);

  return (
    <section style={{
      position: 'relative',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, rgba(7, 13, 30, 0.82) 0%, rgba(12, 21, 46, 0.94) 100%), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85") center/cover no-repeat',
      color: '#ffffff',
      padding: '4rem 1.5rem 6rem'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        
        {/* Luxury Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(197, 155, 39, 0.18)',
          border: '1px solid var(--gold-400)',
          color: 'var(--gold-300)',
          padding: '0.45rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.86rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          backdropFilter: 'blur(8px)'
        }}>
          <Sparkles size={16} />
          <span>TOSHKENT MARKAZIDAGI 5 YULDUZLI HASHAMATLI HOTEL & SUITES</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          maxWidth: '920px',
          margin: '0 auto 1.25rem',
          lineHeight: 1.15
        }}>
          Sharqona Mehmondo'stlik va <span style={{ color: 'var(--gold-400)' }}>Hashamatli Qulaylik</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--slate-300)',
          maxWidth: '680px',
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}>
          Unutilmas dam olish va nufuzli biznes safari uchun yaratilgan keng xonalar, 
          panoramik shahar manzaralari va yuqori darajadagi shaxsiy xizmat.
        </p>

        {/* Online Booking Search Engine Widget (Section 10 & 12) */}
        <div style={{
          background: '#ffffff',
          color: 'var(--slate-800)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          maxWidth: '1080px',
          margin: '0 auto',
          textAlign: 'left',
          border: '1px solid rgba(223, 183, 70, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--slate-100)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--navy-900)' }}>
              <BedDouble size={18} color="var(--gold-500)" />
              <span>ONLINE BRON QILISH (REAL-TIME AVAILABILITY)</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Davomiyligi: <strong style={{ color: 'var(--navy-800)' }}>{nights} kecha</strong>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 180px',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Check-in */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Kelish sanasi (Check-in)
              </label>
              <input 
                type="date"
                value={checkInDate}
                onChange={(e) => onCheckInChange(e.target.value)}
                style={{ width: '100%', fontWeight: 600 }}
              />
            </div>

            {/* Check-out */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Ketish sanasi (Check-out)
              </label>
              <input 
                type="date"
                value={checkOutDate}
                onChange={(e) => onCheckOutChange(e.target.value)}
                style={{ width: '100%', fontWeight: 600 }}
              />
            </div>

            {/* Adults & Children */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                <Users size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Mehmonlar
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={adults}
                  onChange={(e) => onAdultsChange(Number(e.target.value))}
                  style={{ width: '60%', fontWeight: 600 }}
                >
                  <option value={1}>1 Katta</option>
                  <option value={2}>2 Katta</option>
                  <option value={3}>3 Katta</option>
                  <option value={4}>4+ Katta</option>
                </select>
                <select 
                  value={childrenCount}
                  onChange={(e) => onChildrenChange(Number(e.target.value))}
                  style={{ width: '40%', fontWeight: 600 }}
                >
                  <option value={0}>0 Bola</option>
                  <option value={1}>1 Bola</option>
                  <option value={2}>2 Bola</option>
                </select>
              </div>
            </div>

            {/* Room Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Xona toifasi
              </label>
              <select 
                value={selectedRoomTypeFilter}
                onChange={(e) => onRoomTypeFilterChange(e.target.value)}
                style={{ width: '100%', fontWeight: 600 }}
              >
                <option value="all">Barcha toifalar</option>
                <option value="rt_single">Single Deluxe</option>
                <option value="rt_double">Standard Double</option>
                <option value="rt_deluxe_king">Deluxe King</option>
                <option value="rt_suite">Executive Suite</option>
                <option value="rt_presidential">Presidential Suite</option>
              </select>
            </div>

            {/* Search Button */}
            <div>
              <button 
                onClick={onSearch}
                className="btn btn-primary"
                style={{ width: '100%', height: '44px', fontSize: '1rem' }}
              >
                <Search size={18} />
                <span>Qidirish</span>
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--slate-100)',
            fontSize: '0.8rem',
            color: 'var(--slate-500)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} color="var(--status-available)" />
              <span>Hech qanday yashirin to'lovlarsiz</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} color="var(--status-available)" />
              <span>Tezkor tasdiqlash va QR receipt</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} color="var(--status-available)" />
              <span>Double-booking'dan 100% himoya</span>
            </div>
          </div>
        </div>

        {/* Badges Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          maxWidth: '980px',
          margin: '3rem auto 0',
          textAlign: 'center'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(8px)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-400)' }}>98%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)' }}>Mamnun mehmonlar tavsiyasi</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(8px)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-400)' }}>12+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)' }}>Hashamatli suit & xonalar</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(8px)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-400)' }}>24/7</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)' }}>VIP Shaxsiy xizmat & Concierge</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(8px)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-400)' }}>Wi-Fi 6</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)' }}>Yuqori tezlikdagi bepul internet</div>
          </div>
        </div>

      </div>
    </section>
  );
};
