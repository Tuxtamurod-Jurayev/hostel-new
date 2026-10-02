import React from 'react';
import { RoomType } from '../../types/hotel';
import { useHotel } from '../../context/HotelContext';
import { Users, Bed, Maximize2, Check, ArrowRight, Eye, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateNights } from '../../utils/dates';

interface RoomCardProps {
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  onSelectForBooking: (roomType: RoomType) => void;
  onViewDetails: (roomType: RoomType) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  roomType,
  checkInDate,
  checkOutDate,
  onSelectForBooking,
  onViewDetails
}) => {
  const { checkAvailability } = useHotel();
  const nights = calculateNights(checkInDate, checkOutDate);

  // Real-time availability check for this specific room type and date range!
  const availability = checkAvailability(roomType.id, checkInDate, checkOutDate);
  const totalStayPrice = roomType.basePrice * nights;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--slate-200)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      {/* Featured Photo with tags */}
      <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
        <img 
          src={roomType.featuredImage} 
          alt={roomType.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Code badge */}
        <span style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(7, 13, 30, 0.75)',
          color: '#ffffff',
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 700,
          backdropFilter: 'blur(6px)',
          letterSpacing: '0.05em'
        }}>
          {roomType.code}
        </span>

        {/* Live Availability Badge (Section 13) */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          {availability.isAvailable ? (
            availability.availableCount === 1 ? (
              <span className="badge" style={{ background: 'var(--status-dirty-bg)', color: '#b45309', border: '1px solid var(--status-dirty-border)' }}>
                Faqat 1 ta xona qoldi!
              </span>
            ) : (
              <span className="badge badge-available">
                ✓ {availability.availableCount} ta xona bo'sh
              </span>
            )
          ) : (
            <span className="badge badge-maintenance">
              ✕ Tanlangan sanalarga band
            </span>
          )}
        </div>

        {/* Price overlay pill */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          background: 'rgba(7, 13, 30, 0.85)',
          color: '#ffffff',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-400)' }}>
            {formatCurrency(roomType.basePrice)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-300)', marginLeft: '4px' }}>/ kecha</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
          {roomType.name}
        </h3>
        
        <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: 1.5, flex: 1 }}>
          {roomType.description}
        </p>

        {/* Specifications row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          background: 'var(--slate-50)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--slate-700)'
        }}>
          <div>
            <Users size={16} color="var(--navy-700)" style={{ margin: '0 auto 4px', display: 'block' }} />
            <span>{roomType.maxAdults} katta {roomType.maxChildren > 0 ? `+ ${roomType.maxChildren} bola` : ''}</span>
          </div>
          <div>
            <Bed size={16} color="var(--navy-700)" style={{ margin: '0 auto 4px', display: 'block' }} />
            <span>{roomType.bedType.split(' ')[0]} Karavot</span>
          </div>
          <div>
            <Maximize2 size={16} color="var(--navy-700)" style={{ margin: '0 auto 4px', display: 'block' }} />
            <span>{roomType.sizeSqm} m² kenglik</span>
          </div>
        </div>

        {/* Amenities chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {roomType.amenities.slice(0, 4).map((amenity, idx) => (
            <span key={idx} style={{
              background: 'var(--slate-100)',
              color: 'var(--slate-700)',
              fontSize: '0.74rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Check size={12} color="var(--status-available)" />
              {amenity}
            </span>
          ))}
          {roomType.amenities.length > 4 && (
            <span style={{ fontSize: '0.74rem', color: 'var(--slate-400)', alignSelf: 'center', paddingLeft: '4px' }}>
              +{roomType.amenities.length - 4} yana
            </span>
          )}
        </div>

        {/* Total calculation & Buttons */}
        <div style={{
          borderTop: '1px solid var(--slate-100)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {nights} kecha uchun jami:
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              {formatCurrency(totalStayPrice)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => onViewDetails(roomType)}
              className="btn btn-secondary btn-sm"
              title="Batafsil rasmlar va qulayliklar"
            >
              <Eye size={15} />
            </button>

            <button 
              onClick={() => onSelectForBooking(roomType)}
              disabled={!availability.isAvailable}
              className={`btn btn-sm ${availability.isAvailable ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                opacity: availability.isAvailable ? 1 : 0.5,
                cursor: availability.isAvailable ? 'pointer' : 'not-allowed'
              }}
            >
              <span>{availability.isAvailable ? 'Bron qilish' : 'Band'}</span>
              {availability.isAvailable && <ArrowRight size={14} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
