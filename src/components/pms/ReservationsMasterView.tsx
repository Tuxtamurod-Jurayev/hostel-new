import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation, ReservationStatus, ReservationSource } from '../../types/hotel';
import { 
  Search, 
  Filter, 
  CreditCard, 
  LogIn, 
  LogOut, 
  Ban, 
  UserX, 
  Printer, 
  ArrowRightLeft,
  Calendar,
  Building2,
  Globe
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ReservationsMasterViewProps {
  onOpenFolio: (reservationId: string) => void;
  onOpenCheckIn: (reservationId: string) => void;
  onOpenCheckOut: (reservationId: string) => void;
  onOpenRoomMove: (reservationId: string) => void;
  onPrintInvoice: (reservationId: string) => void;
}

export const ReservationsMasterView: React.FC<ReservationsMasterViewProps> = ({
  onOpenFolio,
  onOpenCheckIn,
  onOpenCheckOut,
  onOpenRoomMove,
  onPrintInvoice
}) => {
  const { reservations, cancelReservation, markAsNoShow } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filteredReservations = reservations.filter(r => {
    // Status match
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    // Source match
    if (sourceFilter !== 'all' && r.source !== sourceFilter) return false;
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${r.guest.firstName} ${r.guest.lastName}`.toLowerCase().includes(q);
      const matchCode = r.confirmationNumber.toLowerCase().includes(q);
      const matchPhone = r.guest.phone.includes(q);
      const matchRoom = r.assignedRoomNumber?.includes(q);
      return matchName || matchCode || matchPhone || matchRoom;
    }
    return true;
  });

  const handleCancelClick = (res: Reservation) => {
    const reason = prompt("Bronni bekor qilish sababini kiriting:", "Mijoz so'rovi");
    if (reason) {
      cancelReservation(res.id, reason);
    }
  };

  const handleNoShowClick = (res: Reservation) => {
    if (confirm(`${res.guest.firstName} ${res.guest.lastName} kelmadi deb belgilansinmi (No-show)?`)) {
      markAsNoShow(res.id);
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-900)' }}>
            Yagona Bronlar Bazasi (Unified Reservations Master)
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Sayt, Reception, Walk-in va telefon orqali kiritilgan barcha bronlar ro'yxati
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
          Jami topildi: <strong>{filteredReservations.length} ta bron</strong>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: 'var(--slate-50)',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--slate-200)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input 
            type="text"
            placeholder="Ism, telefon, xona yoki tasdiqlash raqami..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Status Filter */}
        <div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="all">Barcha statuslar</option>
            <option value="confirmed">Tasdiqlangan (Confirmed)</option>
            <option value="checked_in">Yashamoqda (Checked-in)</option>
            <option value="checked_out">Yakunlangan (Checked-out)</option>
            <option value="cancelled">Bekor qilingan (Cancelled)</option>
            <option value="no_show">Kelmadi (No-show)</option>
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="all">Barcha manbalar</option>
            <option value="website">🌐 Online Website</option>
            <option value="reception">🏨 Reception</option>
            <option value="walk_in">🚶 Walk-in</option>
            <option value="phone">📞 Telefon</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredReservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--slate-400)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
          Kiritilgan shartlarga mos bronlar topilmadi.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Bron raqami</th>
                <th>Mehmon</th>
                <th>Xona toifasi / #</th>
                <th>Sanalar</th>
                <th>Summa / Qarz</th>
                <th>Holat</th>
                <th>Manba</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(res => {
                const isOnline = res.source === 'website';

                return (
                  <tr key={res.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--navy-900)', fontFamily: 'monospace' }}>
                        {res.confirmationNumber}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                        {res.createdAt}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                        {res.guest.firstName} {res.guest.lastName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {res.guest.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{res.roomType.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--navy-800)', fontWeight: 700 }}>
                        {res.assignedRoomNumber ? `#${res.assignedRoomNumber}` : <span style={{ color: 'var(--status-dirty)', fontStyle: 'italic' }}>Xona biriktirilmagan</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        {res.checkInDate} ➔ {res.checkOutDate}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {res.nightsCount} kecha • {res.adults} k. {res.children > 0 ? `+ ${res.children} b.` : ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                        {formatCurrency(res.totalAmount)}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: res.balance > 0 ? 'var(--status-maintenance)' : 'var(--status-available)' }}>
                        {res.balance > 0 ? `Qarz: ${formatCurrency(res.balance)}` : 'To\'liq to\'langan'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        res.status === 'confirmed' ? 'badge-reserved' :
                        res.status === 'checked_in' ? 'badge-occupied' :
                        res.status === 'checked_out' ? 'badge-available' :
                        res.status === 'cancelled' ? 'badge-maintenance' : 'badge-dirty'
                      }`}>
                        {res.status === 'confirmed' && 'Tasdiqlangan'}
                        {res.status === 'checked_in' && 'Yashamoqda'}
                        {res.status === 'checked_out' && 'Yakunlangan'}
                        {res.status === 'cancelled' && 'Bekor qilingan'}
                        {res.status === 'no_show' && 'Kelmadi'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: isOnline ? '#0369a1' : 'var(--slate-700)'
                      }}>
                        {isOnline ? <Globe size={13} color="var(--gold-600)" /> : <Building2 size={13} />}
                        <span>{res.source.toUpperCase()}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button 
                          onClick={() => onOpenFolio(res.id)}
                          className="btn btn-secondary btn-sm"
                          title="Folio hisobi"
                        >
                          <CreditCard size={14} />
                        </button>

                        <button 
                          onClick={() => onPrintInvoice(res.id)}
                          className="btn btn-secondary btn-sm"
                          title="Invoys / Chekni ko'rish va chop etish"
                        >
                          <Printer size={14} />
                        </button>

                        {res.status === 'confirmed' && (
                          <>
                            <button 
                              onClick={() => onOpenCheckIn(res.id)}
                              className="btn btn-primary btn-sm"
                              title="Check-in qilish"
                            >
                              <LogIn size={14} />
                            </button>
                            <button 
                              onClick={() => onOpenRoomMove(res.id)}
                              className="btn btn-secondary btn-sm"
                              title="Xona biriktirish yoki almashtirish"
                            >
                              <ArrowRightLeft size={14} />
                            </button>
                            <button 
                              onClick={() => handleCancelClick(res)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--status-maintenance)' }}
                              title="Bekor qilish"
                            >
                              <Ban size={14} />
                            </button>
                            <button 
                              onClick={() => handleNoShowClick(res)}
                              className="btn btn-secondary btn-sm"
                              title="Kelmadi (No-show)"
                            >
                              <UserX size={14} />
                            </button>
                          </>
                        )}

                        {res.status === 'checked_in' && (
                          <>
                            <button 
                              onClick={() => onOpenRoomMove(res.id)}
                              className="btn btn-secondary btn-sm"
                              title="Xonani ko'chirish / Upgrade"
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
