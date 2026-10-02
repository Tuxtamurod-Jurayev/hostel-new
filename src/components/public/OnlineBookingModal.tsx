import React, { useState } from 'react';
import { RoomType, RatePlan, PaymentMethod } from '../../types/hotel';
import { useHotel } from '../../context/HotelContext';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Coffee,
  Car,
  Shirt,
  Wine,
  BedDouble,
  QrCode,
  Printer
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateNights } from '../../utils/dates';
import confetti from 'canvas-confetti';

interface OnlineBookingModalProps {
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  childrenCount: number;
  onClose: () => void;
  onViewInPMS?: () => void;
}

export const OnlineBookingModal: React.FC<OnlineBookingModalProps> = ({
  roomType,
  checkInDate,
  checkOutDate,
  adults,
  childrenCount,
  onClose,
  onViewInPMS
}) => {
  const { 
    ratePlans, 
    extraServices, 
    promoCodes, 
    createOnlineReservation,
    guests,
    setSystemMode 
  } = useHotel();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Selected state
  const [selectedRatePlanId, setSelectedRatePlanId] = useState<string>('rp_standard');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestPhone, setGuestPhone] = useState('+998 ');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPassport, setGuestPassport] = useState('');
  const [guestNationality, setGuestNationality] = useState("O'zbekiston");
  const [specialRequests, setSpecialRequests] = useState('');

  // Selected extras with quantities
  const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>({});

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payme');
  const [cardNumber, setCardNumber] = useState('8600 •••• •••• 4210');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Confirmed result
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);

  const nights = calculateNights(checkInDate, checkOutDate);
  const currentRatePlan = ratePlans.find(rp => rp.id === selectedRatePlanId) || ratePlans[0];

  // Base Room Total
  const nightlyPrice = Math.round(roomType.basePrice * currentRatePlan.priceMultiplier);
  const roomTotal = nightlyPrice * nights;

  // Repeat guest detection
  const detectedExistingGuest = guests.find(g => 
    guestPhone.length > 8 && g.phone.replace(/\D/g, '') === guestPhone.replace(/\D/g, '')
  );

  // Extras Total
  const servicesTotal = Object.entries(serviceQuantities).reduce((sum, [svcId, qty]) => {
    if (qty <= 0) return sum;
    const svc = extraServices.find(s => s.id === svcId);
    return sum + (svc ? svc.price * qty : 0);
  }, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo && promoDiscountPercent > 0) {
    discountAmount = Math.round((roomTotal * promoDiscountPercent) / 100);
  } else if (detectedExistingGuest && detectedExistingGuest.totalStays >= 3) {
    // 5% loyalty bonus for frequent guests!
    discountAmount = Math.round(roomTotal * 0.05);
  }

  const subtotal = roomTotal + servicesTotal - discountAmount;
  const taxAmount = Math.round(subtotal * 0.12); // 12% VAT
  const grandTotal = subtotal + taxAmount;

  // Handle promo apply
  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) return;
    const found = promoCodes.find(p => p.code.toUpperCase() === promoInput.trim().toUpperCase() && p.isActive);
    if (found) {
      setAppliedPromo(found.code);
      setPromoDiscountPercent(found.discountPercent);
    } else {
      setPromoError("Noto'g'ri yoki muddati o'tgan promo-kod");
    }
  };

  // Handle Service Quantity Toggle
  const handleServiceQtyChange = (serviceId: string, delta: number) => {
    setServiceQuantities(prev => {
      const current = prev[serviceId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [serviceId]: next };
    });
  };

  // Submit Online Booking
  const handleConfirmAndPay = async () => {
    setIsProcessing(true);
    setBookingError('');

    // Simulate gateway delay
    setTimeout(() => {
      const selectedServicesArray = Object.entries(serviceQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([serviceId, qty]) => ({ serviceId, quantity: qty }));

      const result = createOnlineReservation({
        roomTypeId: roomType.id,
        ratePlanId: selectedRatePlanId,
        checkInDate,
        checkOutDate,
        adults,
        children: childrenCount,
        guestFirstName: guestFirstName.trim() || 'Mehmon',
        guestLastName: guestLastName.trim() || 'Foydalanuvchi',
        guestPhone: guestPhone.trim(),
        guestEmail: guestEmail.trim() || 'guest@palace.uz',
        guestPassport: guestPassport.trim() || 'AA1234567',
        guestNationality,
        selectedServices: selectedServicesArray,
        promoCode: appliedPromo || undefined,
        paymentMethod,
        specialRequests
      });

      setIsProcessing(false);

      if (result.success && result.reservation) {
        setConfirmedReservation(result.reservation);
        setStep(5);
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      } else {
        setBookingError(result.error || "Bron qilishda xatolik yuz berdi");
      }
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        
        {/* Header with Step Indicator */}
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-600)', fontWeight: 700, letterSpacing: '0.05em' }}>
              ONLINE BOOKING ENGINE • QADAM {step}/4
            </div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
              {step === 1 && "Tarif va Sanalarni tanlash"}
              {step === 2 && "Mehmon ma'lumotlari"}
              {step === 3 && "Qo'shimcha qulayliklar & Promo-kod"}
              {step === 4 && "To'lov & Xavfsiz Tasdiqlash"}
              {step === 5 && "Bron muvaffaqiyatli tasdiqlandi!"}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--slate-400)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div style={{ height: '4px', background: 'var(--slate-100)', width: '100%' }}>
          <div style={{
            height: '100%',
            background: 'var(--gold-500)',
            width: `${(step / 5) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Body Content */}
        <div className="modal-body">
          {bookingError && (
            <div style={{
              background: 'var(--status-maintenance-bg)',
              color: '#991b1b',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.88rem',
              border: '1px solid var(--status-maintenance-border)'
            }}>
              {bookingError}
            </div>
          )}

          {/* STEP 1: Rate Plan & Summary */}
          {step === 1 && (
            <div>
              {/* Selected Room Preview Card */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                background: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem',
                border: '1px solid var(--slate-200)'
              }}>
                <img 
                  src={roomType.featuredImage} 
                  alt="" 
                  style={{ width: '110px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)' }}>{roomType.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                    {roomType.bedType} • {roomType.sizeSqm} m²
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--navy-700)', fontWeight: 600, marginTop: '4px' }}>
                    {checkInDate} dan {checkOutDate} gacha ({nights} kecha) • {adults} katta {childrenCount > 0 ? `+ ${childrenCount} bola` : ''}
                  </div>
                </div>
              </div>

              {/* Rate Plans Options */}
              <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                O'zingizga mos tarifni tanlang:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {ratePlans.map(plan => {
                  const planNightly = Math.round(roomType.basePrice * plan.priceMultiplier);
                  const isSelected = selectedRatePlanId === plan.id;

                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedRatePlanId(plan.id)}
                      style={{
                        border: isSelected ? '2px solid var(--gold-500)' : '1px solid var(--slate-200)',
                        background: isSelected ? 'var(--gold-100)' : '#ffffff',
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--navy-900)' }}>
                            {plan.name}
                          </span>
                          {plan.id === 'rp_non_refundable' && (
                            <span className="badge" style={{ background: '#ecfdf5', color: '#065f46' }}>-15% Tejamkor</span>
                          )}
                          {plan.breakfastIncluded && (
                            <span className="badge badge-gold">Nonushta kiritilgan</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                          {plan.description}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', paddingLeft: '1rem' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                          {formatCurrency(planNightly)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>/ bir kecha</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price estimation box */}
              <div style={{
                background: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  Xona narxi ({nights} kecha):
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {formatCurrency(roomTotal)}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details */}
          {step === 2 && (
            <div>
              {detectedExistingGuest && (
                <div style={{
                  background: 'var(--status-reserved-bg)',
                  border: '1px solid var(--status-reserved-border)',
                  color: '#0369a1',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Sparkles size={18} color="var(--gold-500)" />
                  <div>
                    <strong>Muntazam mehmonimiz!</strong> Siz mehmonxonamizda {detectedExistingGuest.totalStays} marta qolgansiz. 
                    {detectedExistingGuest.totalStays >= 3 && " Sizga 5% sodiqlik chegirmasi avtomatik beriladi!"}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Ism *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Sardor"
                    value={guestFirstName}
                    onChange={(e) => setGuestFirstName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Familiya *
                  </label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Mirzayev"
                    value={guestLastName}
                    onChange={(e) => setGuestLastName(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Telefon raqam *
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+998 90 123 45 67"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Elektron pochta (Email) *
                  </label>
                  <input 
                    type="email" 
                    placeholder="sardor@gmail.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Pasport / ID seriya va raqam *
                  </label>
                  <input 
                    type="text" 
                    placeholder="AA 1234567"
                    value={guestPassport}
                    onChange={(e) => setGuestPassport(e.target.value.toUpperCase())}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                    Fuqarolik
                  </label>
                  <select 
                    value={guestNationality} 
                    onChange={(e) => setGuestNationality(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="O'zbekiston">O'zbekiston</option>
                    <option value="Qozog'iston">Qozog'iston</option>
                    <option value="Rossiya">Rossiya</option>
                    <option value="Turkiya">Turkiya</option>
                    <option value="AQSh / Yevropa">AQSh / Yevropa</option>
                    <option value="Boshqa">Boshqa davlat</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                  Qo'shimcha istaklar (Special requests)
                </label>
                <textarea 
                  rows={2}
                  placeholder="Masalan: Tinch xona bo'lsin, yuqori qavat, bolalar karavoti..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Extras & Promo Code */}
          {step === 3 && (
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                Yashashingizni yanada qulaylashtiring:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {extraServices.map(svc => {
                  const qty = serviceQuantities[svc.id] || 0;
                  return (
                    <div 
                      key={svc.id}
                      style={{
                        border: qty > 0 ? '1.5px solid var(--navy-600)' : '1px solid var(--slate-200)',
                        background: qty > 0 ? 'var(--status-occupied-bg)' : '#ffffff',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-900)' }}>
                          {svc.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                          {svc.description} • <strong>{formatCurrency(svc.price)}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <button 
                          onClick={() => handleServiceQtyChange(svc.id, -1)}
                          disabled={qty <= 0}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--slate-200)',
                            color: 'var(--slate-800)',
                            fontWeight: 700,
                            opacity: qty <= 0 ? 0.4 : 1
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                        <button 
                          onClick={() => handleServiceQtyChange(svc.id, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--navy-800)',
                            color: '#ffffff',
                            fontWeight: 700
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code section */}
              <div style={{
                background: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-200)'
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                  <Tag size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Promo-kod bormi? (Masalan: WELCOME10)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Kodni kiriting..."
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    style={{ flex: 1, textTransform: 'uppercase', fontWeight: 600 }}
                  />
                  <button onClick={handleApplyPromo} className="btn btn-secondary">
                    Qo'llash
                  </button>
                </div>
                {appliedPromo && (
                  <div style={{ color: 'var(--status-available)', fontSize: '0.82rem', fontWeight: 600, marginTop: '6px' }}>
                    ✓ Promo-kod muvaffaqiyatli qo'llandi: {appliedPromo} (-{promoDiscountPercent}%)
                  </div>
                )}
                {promoError && (
                  <div style={{ color: 'var(--status-maintenance)', fontSize: '0.82rem', marginTop: '6px' }}>
                    {promoError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Payment */}
          {step === 4 && (
            <div>
              {/* Financial Calculation Breakdown */}
              <div style={{
                background: 'var(--slate-50)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--slate-200)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--slate-600)' }}>{roomType.name} ({nights} kecha x {formatCurrency(nightlyPrice)}):</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(roomTotal)}</span>
                </div>

                {servicesTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--slate-600)' }}>Qo'shimcha xizmatlar jami:</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(servicesTotal)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--status-available)' }}>
                    <span>Chegirma ({appliedPromo || 'Sodiqlik'}):</span>
                    <span style={{ fontWeight: 700 }}>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--slate-600)' }}>QQS (12%):</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(taxAmount)}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '2px solid var(--slate-200)',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem',
                  fontSize: '1.25rem'
                }}>
                  <strong style={{ color: 'var(--navy-900)' }}>Jami to'lov:</strong>
                  <strong style={{ color: 'var(--gold-600)' }}>{formatCurrency(grandTotal)}</strong>
                </div>
              </div>

              {/* Payment Methods */}
              <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                To'lov usulini tanlang (Xavfsiz to'lov shlyuzi):
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                  { id: 'payme', name: 'Payme', icon: '💳' },
                  { id: 'click', name: 'Click Up', icon: '⚡' },
                  { id: 'uzum', name: 'Uzum Bank', icon: '🍇' },
                  { id: 'card', name: 'Visa / MC', icon: '🌐' }
                ].map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                    style={{
                      border: paymentMethod === p.id ? '2px solid var(--gold-500)' : '1px solid var(--slate-200)',
                      background: paymentMethod === p.id ? 'var(--gold-100)' : '#ffffff',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--navy-900)'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{p.icon}</div>
                    <div>{p.name}</div>
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--slate-200)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '0.75rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '4px' }}>
                    Karta raqami (Simulyatsiya)
                  </label>
                  <input 
                    type="text" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)} 
                    style={{ width: '100%', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '4px' }}>
                    Muddati
                  </label>
                  <input 
                    type="text" 
                    value={cardExpiry} 
                    onChange={(e) => setCardExpiry(e.target.value)} 
                    style={{ width: '100%', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                <ShieldCheck size={16} color="var(--status-available)" />
                <span>256-bit SSL shifrlangan xavfsiz to'lov. Double-booking himoyasi kafolatlangan.</span>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation & Success Screen (Section 67, 104) */}
          {step === 5 && confirmedReservation && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'var(--status-available-bg)',
                color: 'var(--status-available)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle2 size={44} />
              </div>

              <h3 style={{ fontSize: '1.6rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Xonangiz muvaffaqiyatli bron qilindi!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Sizning buyurtmangiz qabul qilindi va to'lovingiz tasdiqlandi. Tasdiqlash hujjati va kodi quyida keltirilgan:
              </p>

              {/* Confirmation Ticket Card */}
              <div style={{
                background: 'var(--slate-50)',
                border: '2px dashed var(--gold-400)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                maxWidth: '520px',
                margin: '0 auto 1.75rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>BRON RAQAMI (CONFIRMATION CODE)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '0.05em' }}>
                      {confirmedReservation.confirmationNumber}
                    </div>
                  </div>
                  <QrCode size={40} color="var(--navy-900)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.86rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Mehmon:</span>
                    <strong>{confirmedReservation.guest.firstName} {confirmedReservation.guest.lastName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Xona toifasi:</span>
                    <strong>{confirmedReservation.roomType.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Kelish sanasi:</span>
                    <strong>{confirmedReservation.checkInDate} (14:00)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-500)', display: 'block' }}>Ketish sanasi:</span>
                    <strong>{confirmedReservation.checkOutDate} (12:00)</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--slate-600)', fontSize: '0.88rem' }}>To'langan to'liq summa:</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--status-available)' }}>
                    {formatCurrency(confirmedReservation.totalAmount)} (To'landi)
                  </strong>
                </div>
              </div>

              {/* Notification Notice */}
              <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                ✉️ Tasdiqlash xati <strong>{guestEmail || 'pochtangizga'}</strong> va SMS xabar <strong>{guestPhone}</strong> raqamiga yuborildi.
              </div>

              {/* PMS Live Integration Notice */}
              <div style={{
                background: 'rgba(223, 183, 70, 0.15)',
                border: '1px solid var(--gold-400)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--navy-900)',
                marginBottom: '1.5rem'
              }}>
                💡 <strong>Yagona Tizim Afzalligi:</strong> Ushbu bron ayni damda Reception PMS panelida paydo bo'ldi va xona inventari real vaqt rejimida yangilandi!
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => window.print()}
                  className="btn btn-secondary"
                >
                  <Printer size={16} />
                  <span>Chekni chop etish</span>
                </button>

                <button 
                  onClick={() => {
                    onClose();
                    setSystemMode('pms');
                  }}
                  className="btn btn-navy"
                >
                  <span>🏨 PMS Panelida ko'rish</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="modal-footer">
            {step > 1 && (
              <button 
                onClick={() => setStep((step - 1) as any)} 
                className="btn btn-secondary"
                disabled={isProcessing}
              >
                <ArrowLeft size={16} />
                <span>Orqaga</span>
              </button>
            )}

            {step < 4 && (
              <button 
                onClick={() => {
                  if (step === 2 && (!guestFirstName.trim() || !guestLastName.trim() || !guestPhone.trim())) {
                    alert("Iltimos, ism, familiya va telefon raqamingizni kiriting!");
                    return;
                  }
                  setStep((step + 1) as any);
                }} 
                className="btn btn-primary"
              >
                <span>Davom etish</span>
                <ArrowRight size={16} />
              </button>
            )}

            {step === 4 && (
              <button 
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
                className="btn btn-primary"
                style={{ minWidth: '180px' }}
              >
                {isProcessing ? (
                  <span>To'lov o'tkazilmoqda...</span>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>To'lash & Tasdiqlash</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
