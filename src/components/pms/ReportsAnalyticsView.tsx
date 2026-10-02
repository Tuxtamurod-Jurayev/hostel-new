import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Bed, 
  Percent, 
  Calendar,
  CreditCard,
  Building2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ReportsAnalyticsView: React.FC = () => {
  const { rooms, reservations, folios } = useHotel();

  // Metrics calculations
  const totalRooms = rooms.length;
  const inHouseCount = reservations.filter(r => r.status === 'checked_in').length;
  
  // Occupancy Rate (Section 78)
  const occupancyPercent = totalRooms > 0 ? Math.round((inHouseCount / totalRooms) * 100) : 0;

  // Active or confirmed bookings
  const validReservations = reservations.filter(r => r.status !== 'cancelled');
  const soldRoomNights = validReservations.reduce((sum, r) => sum + r.nightsCount, 0);

  // Room Revenue
  const totalRoomRevenue = validReservations.reduce((sum, r) => sum + r.roomTotal, 0);

  // ADR: Average Daily Rate (Section 79) = Room Revenue / Sold Room Nights
  const adr = soldRoomNights > 0 ? Math.round(totalRoomRevenue / soldRoomNights) : 0;

  // RevPAR: Revenue per Available Room (Section 80) = Room Revenue / Total Available Rooms
  const revpar = totalRooms > 0 ? Math.round(totalRoomRevenue / totalRooms) : 0;

  // Total Revenue from all folios
  const totalGrossRevenue = folios.reduce((sum, f) => sum + f.total, 0);
  const totalReceivedCashAndCard = folios.reduce((sum, f) => sum + f.paidTotal, 0);

  // Revenue Breakdown by Category (Section 82)
  const categoryTotals: Record<string, number> = {
    room: 0,
    breakfast: 0,
    minibar: 0,
    laundry: 0,
    transfer: 0,
    other: 0
  };

  folios.forEach(f => {
    f.items.forEach(it => {
      const cat = it.category in categoryTotals ? it.category : 'other';
      categoryTotals[cat] += it.totalPrice;
    });
  });

  // Payment Breakdown (Section 83)
  const paymentMethodTotals: Record<string, number> = {
    cash: 0,
    card: 0,
    online: 0,
    bank_transfer: 0
  };

  folios.forEach(f => {
    f.payments.forEach(p => {
      const m = (p.paymentMethod === 'payme' || p.paymentMethod === 'click' || p.paymentMethod === 'uzum') 
        ? 'online' 
        : p.paymentMethod;
      paymentMethodTotals[m] = (paymentMethodTotals[m] || 0) + p.amount;
    });
  });

  // Cancellation Stats (Section 81)
  const totalBookingsCount = reservations.length;
  const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;
  const noShowCount = reservations.filter(r => r.status === 'no_show').length;
  const cancellationRate = totalBookingsCount > 0 ? Math.round((cancelledCount / totalBookingsCount) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Title */}
      <div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-900)' }}>
          Mehmonxona Moliyaviy va Operatsion Hisobotlari (Hotel KPI & Analytics)
        </h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '2px' }}>
          ADR, RevPAR, Bandlik darajasi (Occupancy) va daromadlar taqsimoti
        </div>
      </div>

      {/* Primary KPI Cards (Occupancy, ADR, RevPAR, Total Revenue) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Occupancy */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', borderTop: '4px solid var(--gold-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>OCCUPANCY (BANDLIK)</span>
            <Percent size={16} color="var(--gold-500)" />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.5rem 0' }}>
            {occupancyPercent}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
            Formula: {inHouseCount} band / {totalRooms} xona
          </div>
        </div>

        {/* ADR */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', borderTop: '4px solid var(--status-reserved)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>ADR (O'RTACHA KUNLIK NARX)</span>
            <TrendingUp size={16} color="var(--status-reserved)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.5rem 0' }}>
            {formatCurrency(adr)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
            Room Rev / {soldRoomNights} sotilgan kecha
          </div>
        </div>

        {/* RevPAR */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', borderTop: '4px solid var(--status-available)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>REVPAR (XONA BOSHIGA TUSHUM)</span>
            <Building2 size={16} color="var(--status-available)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.5rem 0' }}>
            {formatCurrency(revpar)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
            Room Rev / {totalRooms} jami xona
          </div>
        </div>

        {/* Gross Revenue */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', borderTop: '4px solid var(--status-occupied)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>JAMI DAROMAD (GROSS REVENUE)</span>
            <DollarSign size={16} color="var(--status-occupied)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.5rem 0' }}>
            {formatCurrency(totalGrossRevenue)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--status-available)', fontWeight: 600 }}>
            Tushgan to'lov: {formatCurrency(totalReceivedCashAndCard)}
          </div>
        </div>
      </div>

      {/* Two Column Section: Revenue Breakdown & Payment Methods */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Revenue Breakdown (Section 82) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
            Xizmat Turlari Bo'yicha Tushum (Revenue Breakdown)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Xonalar ijarasi (Rooms)', amount: categoryTotals.room, color: 'var(--navy-900)' },
              { label: 'Shved stoli nonushtasi (Breakfast)', amount: categoryTotals.breakfast, color: 'var(--gold-500)' },
              { label: 'Mini-bar mahsulotlari', amount: categoryTotals.minibar, color: 'var(--status-reserved)' },
              { label: 'Express Kir yuvish (Laundry)', amount: categoryTotals.laundry, color: 'var(--status-occupied)' },
              { label: 'VIP Aeroport Transferi', amount: categoryTotals.transfer, color: 'var(--status-available)' },
              { label: 'Boshqa xizmatlar (Other)', amount: categoryTotals.other, color: 'var(--slate-400)' }
            ].map((cat, idx) => {
              const pct = totalGrossRevenue > 0 ? Math.round((cat.amount / totalGrossRevenue) * 100) : 0;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>{cat.label}</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{formatCurrency(cat.amount)} ({pct}%)</strong>
                  </div>
                  <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods (Section 83) */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
            To'lov Usullari Taqsimoti (Payment Methods)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Naqd pul (Cash)', amount: paymentMethodTotals.cash, color: 'var(--status-available)' },
              { label: 'Terminal / Plastik karta (Card)', amount: paymentMethodTotals.card, color: 'var(--status-occupied)' },
              { label: 'Online Shlyuz (Payme / Click / Uzum)', amount: paymentMethodTotals.online, color: 'var(--gold-500)' },
              { label: 'Bank hisob raqami (Bank Transfer)', amount: paymentMethodTotals.bank_transfer, color: 'var(--status-reserved)' }
            ].map((pm, idx) => {
              const pct = totalReceivedCashAndCard > 0 ? Math.round((pm.amount / totalReceivedCashAndCard) * 100) : 0;
              return (
                <div key={idx} style={{
                  background: 'var(--slate-50)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-200)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy-900)' }}>{pm.label}</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>{formatCurrency(pm.amount)}</strong>
                  </div>
                  <div style={{ height: '6px', background: 'var(--slate-200)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pm.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cancellation stats banner */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--slate-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Bekor qilishlar nisbati:</div>
              <strong style={{ fontSize: '1.1rem', color: 'var(--status-maintenance)' }}>{cancellationRate}%</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
              Bekor qilingan: <strong>{cancelledCount}</strong> • Kelmagan (No-show): <strong>{noShowCount}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
