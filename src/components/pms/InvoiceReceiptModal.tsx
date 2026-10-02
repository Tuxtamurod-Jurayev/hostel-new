import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { X, Printer, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { getTodayDate } from '../../utils/dates';

interface InvoiceReceiptModalProps {
  reservationId: string;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  reservationId,
  onClose
}) => {
  const { reservations, folios } = useHotel();
  const res = reservations.find(r => r.id === reservationId);
  const folio = folios.find(f => f.reservationId === reservationId);

  if (!res || !folio) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        
        {/* Controls Bar (hidden during print) */}
        <div className="modal-header no-print">
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
              Rasmiy Mehmonxona Hisob-Fakturasi (Invoice / Folio Receipt)
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Chop etish uchun tayyorlangan hujjat
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => window.print()}
              className="btn btn-primary btn-sm"
            >
              <Printer size={15} />
              <span>Chop etish (Print)</span>
            </button>
            <button onClick={onClose} style={{ color: 'var(--slate-400)', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Document */}
        <div className="modal-body" style={{ background: '#ffffff', padding: '2.5rem', color: '#1e293b' }}>
          
          {/* Document Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--slate-900)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <div style={{
                  background: 'var(--navy-900)',
                  color: 'var(--gold-400)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '0.04em' }}>
                    SILK ROAD PALACE
                  </h1>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', letterSpacing: '0.1em' }}>
                    HOTEL & EXECUTIVE SUITES ★★★★★
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>
                Amir Temur ko'chasi, 45, Toshkent sh., O'zbekiston<br />
                Tel: +998 (71) 200-88-77 • Email: reservation@silkroadpalace.uz<br />
                STIR: 304 982 110 • QQS kodi: 12094821
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                INVOICE
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-700)', marginTop: '2px' }}>
                № {res.confirmationNumber}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                Sana: {getTodayDate()}
              </div>
              <div style={{ marginTop: '6px' }}>
                <span className={`badge ${folio.balance <= 0 ? 'badge-available' : 'badge-dirty'}`} style={{ fontSize: '0.75rem' }}>
                  {folio.balance <= 0 ? 'TO\'LIQ TO\'LANGAN' : 'QARZDORLIK MAVJUD'}
                </span>
              </div>
            </div>
          </div>

          {/* Guest and Stay Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            background: 'var(--slate-50)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            border: '1px solid var(--slate-200)',
            fontSize: '0.88rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Mehmon ma'lumotlari:
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                {res.guest.firstName} {res.guest.lastName}
              </div>
              <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>
                Telefon: {res.guest.phone}
              </div>
              <div style={{ color: 'var(--slate-600)', marginTop: '2px' }}>
                Pasport: {res.guest.passportNumber} ({res.guest.nationality})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Yashash ma'lumotlari:
              </div>
              <div style={{ color: 'var(--slate-800)' }}>
                Xona: <strong>#{res.assignedRoomNumber || 'N/A'}</strong> ({res.roomType.name})
              </div>
              <div style={{ color: 'var(--slate-800)', marginTop: '2px' }}>
                Kelish: <strong>{res.checkInDate} (14:00)</strong>
              </div>
              <div style={{ color: 'var(--slate-800)', marginTop: '2px' }}>
                Ketish: <strong>{res.checkOutDate} (12:00)</strong> ({res.nightsCount} kecha)
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div style={{ marginBottom: '1.75rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--slate-300)', background: 'var(--slate-100)' }}>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left' }}>№</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left' }}>Xizmat / Mahsulot tavsifi</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Miqdori</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Narxi</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Jami</th>
                </tr>
              </thead>
              <tbody>
                {folio.items.map((it, idx) => (
                  <tr key={it.id} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--slate-500)' }}>{idx + 1}</td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{it.description}</td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{it.quantity}</td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>{formatCurrency(it.unitPrice)}</td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(it.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ width: '320px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                <span style={{ color: 'var(--slate-600)' }}>Oraliq jami (Subtotal):</span>
                <span>{formatCurrency(folio.subtotal)}</span>
              </div>
              {folio.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: 'var(--status-available)' }}>
                  <span>Chegirma:</span>
                  <span>-{formatCurrency(folio.discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                <span style={{ color: 'var(--slate-600)' }}>QQS (12%):</span>
                <span>{formatCurrency(folio.taxAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderTop: '2px solid var(--slate-900)', fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Jami to'lov:</span>
                <span style={{ color: 'var(--navy-900)' }}>{formatCurrency(folio.total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: 'var(--status-available)', fontWeight: 700 }}>
                <span>To'langan summa:</span>
                <span>{formatCurrency(folio.paidTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderTop: '1px solid var(--slate-200)', fontWeight: 800, color: folio.balance > 0 ? '#991b1b' : '#065f46' }}>
                <span>To'lanishi lozim:</span>
                <span>{formatCurrency(folio.balance)}</span>
              </div>
            </div>
          </div>

          {/* Stamp & Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '2rem', borderTop: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: 'var(--slate-500)', marginBottom: '2.5rem' }}>Mehmon imzosi:</div>
              <div style={{ borderTop: '1px solid var(--slate-400)', width: '180px', paddingTop: '4px', textAlign: 'center', fontSize: '0.78rem' }}>
                {res.guest.firstName} {res.guest.lastName}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '2px dashed var(--gold-500)',
                color: 'var(--gold-600)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                margin: '0 auto',
                transform: 'rotate(-8deg)'
              }}>
                <div>SILK ROAD</div>
                <div>PALACE</div>
                <div style={{ fontSize: '0.55rem' }}>★ MUHR / STAMP ★</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--slate-500)', marginBottom: '2.5rem' }}>Bosh Administrator / Kassa:</div>
              <div style={{ borderTop: '1px solid var(--slate-400)', width: '180px', paddingTop: '4px', textAlign: 'center', fontSize: '0.78rem' }}>
                Vali Karimov (M.O'.)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
