import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { PaymentMethod } from '../../types/hotel';
import { X, LogOut, CheckCircle2, AlertTriangle, CreditCard, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CheckOutModalProps {
  reservationId: string;
  onClose: () => void;
  onOpenFolio: (resId: string) => void;
}

export const CheckOutModal: React.FC<CheckOutModalProps> = ({
  reservationId,
  onClose,
  onOpenFolio
}) => {
  const { reservations, folios, checkOutGuest, addPayment } = useHotel();
  const res = reservations.find(r => r.id === reservationId);
  const folio = folios.find(f => f.reservationId === reservationId);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [errorMsg, setErrorMsg] = useState('');

  if (!res) return null;

  const remainingBalance = folio ? folio.balance : res.balance;

  const handleSettleBalance = () => {
    if (remainingBalance > 0) {
      addPayment(res.id, remainingBalance, paymentMethod, 'Check-out paytidagi yakuniy hisob-kitob');
    }
  };

  const handleConfirmCheckOut = () => {
    setErrorMsg('');
    const result = checkOutGuest(res.id);
    if (result.success) {
      alert(`Mehmon ${res.guest.firstName} ${res.guest.lastName} muvaffaqiyatli Check-out qilindi!\n\n#${res.assignedRoomNumber}-xona tozalash (Housekeeping Dirty) holatiga o'tkazildi.`);
      onClose();
    } else {
      setErrorMsg(result.error || "Check-out qilishda xatolik yuz berdi");
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
              background: 'var(--status-maintenance)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogOut size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
                Mehmonni Check-out Qilish
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Xona: #{res.assignedRoomNumber} • {res.roomType.name}
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

          {/* Guest info card */}
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
              Xona: <strong>#{res.assignedRoomNumber}</strong> • Yashash davri: <strong>{res.checkInDate}</strong> dan <strong>{res.checkOutDate}</strong> gacha
            </div>
          </div>

          {/* Balance summary */}
          <div style={{
            background: remainingBalance > 0 ? 'var(--status-dirty-bg)' : 'var(--status-available-bg)',
            border: `1px solid ${remainingBalance > 0 ? 'var(--status-dirty-border)' : 'var(--status-available-border)'}`,
            padding: '1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>Jami xarajatlar:</span>
              <strong style={{ fontSize: '1rem' }}>{formatCurrency(res.totalAmount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>Jami to'langan:</span>
              <strong style={{ fontSize: '1rem', color: 'var(--status-available)' }}>{formatCurrency(res.paidAmount)}</strong>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              paddingTop: '0.5rem'
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>To'lanishi lozim bo'lgan qoldiq:</span>
              <strong style={{ fontSize: '1.2rem', color: remainingBalance > 0 ? '#991b1b' : '#065f46' }}>
                {formatCurrency(remainingBalance)}
              </strong>
            </div>
          </div>

          {/* If there is outstanding balance, provide 1-click settlement */}
          {remainingBalance > 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--slate-200)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--navy-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={16} color="var(--gold-600)" />
                <span>Qarzdorlikni yopish (To'lov qabul qilish)</span>
              </h4>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  style={{ flex: 1 }}
                >
                  <option value="cash">Naqd pul (Kassaga kirim)</option>
                  <option value="card">Terminal / Karta</option>
                  <option value="click">Click</option>
                  <option value="payme">Payme</option>
                  <option value="bank_transfer">Bank o'tkazmasi</option>
                </select>

                <button 
                  type="button"
                  onClick={handleSettleBalance}
                  className="btn btn-primary"
                >
                  <CreditCard size={15} />
                  <span>Qarzni yopish ({formatCurrency(remainingBalance)})</span>
                </button>
              </div>

              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <button 
                  type="button"
                  onClick={() => onOpenFolio(res.id)}
                  style={{ fontSize: '0.82rem', color: 'var(--navy-600)', textDecoration: 'underline' }}
                >
                  Batafsil Folio hisobini ko'rish ➔
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.86rem',
              color: 'var(--status-available)',
              fontWeight: 600
            }}>
              <CheckCircle2 size={18} />
              <span>Hisob to'liq yopilgan. Check-out qilish mumkin.</span>
            </div>
          )}

          {/* Housekeeping notice */}
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
            💡 Check-out tugmasi bosilishi bilanoq, <strong>#{res.assignedRoomNumber}-xona</strong> avtomatik tarzda <strong>"Dirty"</strong> holatiga o'tadi va Housekeeping xodimlari ekranida tozalash topshirig'i paydo bo'ladi.
          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Bekor qilish
          </button>

          <button 
            onClick={handleConfirmCheckOut}
            disabled={remainingBalance > 0}
            className={`btn ${remainingBalance > 0 ? 'btn-secondary' : 'btn-danger'}`}
            style={{ opacity: remainingBalance > 0 ? 0.5 : 1 }}
          >
            <LogOut size={16} />
            <span>Check-out Qilish & Xonani Bo'shatish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
