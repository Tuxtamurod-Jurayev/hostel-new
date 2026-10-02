import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  Building2, 
  UserPlus, 
  PhoneCall, 
  Coins, 
  History, 
  LogOut, 
  Globe, 
  ShieldCheck, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { getTodayDate } from '../../utils/dates';

interface PMSHeaderProps {
  onOpenNewWalkIn: () => void;
  onOpenNewPhoneBooking: () => void;
  onOpenCashRegister: () => void;
  onOpenAuditLog: () => void;
}

export const PMSHeader: React.FC<PMSHeaderProps> = ({
  onOpenNewWalkIn,
  onOpenNewPhoneBooking,
  onOpenCashRegister,
  onOpenAuditLog
}) => {
  const { 
    rooms, 
    reservations, 
    shift, 
    currentUserRole, 
    setSystemMode 
  } = useHotel();

  const today = getTodayDate();

  // Real-time metric counts
  const todayArrivals = reservations.filter(r => r.checkInDate === today && r.status === 'confirmed').length;
  const todayDepartures = reservations.filter(r => r.checkOutDate === today && r.status === 'checked_in').length;
  const inHouseCount = reservations.filter(r => r.status === 'checked_in').length;
  const availableRoomsCount = rooms.filter(r => r.status === 'available').length;
  const dirtyRoomsCount = rooms.filter(r => r.status === 'dirty' || r.housekeepingStatus === 'dirty').length;
  const maintenanceRoomsCount = rooms.filter(r => r.status === 'maintenance' || r.status === 'out_of_order').length;

  return (
    <header className="no-print" style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--slate-200)',
      padding: '0.85rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '41px',
      zIndex: 850,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left: Branding & Role badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: 'var(--navy-900)',
          color: 'var(--gold-400)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800
        }}>
          PMS
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy-900)' }}>
              SILK ROAD PALACE FRONT OFFICE
            </span>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
              v1.0 LIVE
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Operator: <strong>{shift.operatorName}</strong> ({shift.shiftName.toUpperCase()} SMENA)
          </div>
        </div>
      </div>

      {/* Center: Live PMS KPI Micro Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'var(--slate-50)',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--slate-200)'
      }}>
        <div title="Bugun keladiganlar (Arrivals)" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0 0.3rem' }}>
          <span style={{ color: 'var(--slate-500)' }}>Kelish:</span>
          <strong style={{ color: todayArrivals > 0 ? 'var(--status-reserved)' : 'var(--slate-700)' }}>
            {todayArrivals}
          </strong>
        </div>
        <span style={{ color: 'var(--slate-300)' }}>|</span>

        <div title="Bugun ketadiganlar (Departures)" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0 0.3rem' }}>
          <span style={{ color: 'var(--slate-500)' }}>Ketish:</span>
          <strong style={{ color: todayDepartures > 0 ? 'var(--status-maintenance)' : 'var(--slate-700)' }}>
            {todayDepartures}
          </strong>
        </div>
        <span style={{ color: 'var(--slate-300)' }}>|</span>

        <div title="Hozir yashayotganlar (In-House)" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0 0.3rem' }}>
          <span style={{ color: 'var(--slate-500)' }}>In-house:</span>
          <strong style={{ color: 'var(--status-occupied)' }}>{inHouseCount}</strong>
        </div>
        <span style={{ color: 'var(--slate-300)' }}>|</span>

        <div title="Bo'sh xonalar (Available)" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0 0.3rem' }}>
          <span style={{ color: 'var(--slate-500)' }}>Bo'sh:</span>
          <strong style={{ color: 'var(--status-available)' }}>{availableRoomsCount}</strong>
        </div>
        <span style={{ color: 'var(--slate-300)' }}>|</span>

        <div title="Tozalash kutilayotgan (Dirty)" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0 0.3rem' }}>
          <span style={{ color: 'var(--slate-500)' }}>Dirty:</span>
          <strong style={{ color: 'var(--status-dirty)' }}>{dirtyRoomsCount}</strong>
        </div>
      </div>

      {/* Right: Quick PMS Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <button 
          onClick={onOpenNewWalkIn}
          className="btn btn-primary btn-sm"
          title="To'g'ridan-to'g'ri kelgan mehmonni ro'yxatga olish (Check-in)"
        >
          <UserPlus size={15} />
          <span>+ Walk-in</span>
        </button>

        <button 
          onClick={onOpenNewPhoneBooking}
          className="btn btn-secondary btn-sm"
          title="Telefon orqali yangi bron kiritish"
        >
          <PhoneCall size={15} />
          <span>+ Telefon</span>
        </button>

        <button 
          onClick={onOpenCashRegister}
          className="btn btn-secondary btn-sm"
          title="Reception kassa holati va smena hisoboti"
        >
          <Coins size={15} color="var(--gold-600)" />
          <span>{formatCurrency(shift.expectedCash)}</span>
        </button>

        <button 
          onClick={onOpenAuditLog}
          className="btn btn-secondary btn-sm"
          title="Audit Log - Harakatlar tarixi"
        >
          <History size={15} />
        </button>

        <button 
          onClick={() => setSystemMode('public')}
          className="btn btn-navy btn-sm"
          title="Mehmon saytiga qaytish"
        >
          <Globe size={15} />
          <span>Mehmon Sayti</span>
        </button>
      </div>
    </header>
  );
};
