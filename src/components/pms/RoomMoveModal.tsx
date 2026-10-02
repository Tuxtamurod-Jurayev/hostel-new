import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { X, ArrowRightLeft, Sparkles, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface RoomMoveModalProps {
  reservationId: string;
  onClose: () => void;
}

export const RoomMoveModal: React.FC<RoomMoveModalProps> = ({
  reservationId,
  onClose
}) => {
  const { reservations, rooms, roomTypes, assignOrChangeRoom, addFolioItem } = useHotel();
  const res = reservations.find(r => r.id === reservationId);

  const [targetRoomId, setTargetRoomId] = useState('');
  const [reason, setReason] = useState('Mehmon so\'rovi bo\'yicha');
  const [upgradePriceDifference, setUpgradePriceDifference] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!res) return null;

  // Filter available rooms that are free right now (except currently occupied by someone else)
  const availableTargetRooms = rooms.filter(r => 
    r.id !== res.roomId && 
    (r.status === 'available' || r.status === 'clean' || r.status === 'inspected')
  );

  const handleTargetRoomChange = (roomId: string) => {
    setTargetRoomId(roomId);
    const chosenRoom = rooms.find(r => r.id === roomId);
    if (!chosenRoom) {
      setUpgradePriceDifference(0);
      return;
    }

    const currentRoomType = res.roomType;
    const newRoomType = roomTypes.find(rt => rt.id === chosenRoom.roomTypeId);

    if (newRoomType && newRoomType.basePrice > currentRoomType.basePrice) {
      // Room upgrade! Calculate difference per remaining nights
      const diffPerNight = newRoomType.basePrice - currentRoomType.basePrice;
      const totalDiff = diffPerNight * res.nightsCount;
      setUpgradePriceDifference(totalDiff);
    } else {
      setUpgradePriceDifference(0);
    }
  };

  const handleConfirmMove = () => {
    setErrorMsg('');
    if (!targetRoomId) {
      setErrorMsg("Iltimos, yangi xonani tanlang!");
      return;
    }

    const result = assignOrChangeRoom(res.id, targetRoomId, reason);
    if (result.success) {
      // If upgrade price difference applies, add to folio
      if (upgradePriceDifference > 0) {
        const chosenRoom = rooms.find(r => r.id === targetRoomId);
        const newRoomType = roomTypes.find(rt => rt.id === chosenRoom?.roomTypeId);
        addFolioItem(res.id, {
          date: new Date().toISOString().slice(0, 10),
          category: 'other',
          description: `Room Upgrade: ${res.roomType.name} -> ${newRoomType?.name || 'Lyuks xona'}`,
          quantity: 1,
          unitPrice: upgradePriceDifference,
          totalPrice: upgradePriceDifference
        });
      }
      alert(`Xona muvaffaqiyatli almashtirildi!`);
      onClose();
    } else {
      setErrorMsg(result.error || "Xonani almashtirishda xatolik yuz berdi");
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
              background: 'var(--navy-900)',
              color: 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
                Xonani Ko'chirish / Upgrade Qilish
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Mehmon: {res.guest.firstName} {res.guest.lastName} • Hozirgi xona: #{res.assignedRoomNumber || 'Tayinlanmagan'}
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

          {/* Current State */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>Hozirgi joylashuv:</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--navy-900)' }}>
              Xona #{res.assignedRoomNumber || 'Biriktirilmagan'} ({res.roomType.name})
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '2px' }}>
              Tarif narxi: {formatCurrency(res.roomType.basePrice)} / kecha
            </div>
          </div>

          {/* Select New Target Room */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '4px' }}>
              Yangi bo'sh xonani tanlang *
            </label>
            <select 
              value={targetRoomId}
              onChange={(e) => handleTargetRoomChange(e.target.value)}
              style={{ width: '100%', fontWeight: 700 }}
              required
            >
              <option value="">-- Yangi xonani tanlang --</option>
              {availableTargetRooms.map(rm => {
                const rt = roomTypes.find(t => t.id === rm.roomTypeId);
                const isUpgrade = rt && rt.basePrice > res.roomType.basePrice;

                return (
                  <option key={rm.id} value={rm.id}>
                    #{rm.roomNumber} — {rt?.name} ({formatCurrency(rt?.basePrice || 0)}) {isUpgrade ? '★ UPGRADE' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* If Upgrade detected */}
          {upgradePriceDifference > 0 && (
            <div style={{
              background: 'var(--gold-100)',
              border: '1px solid var(--gold-300)',
              color: 'var(--navy-900)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem'
            }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-600)' }}>
                <Sparkles size={16} />
                <span>Xona toifasi oshirilmoqda (Upgrade)</span>
              </div>
              <div style={{ marginTop: '4px' }}>
                Xona toifalari orasidagi narx farqi ({res.nightsCount} kecha uchun): <strong>+{formatCurrency(upgradePriceDifference)}</strong> mehmonning Folio hisobiga qo'shiladi.
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '4px' }}>
              Ko'chirish sababi (Audit Log uchun) *
            </label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="Mehmon so'rovi bo'yicha">Mehmon so'rovi bo'yicha</option>
              <option value="Xona toifasini ko'tarish (Upgrade)">Xona toifasini ko'tarish (Upgrade)</option>
              <option value="Xonada texnik nosozlik aniqlandi">Xonada texnik nosozlik aniqlandi</option>
              <option value="Boshqaruv qarori (Management)">Boshqaruv qarori (Management)</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Bekor qilish
          </button>
          <button onClick={handleConfirmMove} className="btn btn-primary">
            <ArrowRightLeft size={16} />
            <span>Xonani Almashtirish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
