import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { X, LogIn, CheckCircle2, User, Bed, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CheckInModalProps {
  reservationId: string;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  reservationId,
  onClose
}) => {
  const { reservations, rooms, checkInGuest, checkAvailability } = useHotel();
  const res = reservations.find(r => r.id === reservationId);

  const [selectedRoomId, setSelectedRoomId] = useState<string>(res?.roomId || '');
  const [depositAmount, setDepositAmount] = useState<number>(res?.depositAmount || 0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!res) return null;

  // Available real rooms of this room type
  const availability = checkAvailability(res.roomTypeId, res.checkInDate, res.checkOutDate, res.id);
  const eligibleRooms = availability.availableRealRooms;

  const handleConfirmCheckIn = () => {
    setErrorMsg('');
    const targetRoomId = selectedRoomId || res.roomId;

    if (!targetRoomId) {
      setErrorMsg("Iltimos, mehmon uchun xona raqamini tanlang!");
      return;
    }

    const result = checkInGuest(res.id, targetRoomId, depositAmount);
    if (result.success) {
      alert(`Mehmon ${res.guest.firstName} ${res.guest.lastName} muvaffaqiyatli Check-in qilindi!`);
      onClose();
    } else {
      setErrorMsg(result.error || "Check-in qilishda xatolik yuz berdi");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--status-reserved)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogIn size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
                Mehmonni Check-in Qilish
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Bron: #{res.confirmationNumber}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {errorMsg && (
            <div style={{
              background: 'var(--status-maintenance-bg)',
              color: '#991b1b',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Guest Verification summary */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-900)' }}>
              {res.guest.firstName} {res.guest.lastName}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '4px' }}>
              Telefon: <strong>{res.guest.phone}</strong> • Pasport: <strong>{res.guest.passportNumber}</strong>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '2px' }}>
              Muddat: <strong>{res.checkInDate}</strong> dan <strong>{res.checkOutDate}</strong> gacha ({res.nightsCount} kecha)
            </div>
          </div>

          {/* Room Selection / Confirmation */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '4px' }}>
              Xona raqami ({res.roomType.name}) *
            </label>
            <select 
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              style={{ width: '100%', fontWeight: 700 }}
            >
              {res.roomId && (
                <option value={res.roomId}>
                  Biriktirilgan: #{res.assignedRoomNumber}
                </option>
              )}
              {eligibleRooms.map(rm => (
                <option key={rm.id} value={rm.id}>
                  #{rm.roomNumber} ({rm.floor}-qavat • {rm.housekeepingStatus.toUpperCase()})
                </option>
              ))}
            </select>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Faqat toza (Clean / Inspected) va bo'sh xonalar ro'yxatga olinadi.
            </div>
          </div>

          {/* Financial state & Deposit */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--slate-200)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <span>Jami yashash to'lovi:</span>
              <strong style={{ color: 'var(--navy-900)' }}>{formatCurrency(res.totalAmount)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <span>To'langan:</span>
              <strong style={{ color: 'var(--status-available)' }}>{formatCurrency(res.paidAmount)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderTop: '1px solid var(--slate-200)', paddingTop: '6px' }}>
              <span>Qolgan qarz:</span>
              <strong style={{ color: res.balance > 0 ? 'var(--status-maintenance)' : 'var(--status-available)' }}>
                {formatCurrency(res.balance)}
              </strong>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                Qabul qilinadigan Kafolat Depoziti (so'm, ixtiyoriy)
              </label>
              <input 
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                placeholder="200000"
                style={{ width: '100%' }}
              />
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Bekor qilish
          </button>
          <button onClick={handleConfirmCheckIn} className="btn btn-primary">
            <CheckCircle2 size={16} />
            <span>Check-in Qilish & Kalit Topshirish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
