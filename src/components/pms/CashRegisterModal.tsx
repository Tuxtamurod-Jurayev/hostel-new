import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { X, Coins, Plus, Minus, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CashRegisterModalProps {
  onClose: () => void;
}

export const CashRegisterModal: React.FC<CashRegisterModalProps> = ({ onClose }) => {
  const { shift, recordCashTransaction, closeShift } = useHotel();
  const [transactionType, setTransactionType] = useState<'expense' | 'deposit'>('expense');
  const [amount, setAmount] = useState<number>(50000);
  const [note, setNote] = useState('');

  const [actualCashInput, setActualCashInput] = useState<number>(shift.expectedCash);
  const [isClosingShift, setIsClosingShift] = useState(false);

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !note) return;
    recordCashTransaction(transactionType, amount, note);
    setNote('');
    alert("Kassa operatsiyasi muvaffaqiyatli saqlandi!");
  };

  const handleCloseShift = () => {
    if (confirm("Haqiqatan ham joriy smenani yopmoqchimisiz?")) {
      closeShift(actualCashInput, "Smena muvaffaqiyatli topshirildi");
      alert("Smena yopildi va hisobot saqlandi!");
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--gold-100)',
              color: 'var(--gold-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Coins size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
                Reception Kassasi & Smena Holati
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Smena: <strong>{shift.shiftName.toUpperCase()}</strong> • Mas'ul: {shift.operatorName}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Cash Summary Card (Section 86) */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--slate-600)' }}>Boshlang'ich kassa (Opening Balance):</span>
              <strong>{formatCurrency(shift.openingCashBalance)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--status-available)' }}>
              <span>Naqd qabul qilingan to'lovlar (+):</span>
              <strong>+{formatCurrency(shift.cashReceived)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--status-maintenance)' }}>
              <span>Kassadan chiqimlar (-):</span>
              <strong>-{formatCurrency(shift.expenses)}</strong>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid var(--slate-200)',
              paddingTop: '0.75rem',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy-900)' }}>
                Kutilayotgan Naqd Pul Qoldig'i:
              </span>
              <strong style={{ fontSize: '1.35rem', color: 'var(--navy-900)' }}>
                {formatCurrency(shift.expectedCash)}
              </strong>
            </div>
          </div>

          {/* Record Quick Cash Transaction Form */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--slate-200)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
              Kassaga Kirim / Chiqim Qayd Etish
            </h4>

            <form onSubmit={handleRecord} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button"
                  onClick={() => setTransactionType('expense')}
                  className={`btn btn-sm ${transactionType === 'expense' ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  <Minus size={14} />
                  <span>Kassadan Chiqim</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setTransactionType('deposit')}
                  className={`btn btn-sm ${transactionType === 'deposit' ? 'btn-success' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  <Plus size={14} />
                  <span>Kassaga Kirim</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '2px' }}>
                    Summa (so'm) *
                  </label>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    style={{ width: '100%', fontWeight: 700 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', marginBottom: '2px' }}>
                    Sabab / Izoh *
                  </label>
                  <input 
                    type="text"
                    placeholder="Masalan: Kanselyariya yoki taksi xarajati"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-navy btn-sm" style={{ marginTop: '0.25rem' }}>
                Operatsiyani saqlash
              </button>
            </form>
          </div>

          {/* Smena Yopish Section (Section 87) */}
          <div style={{
            background: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Smenani Yopish & Kassa Sanog'i (Shift Closing)
            </h4>

            {isClosingShift ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Haqiqiy sanalgan naqd pul (so'm):
                  </label>
                  <input 
                    type="number"
                    value={actualCashInput}
                    onChange={(e) => setActualCashInput(Number(e.target.value))}
                    style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800 }}
                  />
                </div>

                <div style={{ fontSize: '0.85rem' }}>
                  Farq (Discrepancy): 
                  <strong style={{ marginLeft: '6px', color: (actualCashInput - shift.expectedCash) === 0 ? 'var(--status-available)' : 'var(--status-maintenance)' }}>
                    {formatCurrency(actualCashInput - shift.expectedCash)}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setIsClosingShift(false)} className="btn btn-secondary btn-sm">
                    Bekor qilish
                  </button>
                  <button type="button" onClick={handleCloseShift} className="btn btn-primary btn-sm">
                    Tasdiqlayman, Smenani Yopish
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setIsClosingShift(true)}
                className="btn btn-secondary btn-sm"
              >
                <span>Smenani topshirish (Sanoq kiritish) ➔</span>
              </button>
            )}
          </div>

        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
