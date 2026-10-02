import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { PaymentMethod } from '../../types/hotel';
import { X, UserPlus, PhoneCall, CheckCircle2, BedDouble, Calendar, CreditCard } from 'lucide-react';
import { getTodayDate, getNDaysLater, calculateNights } from '../../utils/dates';
import { formatCurrency } from '../../utils/formatters';

interface NewReceptionBookingModalProps {
  initialSource: 'walk_in' | 'phone';
  initialRoomId?: string;
  initialDate?: string;
  onClose: () => void;
}

export const NewReceptionBookingModal: React.FC<NewReceptionBookingModalProps> = ({
  initialSource,
  initialRoomId,
  initialDate,
  onClose
}) => {
  const { 
    roomTypes, 
    rooms, 
    ratePlans, 
    extraServices, 
    checkAvailability, 
    createReceptionReservation,
    guests 
  } = useHotel();

  const today = getTodayDate();
  const tomorrow = getNDaysLater(1, today);

  const [source, setSource] = useState<'walk_in' | 'phone' | 'reception'>(initialSource);
  const [roomTypeId, setRoomTypeId] = useState<string>(() => {
    if (initialRoomId) {
      const targetRoom = rooms.find(r => r.id === initialRoomId);
      if (targetRoom) return targetRoom.roomTypeId;
    }
    return roomTypes[0].id;
  });

  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId || '');
  const [checkInDate, setCheckInDate] = useState(initialDate || today);
  const [checkOutDate, setCheckOutDate] = useState(getNDaysLater(2, initialDate || today));
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [ratePlanId, setRatePlanId] = useState('rp_standard');

  // Guest details
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestPhone, setGuestPhone] = useState('+998 ');
  const [guestPassport, setGuestPassport] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestNationality, setGuestNationality] = useState("O'zbekiston");
  const [isVIP, setIsVIP] = useState(false);
  const [guestNotes, setGuestNotes] = useState('');

  // Payment
  const [isInstantCheckIn, setIsInstantCheckIn] = useState(source === 'walk_in' && checkInDate === today);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [errorMessage, setErrorMessage] = useState('');

  const nights = calculateNights(checkInDate, checkOutDate);
  const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId)!;
  const selectedRate = ratePlans.find(rp => rp.id === ratePlanId) || ratePlans[0];

  const availability = checkAvailability(roomTypeId, checkInDate, checkOutDate);
  const nightlyPrice = Math.round(selectedRoomType.basePrice * selectedRate.priceMultiplier);
  const estimatedTotal = nightlyPrice * nights;

  // Auto-set payment amount when estimated total changes if not manually edited
  React.useEffect(() => {
    if (source === 'walk_in') {
      setPaymentAmount(estimatedTotal);
    }
  }, [estimatedTotal, source]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!guestFirstName.trim() || !guestLastName.trim() || !guestPhone.trim()) {
      setErrorMessage("Iltimos, mehmonning ismi, familiyasi va telefon raqamini to'liq kiriting!");
      return;
    }

    if (!availability.isAvailable) {
      setErrorMessage("Tanlangan sanalarda ushbu xona toifasida bo'sh joy mavjud emas!");
      return;
    }

    const result = createReceptionReservation({
      roomTypeId,
      roomId: selectedRoomId || undefined,
      checkInDate,
      checkOutDate,
      adults,
      children: childrenCount,
      ratePlanId,
      source,
      newGuest: {
        firstName: guestFirstName.trim(),
        lastName: guestLastName.trim(),
        phone: guestPhone.trim(),
        email: guestEmail.trim() || `${guestFirstName.toLowerCase()}@reception.uz`,
        passportNumber: guestPassport.trim() || 'PASS_PENDING',
        nationality: guestNationality,
        isVIP,
        notes: guestNotes
      },
      selectedServices: [],
      initialPaymentAmount: paymentAmount,
      paymentMethod,
      isInstantCheckIn
    });

    if (result.success) {
      alert(`Bron muvaffaqiyatli yaratildi! Tasdiqlash raqami: #${result.reservation?.confirmationNumber}`);
      onClose();
    } else {
      setErrorMessage(result.error || "Bron yaratishda xatolik yuz berdi");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: source === 'walk_in' ? 'var(--gold-500)' : 'var(--navy-900)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {source === 'walk_in' ? <UserPlus size={18} /> : <PhoneCall size={18} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
                {source === 'walk_in' ? "Yangi Walk-in Mehmon Joylashtirish" : "Telefon Orqali Yangi Bron Kiritish"}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Reception orqali to'g'ridan-to'g'ri tizimga kiritish
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {errorMessage && (
              <div style={{
                background: 'var(--status-maintenance-bg)',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                border: '1px solid var(--status-maintenance-border)'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Source switcher & Instant check-in */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--slate-50)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSource('walk_in')}
                  className={`btn btn-sm ${source === 'walk_in' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <UserPlus size={14} />
                  <span>Walk-in</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSource('phone')}
                  className={`btn btn-sm ${source === 'phone' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <PhoneCall size={14} />
                  <span>Telefon</span>
                </button>
              </div>

              {source === 'walk_in' && checkInDate === today && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                  <input 
                    type="checkbox"
                    checked={isInstantCheckIn}
                    onChange={(e) => setIsInstantCheckIn(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Hozirning o'zida Check-in qilinsin (Xona band qilinadi)</span>
                </label>
              )}
            </div>

            {/* Section 1: Guest Information */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                1. Mehmon ma'lumotlari (Guest Profile)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Ism *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ali"
                    value={guestFirstName}
                    onChange={(e) => setGuestFirstName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Familiya *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Karimov"
                    value={guestLastName}
                    onChange={(e) => setGuestLastName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Telefon raqam *
                  </label>
                  <input 
                    type="text" 
                    placeholder="+998 90 000 00 00"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Pasport / ID seriya va raqam
                  </label>
                  <input 
                    type="text" 
                    placeholder="AA 1234567"
                    value={guestPassport}
                    onChange={(e) => setGuestPassport(e.target.value.toUpperCase())}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Stay Dates & Room Selection */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                2. Muddat va Xona tanlash
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Check-in
                  </label>
                  <input 
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Check-out
                  </label>
                  <input 
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Kattalar
                  </label>
                  <select 
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    style={{ width: '100%' }}
                  >
                    <option value={1}>1 kishi</option>
                    <option value={2}>2 kishi</option>
                    <option value={3}>3 kishi</option>
                    <option value={4}>4+ kishi</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Bolalar
                  </label>
                  <select 
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    style={{ width: '100%' }}
                  >
                    <option value={0}>0 bola</option>
                    <option value={1}>1 bola</option>
                    <option value={2}>2 bola</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Xona toifasi *
                  </label>
                  <select 
                    value={roomTypeId}
                    onChange={(e) => {
                      setRoomTypeId(e.target.value);
                      setSelectedRoomId('');
                    }}
                    style={{ width: '100%' }}
                  >
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name} ({formatCurrency(rt.basePrice)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Aniq xona raqami ({availability.availableRealRooms.length} ta bo'sh)
                  </label>
                  <select 
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">Avtomatik tayinlash</option>
                    {availability.availableRealRooms.map(rm => (
                      <option key={rm.id} value={rm.id}>
                        #{rm.roomNumber} ({rm.floor}-qavat • {rm.housekeepingStatus.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Pricing & Immediate Payment / Deposit */}
            <div style={{
              background: 'var(--slate-50)',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--slate-200)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <span>Hisoblangan summa ({nights} kecha x {formatCurrency(nightlyPrice)}):</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>
                  {formatCurrency(estimatedTotal)}
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    Qabul qilingan to'lov / Depozit (so'm)
                  </label>
                  <input 
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '3px' }}>
                    To'lov usuli
                  </label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    style={{ width: '100%' }}
                  >
                    <option value="cash">Naqd pul (Kassaga kirim)</option>
                    <option value="card">Terminal / Karta</option>
                    <option value="bank_transfer">Bank o'tkazmasi</option>
                    <option value="click">Click</option>
                    <option value="payme">Payme</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Bronni yaratish {isInstantCheckIn ? '& Check-in qilish' : ''}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
