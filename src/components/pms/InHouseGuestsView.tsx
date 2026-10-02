import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation } from '../../types/hotel';
import { Bed, Plus, CreditCard, ArrowRightLeft, LogOut, Search, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface InHouseGuestsViewProps {
  onOpenFolio: (reservationId: string) => void;
  onOpenAddService: (reservationId: string) => void;
  onOpenRoomMove: (reservationId: string) => void;
  onOpenCheckOut: (reservationId: string) => void;
}

export const InHouseGuestsView: React.FC<InHouseGuestsViewProps> = ({
  onOpenFolio,
  onOpenAddService,
  onOpenRoomMove,
  onOpenCheckOut
}) => {
  const { reservations } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');

  const inHouseGuests = reservations.filter(r => r.status === 'checked_in');

  const filteredGuests = inHouseGuests.filter(r => 
    r.guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.assignedRoomNumber && r.assignedRoomNumber.includes(searchQuery))
  );

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-900)' }}>
            Ayni Damda Yashayotgan Mehmonlar (In-House)
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Jami: <strong>{inHouseGuests.length} nafar faol mehmon</strong>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input 
            type="text"
            placeholder="Xona raqami yoki ism bo'yicha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--slate-400)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
          Hozirda yashayotgan mehmonlar mavjud emas.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Xona #</th>
                <th>Mehmon</th>
                <th>Xona toifasi</th>
                <th>Kelgan vaqti</th>
                <th>Ketish sanasi</th>
                <th>Jami xarajat</th>
                <th>Qarzdorlik</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(res => (
                <tr key={res.id}>
                  <td>
                    <span style={{
                      background: 'var(--navy-900)',
                      color: 'var(--gold-400)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      fontSize: '0.95rem'
                    }}>
                      #{res.assignedRoomNumber || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong style={{ color: 'var(--navy-900)' }}>
                        {res.guest.firstName} {res.guest.lastName}
                      </strong>
                      {res.guest.isVIP && (
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          VIP
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {res.guest.phone}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)' }}>
                      {res.roomType.name}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-700)' }}>
                      {res.checkInTime || res.checkInDate}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                      {res.checkOutDate} (12:00)
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                      {formatCurrency(res.totalAmount)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      To'langan: {formatCurrency(res.paidAmount)}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: res.balance > 0 ? 'var(--status-maintenance)' : 'var(--status-available)'
                    }}>
                      {res.balance > 0 ? formatCurrency(res.balance) : '0 so\'m (To\'liq)'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                      <button 
                        onClick={() => onOpenAddService(res.id)}
                        className="btn btn-secondary btn-sm"
                        title="Xonaga xarajat qo'shish (Minibar, kir yuvish, restoran)"
                      >
                        <Plus size={14} />
                        <span>Xizmat</span>
                      </button>

                      <button 
                        onClick={() => onOpenFolio(res.id)}
                        className="btn btn-secondary btn-sm"
                        title="Folio hisobi va to'lovlar"
                      >
                        <CreditCard size={14} />
                        <span>Folio</span>
                      </button>

                      <button 
                        onClick={() => onOpenRoomMove(res.id)}
                        className="btn btn-secondary btn-sm"
                        title="Xonani ko'chirish yoki Upgrade qilish"
                      >
                        <ArrowRightLeft size={14} />
                      </button>

                      <button 
                        onClick={() => onOpenCheckOut(res.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--status-maintenance)' }}
                        title="Check-out qilish"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
