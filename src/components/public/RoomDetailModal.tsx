import React, { useState } from 'react';
import { RoomType } from '../../types/hotel';
import { X, Users, Bed, Maximize2, Check, ShieldCheck, Clock, Ban } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface RoomDetailModalProps {
  roomType: RoomType | null;
  onClose: () => void;
  onBookNow: (roomType: RoomType) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  roomType,
  onClose,
  onBookNow
}) => {
  if (!roomType) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)' }}>{roomType.name}</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', letterSpacing: '0.05em' }}>
              TOIFA KODI: {roomType.code}
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--slate-400)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Photo Gallery */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ height: '340px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <img 
                src={roomType.images[activeImageIndex] || roomType.featuredImage} 
                alt={roomType.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {roomType.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {roomType.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '70px',
                      height: '50px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid var(--gold-500)' : '2px solid transparent',
                      opacity: activeImageIndex === idx ? 1 : 0.6
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Specs */}
          <p style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {roomType.description}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            background: 'var(--slate-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            border: '1px solid var(--slate-200)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Maksimal sig'im</div>
              <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                {roomType.maxAdults} katta {roomType.maxChildren > 0 ? `+ ${roomType.maxChildren} bola` : ''}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Karavot turi</div>
              <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{roomType.bedType}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Xona maydoni</div>
              <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{roomType.sizeSqm} m²</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Asosiy narx</div>
              <div style={{ fontWeight: 800, color: 'var(--gold-600)' }}>
                {formatCurrency(roomType.basePrice)} / kecha
              </div>
            </div>
          </div>

          {/* All Amenities */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
              Xonadagi qulayliklar va jihozlar
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
              {roomType.amenities.map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--status-available-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={12} color="var(--status-available)" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Policies (Section 111-112) */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--navy-700)'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--navy-700)" />
              <span>Mehmonxona tartib-qoidalari (Policies)</span>
            </h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--slate-600)', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li><strong>Check-in:</strong> 14:00 dan boshlab (Erta kelish bo'yicha oldindan kelishuv kerak).</li>
              <li><strong>Check-out:</strong> 12:00 gacha (Kech chiqish soatiga qo'shimcha to'lov bilan amalga oshiriladi).</li>
              <li><strong>Chekish taqiqlangan:</strong> Barcha xonalar toza havo zonasiga ega (Non-smoking).</li>
              <li><strong>Bolalar:</strong> 6 yoshgacha bo'lgan 1 nafar bola mavjud karavotlarda bepul joylashadi.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Yopish
          </button>
          <button 
            onClick={() => {
              onClose();
              onBookNow(roomType);
            }} 
            className="btn btn-primary"
          >
            <span>Ushbu xonani bron qilish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
