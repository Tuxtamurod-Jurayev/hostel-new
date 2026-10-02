import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Tag, Percent, ShieldCheck, DollarSign, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const RatesPromoView: React.FC = () => {
  const { ratePlans, promoCodes } = useHotel();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Rate Plans Section (Section 36) */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)' }}>
              Tarif Rejalari (Rate Management & Plans)
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Moslashuvchan, tejamkor va maxsus shartlardagi tariflar
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {ratePlans.map(plan => (
            <div 
              key={plan.id}
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>{plan.code}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                    {plan.priceMultiplier}x koeffitsiyent
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-900)', marginBottom: '4px' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {plan.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                <div>Bekor qilish: <strong>{plan.isRefundable ? `${plan.cancellationHours} soat oldin bepul` : 'Bekor qilib bo\'lmaydi (Non-ref)'}</strong></div>
                <div>Nonushta: <strong>{plan.breakfastIncluded ? 'Kiritilgan' : 'Alohida to\'lanadi'}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Codes Section (Section 40) */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)' }}>
              Faol Promo-kodlar (Promotional Discount Codes)
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Online va Reception uchun amaldagi chegirma kodlari
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Promo-kod</th>
                <th>Chegirma foizi</th>
                <th>Amal qilish muddati</th>
                <th>Tavsif</th>
                <th>Ishlatilgan soni</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map(promo => (
                <tr key={promo.code}>
                  <td>
                    <span style={{
                      background: 'var(--navy-900)',
                      color: 'var(--gold-400)',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      fontSize: '0.95rem',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      {promo.code}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--status-available)', fontSize: '1rem' }}>
                      -{promo.discountPercent}%
                    </strong>
                  </td>
                  <td>{promo.validUntil}</td>
                  <td>{promo.description}</td>
                  <td>
                    <strong>{promo.usageCount} marta</strong>
                  </td>
                  <td>
                    <span className="badge badge-available">FAOL</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax & Service Settings (Section 41) */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
          Soliq va Xizmat Haqi Sozlamalari (Taxes & Fees)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
          Barcha bronlar va hisob-kitoblar uchun qo'llaniladigan standart davlat stavkalari.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>QQS (Qo'shilgan Qiymat Solig'i)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', margin: '4px 0' }}>12.0%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-available)' }}>O'zbekiston Respublikasi Soliq kodeksi bo'yicha</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Service Charge (Mehmonxona xizmati)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', margin: '4px 0' }}>0.0% (Narx ichida)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Xona narxiga kiritilgan</div>
          </div>
        </div>
      </div>

    </div>
  );
};
