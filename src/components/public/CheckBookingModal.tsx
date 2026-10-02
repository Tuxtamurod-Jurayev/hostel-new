import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation } from '../../types/hotel';
import { X, Search, CheckCircle2, AlertTriangle, Calendar, User, CreditCard, Ban } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CheckBookingModalProps {
  onClose: () => void;
}

export const CheckBookingModal: React.FC<CheckBookingModalProps> = ({ onClose }) => {
  const { reservations, cancelReservation } = useHotel();
  const [codeQuery, setCodeQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [foundReservation, setFoundReservation] = useState<Reservation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Rejalar o\'zgardi');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanedCode = codeQuery.trim().toUpperCase();
    const cleanedPhone = phoneQuery.replace(/\D/g, '');

    const res = reservations.find(r => {
      const matchCode = r.confirmationNumber.toUpperCase() === cleanedCode;
      const matchPhone = cleanedPhone ? r.guest.phone.replace(/\D/g, '').includes(cleanedPhone) : true;
      return matchCode && matchPhone;
    });

    setFoundReservation(res || null);
  };

  const handleCancel = () => {
    if (!foundReservation) return;
    const res = cancelReservation(foundReservation.id, cancelReason);
    if (res.success) {
      alert("Bron muvaffaqiyatli bekor qilindi!");
      setCancelModalOpen(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>Bron holatini tekshirish</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Tasdiqlash raqami va telefon orqali buyurtmangizni toping
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Bron raqami (Confirmation Number) *
              </label>
              <input 
                type="text"
                placeholder="Masalan: HTL-20261002-A8F92"
                value={codeQuery}
                onChange={(e) => setCodeQuery(e.target.value)}
                style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700 }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Telefon raqamingiz
              </label>
              <input 
                type="text"
                placeholder="+998 90 123 45 67"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Search size={16} />
              <span>Tekshirish</span>
            </button>
          </form>

          {/* Result view */}
          {hasSearched && (
            foundReservation ? (
              <div style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>HOLAT</span>
                    <span className={`badge ${
                      foundReservation.status === 'confirmed' ? 'badge-reserved' :
                      foundReservation.status === 'checked_in' ? 'badge-occupied' :
                      foundReservation.status === 'checked_out' ? 'badge-available' : 'badge-maintenance'
                    }`}>
                      {foundReservation.status === 'confirmed' && 'Tasdiqlangan (Kutilmoqda)'}
                      {foundReservation.status === 'checked_in' && 'Yashamoqda (Checked-in)'}
                      {foundReservation.status === 'checked_out' && 'Yakunlangan (Checked-out)'}
                      {foundReservation.status === 'cancelled' && 'Bekor qilingan'}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>KOD</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{foundReservation.confirmationNumber}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.86rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Mehmon:</span>
                    <strong>{foundReservation.guest.firstName} {foundReservation.guest.lastName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Xona toifasi:</span>
                    <strong>{foundReservation.roomType.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Kelish:</span>
                    <strong>{foundReservation.checkInDate} (14:00)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Ketish:</span>
                    <strong>{foundReservation.checkOutDate} (12:00)</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem', display: 'block' }}>Jami to'lov:</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{formatCurrency(foundReservation.totalAmount)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem', display: 'block' }}>To'lov statusi:</span>
                    <span style={{ fontWeight: 700, color: foundReservation.paymentStatus === 'paid' ? 'var(--status-available)' : 'var(--status-dirty)' }}>
                      {foundReservation.paymentStatus === 'paid' ? 'To\'liq to\'langan' : `Qarz: ${formatCurrency(foundReservation.balance)}`}
                    </span>
                  </div>
                </div>

                {foundReservation.status === 'confirmed' && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-200)' }}>
                    <button 
                      onClick={() => setCancelModalOpen(true)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--status-maintenance)', borderColor: 'var(--status-maintenance-border)' }}
                    >
                      <Ban size={14} />
                      <span>Bronni bekor qilish</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate-500)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                Bunday ma'lumotlarga ega bron topilmadi. Iltimos, bron kodini tekshirib qayta kiriting.
              </div>
            )
          )}

          {/* Cancellation sub-modal */}
          {cancelModalOpen && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#fff',
              border: '2px solid var(--status-maintenance-border)',
              borderRadius: 'var(--radius-md)'
            }}>
              <h4 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>
                Haqiqatan ham ushbu bronni bekor qilmoqchimisiz?
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '0.75rem' }}>
                Standart bekor qilish siyosati qo'llaniladi. Xona boshqa mehmonlar uchun bo'shatiladi.
              </p>
              <select 
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', marginBottom: '0.75rem' }}
              >
                <option value="Rejalar o'zgardi">Rejalar o'zgardi</option>
                <option value="Sayohat qoldirildi">Sayohat qoldirildi</option>
                <option value="Boshqa joy tanlandi">Boshqa mehmonxona tanlandi</option>
                <option value="Favqulodda sabab">Favqulodda sabab</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setCancelModalOpen(false)} className="btn btn-secondary btn-sm">
                  Orqaga
                </button>
                <button onClick={handleCancel} className="btn btn-danger btn-sm">
                  Tasdiqlayman, bekor qilish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
