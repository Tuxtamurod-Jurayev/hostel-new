import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HousekeepingStatus } from '../../types/hotel';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Plus, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  DoorOpen,
  X
} from 'lucide-react';

export const HousekeepingView: React.FC = () => {
  const { 
    rooms, 
    housekeepingTasks, 
    maintenanceTickets, 
    updateRoomHousekeeping, 
    createMaintenanceTicket,
    resolveMaintenanceTicket 
  } = useHotel();

  const [activeFilter, setActiveFilter] = useState<'all' | 'dirty' | 'cleaning' | 'clean' | 'inspected'>('all');
  const [showMntModal, setShowMntModal] = useState(false);
  const [mntRoomId, setMntRoomId] = useState(rooms[0]?.id || '');
  const [mntTitle, setMntTitle] = useState('');
  const [mntDesc, setMntDesc] = useState('');
  const [mntPriority, setMntPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  // Counts
  const dirtyCount = rooms.filter(r => r.status === 'dirty' || r.housekeepingStatus === 'dirty').length;
  const cleaningCount = rooms.filter(r => r.status === 'cleaning' || r.housekeepingStatus === 'cleaning').length;
  const cleanCount = rooms.filter(r => r.housekeepingStatus === 'clean').length;
  const inspectedCount = rooms.filter(r => r.housekeepingStatus === 'inspected').length;
  const mntCount = rooms.filter(r => r.status === 'maintenance' || r.status === 'out_of_order').length;

  const filteredRooms = rooms.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dirty') return r.status === 'dirty' || r.housekeepingStatus === 'dirty';
    if (activeFilter === 'cleaning') return r.status === 'cleaning' || r.housekeepingStatus === 'cleaning';
    if (activeFilter === 'clean') return r.housekeepingStatus === 'clean';
    if (activeFilter === 'inspected') return r.housekeepingStatus === 'inspected';
    return true;
  });

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mntTitle || !mntRoomId) return;
    createMaintenanceTicket(mntRoomId, mntTitle, mntDesc, mntPriority);
    setShowMntModal(false);
    setMntTitle('');
    setMntDesc('');
    alert("Texnik xizmat arizasi muvaffaqiyatli ro'yxatga olindi!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Housekeeping KPI Counters (Section 50) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem'
      }}>
        <div 
          onClick={() => setActiveFilter('dirty')}
          style={{
            background: activeFilter === 'dirty' ? 'var(--gold-100)' : '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            borderTop: '4px solid var(--status-dirty)'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Dirty (Tozalash kerak)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-dirty)', margin: '0.25rem 0' }}>
            {dirtyCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Navbatda kutmoqda</div>
        </div>

        <div 
          onClick={() => setActiveFilter('cleaning')}
          style={{
            background: activeFilter === 'cleaning' ? 'var(--gold-100)' : '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            borderTop: '4px solid var(--status-cleaning)'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Cleaning (Jarayonda)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-cleaning)', margin: '0.25rem 0' }}>
            {cleaningCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Tozalanmoqda</div>
        </div>

        <div 
          onClick={() => setActiveFilter('clean')}
          style={{
            background: activeFilter === 'clean' ? 'var(--gold-100)' : '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            borderTop: '4px solid var(--status-available)'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Clean (Tozalangan)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-available)', margin: '0.25rem 0' }}>
            {cleanCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Tekshiruv kutilmoqda</div>
        </div>

        <div 
          onClick={() => setActiveFilter('inspected')}
          style={{
            background: activeFilter === 'inspected' ? 'var(--gold-100)' : '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            borderTop: '4px solid var(--status-inspected)'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Inspected (Tasdiqlangan)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-inspected)', margin: '0.25rem 0' }}>
            {inspectedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Sotuvga tayyor</div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--slate-200)',
          borderTop: '4px solid var(--status-maintenance)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Maintenance (Ta'mirda)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-maintenance)', margin: '0.25rem 0' }}>
            {mntCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Nosozlik qayd etilgan</div>
        </div>
      </div>

      {/* Housekeeping Action Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)' }}>
              Xonalar Tozalik Jarayoni (Room Cleaning & Inspection)
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Qoida: Dirty ➔ Cleaning ➔ Clean ➔ Inspection ➔ Available
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button 
              onClick={() => setActiveFilter('all')}
              className={`btn btn-sm ${activeFilter === 'all' ? 'btn-navy' : 'btn-secondary'}`}
            >
              Barcha xonalar ({rooms.length})
            </button>

            <button 
              onClick={() => setShowMntModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--status-maintenance)', borderColor: 'var(--status-maintenance-border)' }}
            >
              <Wrench size={14} />
              <span>+ Nosozlik Xabari (Maintenance)</span>
            </button>
          </div>
        </div>

        {/* Room Status Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredRooms.map(room => {
            const isDirty = room.status === 'dirty' || room.housekeepingStatus === 'dirty';
            const isCleaning = room.status === 'cleaning' || room.housekeepingStatus === 'cleaning';
            const isClean = room.housekeepingStatus === 'clean';
            const isInspected = room.housekeepingStatus === 'inspected';
            const isMnt = room.status === 'maintenance' || room.status === 'out_of_order';
            const isOccupied = room.status === 'occupied';

            return (
              <div 
                key={room.id}
                style={{
                  background: 'var(--slate-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--slate-200)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                {/* Room Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        background: 'var(--navy-900)',
                        color: 'var(--gold-400)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 800,
                        fontSize: '1rem'
                      }}>
                        #{room.roomNumber}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontWeight: 600 }}>
                        {room.floor}-qavat
                      </span>
                    </div>
                    {room.assignedGuestName && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--status-occupied)', fontWeight: 600, marginTop: '4px' }}>
                        Mehmon: {room.assignedGuestName}
                      </div>
                    )}
                  </div>

                  <span className={`badge ${
                    isOccupied ? 'badge-occupied' :
                    isMnt ? 'badge-maintenance' :
                    isDirty ? 'badge-dirty' :
                    isCleaning ? 'badge-cleaning' :
                    isClean ? 'badge-available' : 'badge-inspected'
                  }`}>
                    {isOccupied && 'Occupied'}
                    {isMnt && 'Maintenance'}
                    {isDirty && !isOccupied && 'Dirty'}
                    {isCleaning && !isOccupied && 'Cleaning'}
                    {isClean && !isOccupied && 'Clean'}
                    {isInspected && !isOccupied && 'Inspected (OK)'}
                  </span>
                </div>

                {/* Notes if any */}
                {room.notes && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', background: '#fff', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--slate-200)' }}>
                    📝 {room.notes}
                  </div>
                )}

                {/* Status Action Buttons */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-200)' }}>
                  {isDirty && (
                    <button 
                      onClick={() => updateRoomHousekeeping(room.id, 'cleaning')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, borderColor: 'var(--status-cleaning)', color: 'var(--status-cleaning)' }}
                    >
                      <span>Tozalash boshlandi ➔</span>
                    </button>
                  )}

                  {isCleaning && (
                    <button 
                      onClick={() => updateRoomHousekeeping(room.id, 'clean')}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Tozalandi (Clean)</span>
                    </button>
                  )}

                  {isClean && (
                    <button 
                      onClick={() => updateRoomHousekeeping(room.id, 'inspected')}
                      className="btn btn-success btn-sm"
                      style={{ flex: 1 }}
                      title="Supervisor tekshirdi va tasdiqladi"
                    >
                      <ShieldCheck size={14} />
                      <span>Supervisor Tasdiqladi (Inspected)</span>
                    </button>
                  )}

                  {isInspected && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-available)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={15} />
                      <span>Xona sotuvga to'liq tayyor</span>
                    </div>
                  )}

                  {/* Force dirty button if needed */}
                  {!isDirty && !isMnt && (
                    <button 
                      onClick={() => updateRoomHousekeeping(room.id, 'dirty')}
                      style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textDecoration: 'underline', padding: '2px 4px' }}
                      title="Qayta tozalashga yuborish"
                    >
                      Dirty qilish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance Tickets Section (Section 54) */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)' }}>
              Texnik Nosozliklar va Ta'mir Jarayoni (Maintenance Tracker)
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Xonadagi muammolar bartaraf etilguncha xona online va receptionist tomonidan sotilmaydi
            </div>
          </div>
        </div>

        {maintenanceTickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>
            Faol texnik nosozliklar yo'q. Barcha xonalar soz holatda.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Xona</th>
                  <th>Nosozlik nomi</th>
                  <th>Tavsif</th>
                  <th>Daraja (Priority)</th>
                  <th>Biriktirilgan</th>
                  <th>Sana</th>
                  <th>Holat</th>
                  <th style={{ textAlign: 'right' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>
                      <strong style={{ color: 'var(--navy-900)' }}>#{ticket.roomNumber}</strong>
                    </td>
                    <td style={{ fontWeight: 600 }}>{ticket.title}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>{ticket.description}</td>
                    <td>
                      <span className={`badge ${ticket.priority === 'high' || ticket.priority === 'critical' ? 'badge-maintenance' : 'badge-dirty'}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>{ticket.assignedTo}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{ticket.createdAt}</td>
                    <td>
                      <span className={`badge ${ticket.status === 'resolved' ? 'badge-available' : 'badge-dirty'}`}>
                        {ticket.status === 'resolved' ? 'Hal qilindi' : 'Jarayonda'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {ticket.status !== 'resolved' ? (
                        <button 
                          onClick={() => resolveMaintenanceTicket(ticket.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--status-available)', borderColor: 'var(--status-available-border)' }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Bartaraf etildi</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>Yopilgan</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Maintenance Ticket Modal */}
      {showMntModal && (
        <div className="modal-overlay" onClick={() => setShowMntModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)' }}>
                Yangi Texnik Nosozlik Qayd Etish
              </h3>
              <button onClick={() => setShowMntModal(false)} style={{ color: 'var(--slate-400)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMaintenanceSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Nosoz xonani tanlang *
                  </label>
                  <select 
                    value={mntRoomId}
                    onChange={(e) => setMntRoomId(e.target.value)}
                    style={{ width: '100%', fontWeight: 700 }}
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        #{r.roomNumber} ({r.floor}-qavat)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Nosozlik sarlavhasi *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Konditsioner sovutmayapti yoki dush kranida oqish bor"
                    value={mntTitle}
                    onChange={(e) => setMntTitle(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Muhimlik darajasi (Priority)
                  </label>
                  <select 
                    value={mntPriority}
                    onChange={(e) => setMntPriority(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="low">Oddiy (Low)</option>
                    <option value="medium">O'rta (Medium)</option>
                    <option value="high">Yuqori (High)</option>
                    <option value="critical">Shoshilinch (Critical)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Batafsil izoh
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Qo'shimcha tafsilotlar..."
                    value={mntDesc}
                    onChange={(e) => setMntDesc(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowMntModal(false)} className="btn btn-secondary">
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-danger">
                  <Wrench size={16} />
                  <span>Xonani Ta'mirga Yuborish (Bloklash)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
