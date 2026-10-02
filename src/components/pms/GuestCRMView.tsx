import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Users, Search, Sparkles, Phone, Mail, Award, History, Check } from 'lucide-react';
import { Guest } from '../../types/hotel';

export const GuestCRMView: React.FC = () => {
  const { guests, reservations } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filteredGuests = guests.filter(g => 
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.phone.includes(searchQuery) ||
    g.passportNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stays history of selected guest
  const guestReservations = selectedGuest 
    ? reservations.filter(r => r.guestId === selectedGuest.id)
    : [];

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-900)' }}>
            Mehmonlar Bazasi (Guest CRM & History)
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Doimiy mehmonlar, VIP mijozlar, pasport ma'lumotlari va shaxsiy xohish-istaklar
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input 
            type="text"
            placeholder="Ism, telefon yoki pasport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Grid of Guests and Detail drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedGuest ? '1.5fr 1fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Guests Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mehmon F.I.Sh.</th>
                <th>Telefon</th>
                <th>Pasport</th>
                <th>Fuqarolik</th>
                <th style={{ textAlign: 'center' }}>Tashriflar soni</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Profil</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(g => (
                <tr 
                  key={g.id} 
                  style={{ background: selectedGuest?.id === g.id ? 'var(--gold-100)' : '#ffffff', cursor: 'pointer' }}
                  onClick={() => setSelectedGuest(g)}
                >
                  <td>
                    <strong style={{ color: 'var(--navy-900)' }}>
                      {g.firstName} {g.lastName}
                    </strong>
                    {g.companyName && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        Kompaniya: {g.companyName}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{g.phone}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{g.passportNumber}</td>
                  <td style={{ fontSize: '0.85rem' }}>{g.nationality}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-800)', fontWeight: 700 }}>
                      {g.totalStays} marta
                    </span>
                  </td>
                  <td>
                    {g.isVIP ? (
                      <span className="badge badge-gold">VIP MEHMON</span>
                    ) : g.totalStays > 1 ? (
                      <span className="badge badge-available">REPEAT GUEST</span>
                    ) : (
                      <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-600)' }}>STANDART</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuest(g);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Tarixni ko'rish ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Guest Side Profile */}
        {selectedGuest && (
          <div style={{
            background: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
                  {selectedGuest.firstName} {selectedGuest.lastName}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Ro'yxatdan o'tgan: {selectedGuest.createdAt}
                </div>
              </div>
              <button onClick={() => setSelectedGuest(null)} style={{ color: 'var(--slate-400)' }}>
                ✕
              </button>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Jami tashriflar:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {selectedGuest.totalStays} marta
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Sodiqlik darajasi:</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedGuest.isVIP ? 'var(--gold-600)' : 'var(--status-available)' }}>
                  {selectedGuest.isVIP ? '★ VIP Gold' : 'Faol Mehmon'}
                </div>
              </div>
            </div>

            {/* Preferences (Section 64) */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                Shaxsiy preferensiyalar (Xohish-istaklar):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedGuest.preferences && selectedGuest.preferences.length > 0 ? (
                  selectedGuest.preferences.map((pref, idx) => (
                    <span key={idx} className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                      ✓ {pref}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>Qayd etilmagan</span>
                )}
              </div>
            </div>

            {/* Stays History */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
                Mehmonxonadagi yashash tarixi:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {guestReservations.map(res => (
                  <div key={res.id} style={{ background: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>#{res.confirmationNumber}</span>
                      <span className="badge badge-available" style={{ fontSize: '0.65rem' }}>{res.status}</span>
                    </div>
                    <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>
                      {res.roomType.name} (Xona: #{res.assignedRoomNumber || 'N/A'})
                    </div>
                    <div style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                      {res.checkInDate} ➔ {res.checkOutDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
