import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { RoomType, Room } from '../../types/hotel';
import { DoorOpen, Layers, Users, Bed, Maximize2, Tag, Check, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const RoomManagementView: React.FC = () => {
  const { rooms, roomTypes } = useHotel();
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('all');

  const filteredRooms = selectedRoomTypeId === 'all' 
    ? rooms 
    : rooms.filter(r => r.roomTypeId === selectedRoomTypeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Section 1: Room Types (Section 15, 91) */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)' }}>
              Xona Toifalari (Room Types & Inventar)
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Online sayt va Reception uchun asosiy tarif toifalari
            </div>
          </div>
          <span className="badge badge-gold">{roomTypes.length} ta toifa</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {roomTypes.map(rt => {
            const countRealRooms = rooms.filter(r => r.roomTypeId === rt.id).length;
            const availableCount = rooms.filter(r => r.roomTypeId === rt.id && r.status === 'available').length;

            return (
              <div 
                key={rt.id}
                style={{
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'var(--slate-50)'
                }}
              >
                <div style={{ height: '140px', position: 'relative' }}>
                  <img src={rt.featuredImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(7, 13, 30, 0.8)',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {rt.code}
                  </span>
                </div>

                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-900)', marginBottom: '4px' }}>
                    {rt.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '0.75rem' }}>
                    {rt.bedType} • {rt.sizeSqm} m²
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Asosiy narx:</div>
                      <strong style={{ color: 'var(--gold-600)', fontSize: '1rem' }}>
                        {formatCurrency(rt.basePrice)}
                      </strong>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Fizik xonalar:</div>
                      <span className="badge badge-available" style={{ fontSize: '0.75rem' }}>
                        {availableCount} / {countRealRooms} ta bo'sh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Real Physical Rooms List (Section 16, 92) */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)' }}>
              Fizik Xonalar Fondi (Real Physical Rooms)
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Mehmonxonaning barcha {rooms.length} ta real xonasi va ularning hozirgi statusi
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select 
              value={selectedRoomTypeId}
              onChange={(e) => setSelectedRoomTypeId(e.target.value)}
              style={{ minWidth: '180px' }}
            >
              <option value="all">Barcha toifalar</option>
              {roomTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Xona raqami</th>
                <th>Toifa</th>
                <th>Qavat</th>
                <th>PMS Statusi</th>
                <th>Housekeeping</th>
                <th>Hozirgi mehmon</th>
                <th>Izoh</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(rm => {
                const rt = roomTypes.find(t => t.id === rm.roomTypeId);

                return (
                  <tr key={rm.id}>
                    <td>
                      <span style={{
                        background: 'var(--navy-900)',
                        color: 'var(--gold-400)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 800,
                        fontSize: '0.95rem'
                      }}>
                        #{rm.roomNumber}
                      </span>
                    </td>
                    <td>
                      <strong>{rt?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{rt?.code}</div>
                    </td>
                    <td>{rm.floor}-qavat</td>
                    <td>
                      <span className={`badge ${
                        rm.status === 'occupied' ? 'badge-occupied' :
                        rm.status === 'reserved' ? 'badge-reserved' :
                        rm.status === 'dirty' ? 'badge-dirty' :
                        rm.status === 'cleaning' ? 'badge-cleaning' :
                        rm.status === 'maintenance' ? 'badge-maintenance' : 'badge-available'
                      }`}>
                        {rm.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: rm.housekeepingStatus === 'clean' ? 'var(--status-available-bg)' :
                                    rm.housekeepingStatus === 'inspected' ? 'var(--status-inspected-bg)' :
                                    rm.housekeepingStatus === 'cleaning' ? 'var(--status-cleaning-bg)' : 'var(--status-dirty-bg)',
                        color: rm.housekeepingStatus === 'clean' ? '#065f46' :
                               rm.housekeepingStatus === 'inspected' ? '#5b21b6' :
                               rm.housekeepingStatus === 'cleaning' ? '#0e7490' : '#92400e'
                      }}>
                        {rm.housekeepingStatus.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {rm.assignedGuestName ? (
                        <strong style={{ color: 'var(--navy-900)' }}>{rm.assignedGuestName}</strong>
                      ) : (
                        <span style={{ color: 'var(--slate-400)' }}>-</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                      {rm.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
