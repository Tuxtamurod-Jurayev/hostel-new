import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { PMSTab } from './PMSSidebar';
import { 
  LogIn, 
  LogOut, 
  Bed, 
  DoorOpen, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Plus
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { getTodayDate } from '../../utils/dates';

interface FrontOfficeDashboardProps {
  onNavigateTab: (tab: PMSTab) => void;
  onOpenCheckInModal: (reservationId: string) => void;
  onOpenCheckOutModal: (reservationId: string) => void;
  onOpenNewWalkIn: () => void;
}

export const FrontOfficeDashboard: React.FC<FrontOfficeDashboardProps> = ({
  onNavigateTab,
  onOpenCheckInModal,
  onOpenCheckOutModal,
  onOpenNewWalkIn
}) => {
  const { rooms, reservations, folios } = useHotel();
  const today = getTodayDate();

  // Metrics
  const todayArrivalsList = reservations.filter(r => r.checkInDate === today && r.status === 'confirmed');
  const todayDeparturesList = reservations.filter(r => r.checkOutDate === today && r.status === 'checked_in');
  const inHouseList = reservations.filter(r => r.status === 'checked_in');
  const availableRooms = rooms.filter(r => r.status === 'available');
  const dirtyRooms = rooms.filter(r => r.status === 'dirty' || r.housekeepingStatus === 'dirty');
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance' || r.status === 'out_of_order');

  // Total unpaid folio balance in hotel
  const unpaidFolios = folios.filter(f => f.balance > 0);
  const totalUnpaidBalance = unpaidFolios.reduce((sum, f) => sum + f.balance, 0);

  // Occupancy % calculation: in-house / total rooms * 100
  const occupancyPercent = rooms.length > 0 ? Math.round((inHouseList.length / rooms.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Welcome & Quick Action Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)',
        color: '#ffffff',
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: 700, letterSpacing: '0.05em' }}>
            FRONT OFFICE RECEPTION DESK
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '4px' }}>
            Bugungi navbatchilik va asosiy ko'rsatkichlar
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-300)', marginTop: '4px' }}>
            Sana: {today} • Barcha online va reception bronlari yagona inventarda sinxronlashgan.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={onOpenNewWalkIn}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Walk-in Mehmon Joylashtirish</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Section 56) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Arrivals */}
        <div 
          onClick={() => onNavigateTab('arrivals')}
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderTop: '4px solid var(--status-reserved)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Bugun kelishlar</span>
            <LogIn size={16} color="var(--status-reserved)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.35rem 0' }}>
            {todayArrivalsList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Check-in kutilmoqda ➔
          </div>
        </div>

        {/* Departures */}
        <div 
          onClick={() => onNavigateTab('departures')}
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderTop: '4px solid var(--status-maintenance)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Bugun ketishlar</span>
            <LogOut size={16} color="var(--status-maintenance)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.35rem 0' }}>
            {todayDeparturesList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Check-out qilish lozim ➔
          </div>
        </div>

        {/* In-House */}
        <div 
          onClick={() => onNavigateTab('in_house')}
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderTop: '4px solid var(--status-occupied)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Yashayotganlar</span>
            <Bed size={16} color="var(--status-occupied)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.35rem 0' }}>
            {inHouseList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Bandlik: <strong>{occupancyPercent}%</strong>
          </div>
        </div>

        {/* Available Rooms */}
        <div 
          onClick={() => onNavigateTab('rooms')}
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderTop: '4px solid var(--status-available)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Bo'sh toza xonalar</span>
            <DoorOpen size={16} color="var(--status-available)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-available)', margin: '0.35rem 0' }}>
            {availableRooms.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Sotuvga tayyor xonalar
          </div>
        </div>

        {/* Dirty Rooms */}
        <div 
          onClick={() => onNavigateTab('housekeeping')}
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderTop: '4px solid var(--status-dirty)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Tozalash kutilmoqda</span>
            <Sparkles size={16} color="var(--status-dirty)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-dirty)', margin: '0.35rem 0' }}>
            {dirtyRooms.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Housekeeping navbatida ➔
          </div>
        </div>

        {/* Unpaid Balance */}
        <div 
          onClick={() => onNavigateTab('in_house')}
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderTop: '4px solid var(--gold-500)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>To'lanmagan qarzdorlik</span>
            <AlertTriangle size={16} color="var(--gold-500)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.65rem 0' }}>
            {formatCurrency(totalUnpaidBalance)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            {unpaidFolios.length} ta ochiq folio
          </div>
        </div>
      </div>

      {/* Two columns: Immediate Arrivals Queue & Immediate Departures Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Arrivals Queue */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogIn size={18} color="var(--status-reserved)" />
                <span>Bugungi Kelishlar (Arrivals)</span>
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Ro'yxatdan o'tish va xona berish (Check-in)
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab('arrivals')} 
              style={{ fontSize: '0.82rem', color: 'var(--navy-600)', fontWeight: 600 }}
            >
              Barchasi ➔
            </button>
          </div>

          {todayArrivalsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)', fontSize: '0.88rem' }}>
              Bugun boshqa kelishlar kutilmayapti.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {todayArrivalsList.map(res => (
                <div 
                  key={res.id}
                  style={{
                    background: 'var(--slate-50)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                      {res.guest.firstName} {res.guest.lastName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                      Xona toifasi: <strong>{res.roomType.name}</strong> • Xona: <strong style={{ color: 'var(--navy-800)' }}>{res.assignedRoomNumber || 'Tayinlanmagan'}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      Manba: {res.source.toUpperCase()} • Qarz: {formatCurrency(res.balance)}
                    </div>
                  </div>

                  <button 
                    onClick={() => onOpenCheckInModal(res.id)}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle size={14} />
                    <span>Check-in</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departures Queue */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={18} color="var(--status-maintenance)" />
                <span>Bugungi Ketishlar (Departures)</span>
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Hisobni yopish va xonani bo'shatish (Check-out)
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab('departures')} 
              style={{ fontSize: '0.82rem', color: 'var(--navy-600)', fontWeight: 600 }}
            >
              Barchasi ➔
            </button>
          </div>

          {todayDeparturesList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)', fontSize: '0.88rem' }}>
              Bugun chiqib ketadigan mehmonlar yo'q.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {todayDeparturesList.map(res => (
                <div 
                  key={res.id}
                  style={{
                    background: 'var(--slate-50)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
                      {res.guest.firstName} {res.guest.lastName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                      Xona: <strong style={{ color: 'var(--navy-800)' }}>#{res.assignedRoomNumber}</strong> ({res.roomType.name})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: res.balance > 0 ? 'var(--status-maintenance)' : 'var(--status-available)', fontWeight: 600, marginTop: '2px' }}>
                      {res.balance > 0 ? `Qarzdorlik mavjud: ${formatCurrency(res.balance)}` : 'Hisob to\'liq to\'langan (0 so\'m)'}
                    </div>
                  </div>

                  <button 
                    onClick={() => onOpenCheckOutModal(res.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'var(--slate-300)' }}
                  >
                    <LogOut size={14} />
                    <span>Check-out</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Room Status Matrix Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)' }}>
            Xonalar fondi holati (Jami {rooms.length} ta xona)
          </h3>
          <button 
            onClick={() => onNavigateTab('calendar')}
            className="btn btn-secondary btn-sm"
          >
            <span>Kalendar ko'rinishi (Tape Chart) ➔</span>
          </button>
        </div>

        {/* Mini Room Number Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.65rem' }}>
          {rooms.map(room => {
            const isOcc = room.status === 'occupied';
            const isRes = room.status === 'reserved';
            const isDirty = room.status === 'dirty' || room.housekeepingStatus === 'dirty';
            const isCleaning = room.status === 'cleaning' || room.housekeepingStatus === 'cleaning';
            const isMnt = room.status === 'maintenance' || room.status === 'out_of_order';
            const isAvail = room.status === 'available';

            return (
              <div 
                key={room.id}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  background: 
                    isOcc ? 'var(--status-occupied-bg)' :
                    isRes ? 'var(--status-reserved-bg)' :
                    isDirty ? 'var(--status-dirty-bg)' :
                    isCleaning ? 'var(--status-cleaning-bg)' :
                    isMnt ? 'var(--status-maintenance-bg)' : 'var(--status-available-bg)',
                  border: `1px solid ${
                    isOcc ? 'var(--status-occupied-border)' :
                    isRes ? 'var(--status-reserved-border)' :
                    isDirty ? 'var(--status-dirty-border)' :
                    isCleaning ? 'var(--status-cleaning-border)' :
                    isMnt ? 'var(--status-maintenance-border)' : 'var(--status-available-border)'
                  }`
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  #{room.roomNumber}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px', color: 
                  isOcc ? '#3730a3' :
                  isRes ? '#0369a1' :
                  isDirty ? '#92400e' :
                  isCleaning ? '#0e7490' :
                  isMnt ? '#991b1b' : '#065f46'
                }}>
                  {isOcc && 'Band'}
                  {isRes && 'Bron'}
                  {isDirty && 'Dirty'}
                  {isCleaning && 'Tozalanmoqda'}
                  {isMnt && "Ta'mirda"}
                  {isAvail && 'Bo\'sh'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
