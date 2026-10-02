import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { PaymentMethod, FolioItem } from '../../types/hotel';
import { X, Plus, CreditCard, Printer, Receipt, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { getTodayDate } from '../../utils/dates';

interface FolioModalProps {
  reservationId: string;
  onClose: () => void;
  onPrintInvoice: (resId: string) => void;
}

export const FolioModal: React.FC<FolioModalProps> = ({
  reservationId,
  onClose,
  onPrintInvoice
}) => {
  const { reservations, folios, addFolioItem, addPayment } = useHotel();
  const res = reservations.find(r => r.id === reservationId);
  const folio = folios.find(f => f.reservationId === reservationId);

  // New Item State
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemCategory, setItemCategory] = useState<FolioItem['category']>('minibar');
  const [itemDescription, setItemDescription] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(50000);

  // New Payment State
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(folio?.balance || 0);
  const [payMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [payNote, setPayNote] = useState('');

  if (!res || !folio) return null;

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDescription) return;
    addFolioItem(res.id, {
      date: getTodayDate(),
      category: itemCategory,
      description: itemDescription,
      quantity: itemQty,
      unitPrice: itemPrice,
      totalPrice: itemPrice * itemQty
    });
    setShowAddItem(false);
    setItemDescription('');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    addPayment(res.id, payAmount, payMethod, payNote || 'Reception to\'lov');
    setShowAddPayment(false);
    setPayNote('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)' }}>
                Mehmon Hisob-Kitobi (Folio #{folio.id.slice(0, 12)})
              </h2>
              <span className={`badge ${folio.balance <= 0 ? 'badge-available' : 'badge-dirty'}`}>
                {folio.balance <= 0 ? 'To\'liq To\'langan' : `Qarz: ${formatCurrency(folio.balance)}`}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Mehmon: <strong>{res.guest.firstName} {res.guest.lastName}</strong> • Xona: <strong>#{res.assignedRoomNumber || 'N/A'}</strong> ({res.roomType.name}) • Bron: #{res.confirmationNumber}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => onPrintInvoice(res.id)}
              className="btn btn-secondary btn-sm"
            >
              <Printer size={15} />
              <span>Invoys / Chek</span>
            </button>
            <button onClick={onClose} style={{ color: 'var(--slate-400)', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Itemized Charges Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>
                1. Xarajatlar va Ko'rsatilgan Xizmatlar (Folio Items)
              </h3>
              <button 
                onClick={() => setShowAddItem(!showAddItem)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} />
                <span>+ Yangi Xarajat Qo'shish</span>
              </button>
            </div>

            {/* Add item inline form */}
            {showAddItem && (
              <form onSubmit={handleAddItemSubmit} style={{
                background: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--slate-300)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr 0.8fr 1.2fr auto',
                gap: '0.75rem',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '3px' }}>
                    Kategoriya
                  </label>
                  <select 
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="minibar">Mini-bar</option>
                    <option value="restaurant">Restoran</option>
                    <option value="laundry">Kir yuvish</option>
                    <option value="transfer">Transfer</option>
                    <option value="breakfast">Nonushta</option>
                    <option value="late_checkout">Late check-out</option>
                    <option value="other">Boshqa xizmat</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '3px' }}>
                    Tavsif (Xizmat nomi)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Masalan: 2 dona sharbat va shokolad"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '3px' }}>
                    Soni
                  </label>
                  <input 
                    type="number" 
                    min={1}
                    value={itemQty}
                    onChange={(e) => setItemQty(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '3px' }}>
                    Dona narxi (so'm)
                  </label>
                  <input 
                    type="number" 
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <button type="submit" className="btn btn-primary" style={{ height: '40px' }}>
                    Qo'shish
                  </button>
                </div>
              </form>
            )}

            {/* Items Table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Kategoriya</th>
                    <th>Tavsif</th>
                    <th style={{ textAlign: 'center' }}>Miqdor</th>
                    <th style={{ textAlign: 'right' }}>Dona narxi</th>
                    <th style={{ textAlign: 'right' }}>Jami narx</th>
                  </tr>
                </thead>
                <tbody>
                  {folio.items.map(it => (
                    <tr key={it.id}>
                      <td style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{it.date}</td>
                      <td>
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                          {it.category.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{it.description}</td>
                      <td style={{ textAlign: 'center' }}>{it.quantity}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(it.unitPrice)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--navy-900)' }}>
                        {formatCurrency(it.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments History Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>
                2. Amalga Oshirilgan To'lovlar (Payments & Deposits)
              </h3>
              <button 
                onClick={() => {
                  setPayAmount(folio.balance > 0 ? folio.balance : 0);
                  setShowAddPayment(!showAddPayment);
                }}
                className="btn btn-secondary btn-sm"
              >
                <CreditCard size={14} />
                <span>+ To'lov Qabul Qilish</span>
              </button>
            </div>

            {/* Add payment inline form */}
            {showAddPayment && (
              <form onSubmit={handlePaymentSubmit} style={{
                background: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--slate-300)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.2fr 2fr auto',
                gap: '0.75rem',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '3px' }}>
                    Summa (so'm)
                  </label>
                  <input 
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    style={{ width: '100%', fontWeight: 700 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '3px' }}>
                    To'lov usuli
                  </label>
                  <select 
                    value={payMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="cash">Naqd pul</option>
                    <option value="card">Terminal / Karta</option>
                    <option value="click">Click</option>
                    <option value="payme">Payme</option>
                    <option value="bank_transfer">Bank o'tkazmasi</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '3px' }}>
                    Izoh / Kvitansiya ma'lumoti
                  </label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Kassa cheki #4410"
                    value={payNote}
                    onChange={(e) => setPayNote(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <button type="submit" className="btn btn-primary" style={{ height: '40px' }}>
                    Qabul qilish
                  </button>
                </div>
              </form>
            )}

            <div style={{ overflowX: 'auto', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Tranzaksiya ID</th>
                    <th>To'lov Usuli</th>
                    <th>Izoh</th>
                    <th>Qabul Qildi</th>
                    <th style={{ textAlign: 'right' }}>Summa</th>
                  </tr>
                </thead>
                <tbody>
                  {folio.payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--slate-400)', padding: '1.5rem' }}>
                        To'lovlar qayd etilmagan.
                      </td>
                    </tr>
                  ) : (
                    folio.payments.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{p.date}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.transactionRef}</td>
                        <td>
                          <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-800)' }}>
                            {p.paymentMethod.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{p.note || '-'}</td>
                        <td style={{ fontSize: '0.85rem' }}>{p.receivedBy}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--status-available)' }}>
                          +{formatCurrency(p.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals Summary Bar */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.25rem 1.75rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Subtotal</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                {formatCurrency(folio.subtotal)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>QQS (12%)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                {formatCurrency(folio.taxAmount)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Jami Summa</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                {formatCurrency(folio.total)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>To'langan</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-available)' }}>
                {formatCurrency(folio.paidTotal)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Qoldiq Qarz</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: folio.balance > 0 ? '#991b1b' : '#065f46' }}>
                {formatCurrency(folio.balance)}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
