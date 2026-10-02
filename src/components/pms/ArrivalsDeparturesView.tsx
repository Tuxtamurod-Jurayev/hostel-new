import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation } from '../../types/hotel';
import { LogIn, LogOut, CheckCircle, AlertTriangle, CreditCard, Bed, User, Eye, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { getTodayDate } from '../../utils/dates';

interface ArrivalsDeparturesViewProps {
  initialMode: 'arrivals' | 'departures';
  onOpenFolio: (reservationId: string) => void;
  onOpenCheckIn: (reservationId: string) => void;
  onOpenCheckOut: (reservationId: string) => void;
}

export const ArrivalsDeparturesView: React.FC<ArrivalsDeparturesViewProps> = ({
  initialMode,
  onOpenFolio,
  onOpenCheckIn,
  onOpenCheckOut
}) => {
  const { reservations } = useHotel();
  const [activeSubTab, setActiveSubTab] = useState<'arrivals' | 'departures'>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');

  const today = getTodayDate();

  // Filter lists
  const arrivalsList = reservations.filter(r => 
    r.checkInDate === today && (r.status === 'confirmed' || r.status === 'pending')
  );

  const departuresList = reservations.filter(r => 
    r.checkOutDate === today && r.status === 'checked_in'
  );

  const currentList = activeSubTab === 'arrivals' ? arrivalsList : departuresList;

  const filteredList = currentList.filter(r => 
    r.guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.confirmationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.assignedRoomNumber && r.assignedRoomNumber.includes(searchQuery))
  );

  return (
    <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Top Header & Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-900)' }}>
            {activeSubTab === 'arrivals' ? "Bugun Keladigan Mehmonlar (Arrivals)" : "Bugun Chiqib Ketadigan Mehmonlar (Departures)"}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Sana: <strong>{today}</strong> • Rejalashtirilgan operatsiyalar
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--slate-100)', padding: '4px', borderRadius: 'var(--radius-lg)' }}>
          <button 
            onClick={() => setActiveSubTab('arrivals')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: activeSubTab === 'arrivals' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'arrivals' ? 'var(--navy-900)' : 'var(--slate-600)',
              boxShadow: activeSubTab === 'arrivals' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Kelishlar ({arrivalsList.length})
          </button>
          <button 
            onClick={() => setActiveSubTab('departures')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: activeSubTab === 'departures' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'departures' ? 'var(--navy-900)' : 'var(--slate-600)',
              boxShadow: activeSubTab === 'departures' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Ketishlar ({departuresList.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: '380px' }}>
        <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
        <input 
          type="text"
          placeholder="Ism, xona yoki bron kodi bo'yicha qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', paddingLeft: '2.4rem' }}
        />
      </div>

      {/* Table */}
      {filteredList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--slate-400)', background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)' }}>
          {activeSubTab === 'arrivals' ? "Bugun keladigan mehmonlar mavjud emas." : "Bugun chiqib ketadigan mehmonlar mavjud emas."}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Bron raqami</th>
                <th>Mehmon</th>
                <th>Xona toifasi</th>
                <th>Tayinlangan xona</th>
                <th>Muddat</th>
                <th>To'lov / Qarz</th>
                <th>Manba</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map(res => (
                <tr key={res.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--navy-900)', fontFamily: 'monospace' }}>
                      {res.confirmationNumber}
                    </span>
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
                    <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                      {res.roomType.name}
                    </span>
                  </td>
                  <td>
                    {res.assignedRoomNumber ? (
                      <strong style={{ color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                        #{res.assignedRoomNumber}
                      </strong>
                    ) : (
                      <span style={{ color: 'var(--status-dirty)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Tayinlanmagan
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>
                      {res.checkInDate} ➔ {res.checkOutDate}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {res.nightsCount} kecha
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
                    <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)' }}>
                      {res.source.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button 
                        onClick={() => onOpenFolio(res.id)}
                        className="btn btn-secondary btn-sm"
                        title="Mehmon hisobi va xarajatlari (Folio)"
                      >
                        <CreditCard size={14} />
                        <span>Folio</span>
                      </button>

                      {activeSubTab === 'arrivals' ? (
                        <button 
                          onClick={() => onOpenCheckIn(res.id)}
                          className="btn btn-primary btn-sm"
                        >
                          <LogIn size={14} />
                          <span>Check-in</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => onOpenCheckOut(res.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: 'var(--status-maintenance)', color: 'var(--status-maintenance)' }}
                        >
                          <LogOut size={14} />
                          <span>Check-out</span>
                        </button>
                      )}
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
