import { 
  RoomType, 
  Room, 
  Guest, 
  Reservation, 
  Folio, 
  RatePlan, 
  PromoCode, 
  ExtraServiceOption, 
  HousekeepingTask, 
  MaintenanceTicket, 
  StaffShift, 
  AuditLogEntry, 
  HotelNotification 
} from '../types/hotel';
import { getTodayDate, getNDaysLater } from '../utils/dates';

const today = getTodayDate();
const tomorrow = getNDaysLater(1, today);
const dayAfter = getNDaysLater(2, today);
const threeDaysLater = getNDaysLater(3, today);
const yesterday = getNDaysLater(-1, today);
const twoDaysAgo = getNDaysLater(-2, today);

export const initialRoomTypes: RoomType[] = [
  {
    id: 'rt_single',
    name: 'Single Deluxe',
    code: 'SGL-DLX',
    description: "Yakkaxon sayohatchilar va ish safari uchun qulay va zamonaviy xona. Tezkor Wi-Fi va ish stoli bilan ta'minlangan.",
    maxAdults: 1,
    maxChildren: 0,
    bedType: '1 ta yagona karavot (Single Bed)',
    sizeSqm: 24,
    basePrice: 350000,
    amenities: ['Wi-Fi 6', 'Konditsioner', 'Smart TV 43"', 'Elektron seyf', 'Mini-muzlatgich', 'Flesh dush', 'Ish stoli'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  },
  {
    id: 'rt_double',
    name: 'Standard Double',
    code: 'STD-DBL',
    description: "Juftliklar va qulaylikni qadrlaydigan mehmonlar uchun keng yotoq va shinam atmosfera.",
    maxAdults: 2,
    maxChildren: 1,
    bedType: '1 ta katta karavot (Queen Bed)',
    sizeSqm: 32,
    basePrice: 520000,
    amenities: ['Wi-Fi 6', 'Smart TV 50"', 'Konditsioner', 'Mini-bar', 'Choy/Qahva to\'plami', 'Fen', 'Balkon', 'Xalat va shippak'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  },
  {
    id: 'rt_deluxe_king',
    name: 'Deluxe King Room',
    code: 'DLX-KNG',
    description: "Yuqori qavatdagi panoramik shahar manzarasi, King size karavot va marmar hammomga ega hashamatli xona.",
    maxAdults: 2,
    maxChildren: 1,
    bedType: '1 ta ulkan King Size karavot',
    sizeSqm: 42,
    basePrice: 780000,
    amenities: ['Panoramik manzara', 'Smart TV 55"', 'Nespresso kofe mashinasi', 'Italyan marmar hammom', 'Mini-bar', 'Wi-Fi 6', 'Shovqinsiz oynalar', 'Pillow Menu'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  },
  {
    id: 'rt_suite',
    name: 'Executive Suite',
    code: 'EXE-STE',
    description: "Alohida mehmonxona (living room) va yotoqxonadan iborat nufuzli lyuks suit. VIP mehmonlar uchun maxsus xizmatlar.",
    maxAdults: 3,
    maxChildren: 2,
    bedType: '1 King Bed + 1 Katta divan-karavot',
    sizeSqm: 60,
    basePrice: 1250000,
    amenities: ['Alohida yashash xonasi', 'Jakuzi va alohida dush', 'Lounge zonasi', 'Smart TV 65"', 'VIP transfer huquqi', 'Keng garderob', '24/7 Butler xizmati'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  },
  {
    id: 'rt_presidential',
    name: 'Presidential Family Suite',
    code: 'PRS-FAM',
    description: "Mehmonxonamizning eng hashamatli qarorgohi. Katta oilalar va yuqori martabali mehmonlar uchun 2 ta yotoqxona va keng zal.",
    maxAdults: 5,
    maxChildren: 3,
    bedType: '2 ta King Bed + 2 ta bolalar karavoti',
    sizeSqm: 95,
    basePrice: 1950000,
    amenities: ['2 ta alohida yotoqxona', 'Katta oshxona burchagi', 'Shaxsiy sauna va jakuzi', '2 ta hammom', 'Oshxona stoli', 'Smart TV har xonada', 'VIP konsyerj'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  }
];

export const initialRooms: Room[] = [
  // 1-qavat: Single Deluxe
  {
    id: 'room_101',
    roomNumber: '101',
    roomTypeId: 'rt_single',
    floor: 1,
    status: 'available',
    housekeepingStatus: 'clean',
    isActive: true,
    notes: 'Tinch hovli tomonga qaragan'
  },
  {
    id: 'room_102',
    roomNumber: '102',
    roomTypeId: 'rt_single',
    floor: 1,
    status: 'occupied',
    housekeepingStatus: 'clean',
    isActive: true,
    assignedGuestName: 'Rustam Rahimov',
    currentReservationId: 'res_001'
  },

  // 2-qavat: Standard Double
  {
    id: 'room_201',
    roomNumber: '201',
    roomTypeId: 'rt_double',
    floor: 2,
    status: 'available',
    housekeepingStatus: 'clean',
    isActive: true
  },
  {
    id: 'room_202',
    roomNumber: '202',
    roomTypeId: 'rt_double',
    floor: 2,
    status: 'occupied',
    housekeepingStatus: 'clean',
    isActive: true,
    assignedGuestName: 'Elena Petrova',
    currentReservationId: 'res_002'
  },
  {
    id: 'room_203',
    roomNumber: '203',
    roomTypeId: 'rt_double',
    floor: 2,
    status: 'dirty',
    housekeepingStatus: 'dirty',
    isActive: true,
    notes: 'Bugun check-out qilingan, tozalash kutilyapti'
  },

  // 3-qavat: Deluxe King
  {
    id: 'room_301',
    roomNumber: '301',
    roomTypeId: 'rt_deluxe_king',
    floor: 3,
    status: 'reserved',
    housekeepingStatus: 'inspected',
    isActive: true,
    assignedGuestName: 'Aliyev Jasur (Bugun keladi)',
    currentReservationId: 'res_003'
  },
  {
    id: 'room_302',
    roomNumber: '302',
    roomTypeId: 'rt_deluxe_king',
    floor: 3,
    status: 'available',
    housekeepingStatus: 'clean',
    isActive: true
  },
  {
    id: 'room_303',
    roomNumber: '303',
    roomTypeId: 'rt_deluxe_king',
    floor: 3,
    status: 'occupied',
    housekeepingStatus: 'clean',
    isActive: true,
    assignedGuestName: 'Farhod Karimov',
    currentReservationId: 'res_004'
  },
  {
    id: 'room_304',
    roomNumber: '304',
    roomTypeId: 'rt_deluxe_king',
    floor: 3,
    status: 'maintenance',
    housekeepingStatus: 'dirty',
    isActive: true,
    notes: 'Konditsioner filtri almashtirilmoqda (Ticket #M-102)'
  },

  // 4-qavat: Executive Suite
  {
    id: 'room_401',
    roomNumber: '401',
    roomTypeId: 'rt_suite',
    floor: 4,
    status: 'available',
    housekeepingStatus: 'inspected',
    isActive: true,
    notes: 'VIP mehmonlar uchun tayyor'
  },
  {
    id: 'room_402',
    roomNumber: '402',
    roomTypeId: 'rt_suite',
    floor: 4,
    status: 'reserved',
    housekeepingStatus: 'clean',
    isActive: true,
    assignedGuestName: 'Sardor Mirzayev',
    currentReservationId: 'res_005'
  },

  // 5-qavat: Presidential Suite
  {
    id: 'room_501',
    roomNumber: '501',
    roomTypeId: 'rt_presidential',
    floor: 5,
    status: 'available',
    housekeepingStatus: 'inspected',
    isActive: true,
    notes: 'Penthouse floor, maxsus qo\'riqlash tizimi'
  },
  {
    id: 'room_502',
    roomNumber: '502',
    roomTypeId: 'rt_presidential',
    floor: 5,
    status: 'cleaning',
    housekeepingStatus: 'cleaning',
    isActive: true,
    notes: 'General tozalash jarayonida'
  }
];

export const initialGuests: Guest[] = [
  {
    id: 'gst_001',
    firstName: 'Rustam',
    lastName: 'Rahimov',
    phone: '+998 90 123 45 67',
    email: 'rustam.rahimov@gmail.com',
    nationality: 'O\'zbekiston',
    passportNumber: 'AB1234567',
    country: 'O\'zbekiston',
    city: 'Samarqand',
    notes: 'Doimiy mehmon, tinch xonalarni afzal ko\'radi',
    preferences: ['Tinch xona', 'Yuqori qavat', 'Extra yostiq'],
    totalStays: 4,
    isVIP: true,
    createdAt: '2025-11-12'
  },
  {
    id: 'gst_002',
    firstName: 'Elena',
    lastName: 'Petrova',
    phone: '+998 97 765 43 21',
    email: 'elena.petrova@mail.ru',
    nationality: 'Rossiya',
    passportNumber: '75N984210',
    country: 'Rossiya',
    city: 'Moskva',
    notes: 'Nonushtani xonaga buyurtma qiladi',
    preferences: ['Nonushta xonada', 'Late checkout'],
    totalStays: 2,
    isVIP: false,
    createdAt: '2026-02-14'
  },
  {
    id: 'gst_003',
    firstName: 'Jasur',
    lastName: 'Aliyev',
    phone: '+998 93 555 77 99',
    email: 'jasur.aliyev@techno.uz',
    nationality: 'O\'zbekiston',
    passportNumber: 'AA9876543',
    country: 'O\'zbekiston',
    city: 'Toshkent',
    notes: 'Bugun soat 14:00 da kelishi kutilmoqda (Arrival)',
    preferences: ['King bed', 'Espresso coffee'],
    totalStays: 1,
    isVIP: false,
    createdAt: today
  },
  {
    id: 'gst_004',
    firstName: 'Farhod',
    lastName: 'Karimov',
    phone: '+998 99 888 22 11',
    email: 'farhod.k@invest.uz',
    nationality: 'O\'zbekiston',
    passportNumber: 'AC4455667',
    country: 'O\'zbekiston',
    city: 'Buxoro',
    companyName: 'Buxoro Invest LLC',
    notes: 'Korporativ mijoz, bugun kechqurun chiqib ketadi (Departure)',
    preferences: ['Panoramik manzara'],
    totalStays: 6,
    isVIP: true,
    createdAt: '2025-06-20'
  },
  {
    id: 'gst_005',
    firstName: 'Sardor',
    lastName: 'Mirzayev',
    phone: '+998 91 333 44 55',
    email: 'smirzayev@gmail.com',
    nationality: 'O\'zbekiston',
    passportNumber: 'AB6677889',
    country: 'O\'zbekiston',
    city: 'Farg\'ona',
    notes: 'Sayt orqali bron qilgan (Website)',
    totalStays: 1,
    isVIP: false,
    createdAt: today
  }
];

export const initialRatePlans: RatePlan[] = [
  {
    id: 'rp_standard',
    name: 'Standard Moslashuvchan Tarif (Flexible)',
    code: 'FLEX',
    description: 'Kelishdan 48 soat oldin bepul bekor qilish imkoniyati. Xavfsiz va qulay.',
    priceMultiplier: 1.0,
    isRefundable: true,
    cancellationHours: 48,
    breakfastIncluded: false
  },
  {
    id: 'rp_non_refundable',
    name: 'Tejamkor Tarif (-15% Non-refundable)',
    code: 'NON-REF',
    description: '15% arzonroq narx. To\'lov oldindan yechiladi va bekor qilinganda qaytarilmaydi.',
    priceMultiplier: 0.85,
    isRefundable: false,
    cancellationHours: 0,
    breakfastIncluded: false
  },
  {
    id: 'rp_breakfast',
    name: 'Nonushta kiritilgan Tarif (Bed & Breakfast)',
    code: 'BB-RATE',
    description: 'Restoranimizda shved stoli ko\'rinishidagi to\'yimli nonushta kiritilgan.',
    priceMultiplier: 1.15,
    isRefundable: true,
    cancellationHours: 24,
    breakfastIncluded: true
  },
  {
    id: 'rp_long_stay',
    name: 'Uzoq muddatli yashash (Long Stay 4+ kecha)',
    code: 'LONG-STAY',
    description: '4 kecha va undan ortiq qoladigan mehmonlar uchun 10% doimiy chegirma.',
    priceMultiplier: 0.90,
    isRefundable: true,
    cancellationHours: 48,
    breakfastIncluded: false
  }
];

export const initialExtraServices: ExtraServiceOption[] = [
  {
    id: 'srv_breakfast',
    name: 'Shved stoli nonushtasi (Buffet Breakfast)',
    category: 'breakfast',
    price: 80000,
    unit: 'per_day',
    description: 'Har kuni 07:00 dan 10:30 gacha boy milliy va yevropa oshxonasi taomlari.',
    iconName: 'Coffee'
  },
  {
    id: 'srv_transfer',
    name: 'VIP Aeroport kutib olish / kuzatish',
    category: 'transfer',
    price: 180000,
    unit: 'per_stay',
    description: 'Mercedes-Benz E-Class avtomobilida haydovchi bilan qulay transfer.',
    iconName: 'Car'
  },
  {
    id: 'srv_laundry',
    name: 'Express Kir yuvish va dazmollash',
    category: 'laundry',
    price: 60000,
    unit: 'per_stay',
    description: 'Kiyimlarni 3 soat ichida toza va tekislangan holda xonaga yetkazish.',
    iconName: 'Shirt'
  },
  {
    id: 'srv_minibar',
    name: 'Premium Minibar to\'plami',
    category: 'minibar',
    price: 120000,
    unit: 'per_stay',
    description: 'Tabiiy sharbatlar, premium shokolad, quritilgan mevalar va gazaklar.',
    iconName: 'Wine'
  },
  {
    id: 'srv_extrabed',
    name: 'Qo\'shimcha karavot (Extra Bed)',
    category: 'extra_bed',
    price: 150000,
    unit: 'per_day',
    description: 'Bolalar yoki qo\'shimcha mehmon uchun yumshoq ortopedik karavot.',
    iconName: 'BedDouble'
  }
];

export const initialPromoCodes: PromoCode[] = [
  {
    code: 'WELCOME10',
    discountPercent: 10,
    validUntil: '2026-12-31',
    description: 'Yangi online mehmonlar uchun 10% xush kelibsiz chegirmasi',
    isActive: true,
    usageCount: 24
  },
  {
    code: 'VIPGUEST',
    discountPercent: 15,
    validUntil: '2026-12-31',
    description: 'VIP mijozlar uchun 15% maxsus chegirma',
    isActive: true,
    usageCount: 8
  },
  {
    code: 'AUTUMN2026',
    discountPercent: 12,
    validUntil: '2026-11-30',
    description: 'Kuzgi mavsumiy sayohat aksiyasi',
    isActive: true,
    usageCount: 15
  }
];

export const initialReservations: Reservation[] = [
  // 1. Rustam Rahimov: In-House (Room 102)
  {
    id: 'res_001',
    confirmationNumber: 'HTL-20261001-A102R',
    guestId: 'gst_001',
    guest: initialGuests[0],
    roomTypeId: 'rt_single',
    roomType: initialRoomTypes[0],
    roomId: 'room_102',
    assignedRoomNumber: '102',
    checkInDate: yesterday,
    checkOutDate: dayAfter,
    adults: 1,
    children: 0,
    ratePlanId: 'rp_standard',
    ratePlanName: 'Standard Moslashuvchan Tarif',
    source: 'reception',
    status: 'checked_in',
    selectedServices: [
      { serviceId: 'srv_breakfast', name: 'Shved stoli nonushtasi', price: 80000, quantity: 3 }
    ],
    nightlyRate: 350000,
    nightsCount: 3,
    roomTotal: 1050000,
    servicesTotal: 240000,
    discountAmount: 0,
    taxAmount: 154800, // 12% QQS
    totalAmount: 1444800,
    paidAmount: 1000000,
    balance: 444800,
    paymentStatus: 'partial',
    depositAmount: 200000,
    specialRequests: 'Tinch xona berilsin',
    createdAt: getNDaysLater(-3, today),
    updatedAt: yesterday,
    checkInTime: `${yesterday} 14:15`
  },

  // 2. Elena Petrova: In-House (Room 202)
  {
    id: 'res_002',
    confirmationNumber: 'HTL-20260930-B202P',
    guestId: 'gst_002',
    guest: initialGuests[1],
    roomTypeId: 'rt_double',
    roomType: initialRoomTypes[1],
    roomId: 'room_202',
    assignedRoomNumber: '202',
    checkInDate: twoDaysAgo,
    checkOutDate: tomorrow,
    adults: 2,
    children: 0,
    ratePlanId: 'rp_breakfast',
    ratePlanName: 'Nonushta kiritilgan Tarif',
    source: 'website',
    status: 'checked_in',
    selectedServices: [
      { serviceId: 'srv_transfer', name: 'VIP Aeroport kutib olish', price: 180000, quantity: 1 }
    ],
    nightlyRate: 598000,
    nightsCount: 3,
    roomTotal: 1794000,
    servicesTotal: 180000,
    discountAmount: 0,
    taxAmount: 236880,
    totalAmount: 2210880,
    paidAmount: 2210880,
    balance: 0,
    paymentStatus: 'paid',
    createdAt: getNDaysLater(-5, today),
    updatedAt: twoDaysAgo,
    checkInTime: `${twoDaysAgo} 15:30`
  },

  // 3. Jasur Aliyev: TODAY'S ARRIVAL (Room 301 reserved, pending check-in)
  {
    id: 'res_003',
    confirmationNumber: 'HTL-20261002-C301A',
    guestId: 'gst_003',
    guest: initialGuests[2],
    roomTypeId: 'rt_deluxe_king',
    roomType: initialRoomTypes[2],
    roomId: 'room_301',
    assignedRoomNumber: '301',
    checkInDate: today,
    checkOutDate: threeDaysLater,
    adults: 2,
    children: 1,
    ratePlanId: 'rp_standard',
    ratePlanName: 'Standard Moslashuvchan Tarif',
    source: 'phone',
    status: 'confirmed',
    selectedServices: [
      { serviceId: 'srv_breakfast', name: 'Shved stoli nonushtasi', price: 80000, quantity: 3 }
    ],
    nightlyRate: 780000,
    nightsCount: 3,
    roomTotal: 2340000,
    servicesTotal: 240000,
    discountAmount: 0,
    taxAmount: 309600,
    totalAmount: 2889600,
    paidAmount: 1000000,
    balance: 1889600,
    paymentStatus: 'partial',
    specialRequests: 'Bolalar uchun qulay karavot',
    createdAt: getNDaysLater(-2, today),
    updatedAt: today
  },

  // 4. Farhod Karimov: TODAY'S DEPARTURE (Room 303, check-out today!)
  {
    id: 'res_004',
    confirmationNumber: 'HTL-20260929-D303K',
    guestId: 'gst_004',
    guest: initialGuests[3],
    roomTypeId: 'rt_deluxe_king',
    roomType: initialRoomTypes[2],
    roomId: 'room_303',
    assignedRoomNumber: '303',
    checkInDate: getNDaysLater(-3, today),
    checkOutDate: today,
    adults: 1,
    children: 0,
    ratePlanId: 'rp_standard',
    ratePlanName: 'Standard Moslashuvchan Tarif',
    source: 'walk_in',
    status: 'checked_in',
    selectedServices: [
      { serviceId: 'srv_minibar', name: 'Premium Minibar to\'plami', price: 120000, quantity: 1 },
      { serviceId: 'srv_laundry', name: 'Express Kir yuvish', price: 60000, quantity: 1 }
    ],
    nightlyRate: 780000,
    nightsCount: 3,
    roomTotal: 2340000,
    servicesTotal: 180000,
    discountAmount: 100000, // VIP discount
    taxAmount: 290400,
    totalAmount: 2710400,
    paidAmount: 2500000,
    balance: 210400,
    paymentStatus: 'partial',
    createdAt: getNDaysLater(-4, today),
    updatedAt: today,
    checkInTime: `${getNDaysLater(-3, today)} 16:00`
  },

  // 5. Sardor Mirzayev: UPCOMING ONLINE BOOKING (Room 402, arrives tomorrow)
  {
    id: 'res_005',
    confirmationNumber: 'HTL-20261002-E402M',
    guestId: 'gst_005',
    guest: initialGuests[4],
    roomTypeId: 'rt_suite',
    roomType: initialRoomTypes[3],
    roomId: 'room_402',
    assignedRoomNumber: '402',
    checkInDate: tomorrow,
    checkOutDate: getNDaysLater(4, today),
    adults: 2,
    children: 1,
    ratePlanId: 'rp_non_refundable',
    ratePlanName: 'Tejamkor Tarif (-15%)',
    source: 'website',
    status: 'confirmed',
    selectedServices: [
      { serviceId: 'srv_transfer', name: 'VIP Aeroport kutib olish', price: 180000, quantity: 1 }
    ],
    nightlyRate: 1062500, // 1,250,000 * 0.85
    nightsCount: 3,
    roomTotal: 3187500,
    servicesTotal: 180000,
    promoCodeApplied: 'WELCOME10',
    discountAmount: 336750,
    taxAmount: 363690,
    totalAmount: 3394440,
    paidAmount: 3394440,
    balance: 0,
    paymentStatus: 'paid',
    createdAt: today,
    updatedAt: today
  }
];

export const initialFolios: Folio[] = [
  {
    id: 'fol_res_001',
    reservationId: 'res_001',
    guestId: 'gst_001',
    items: [
      { id: 'fi_1', date: yesterday, category: 'room', description: 'Room 102 - 1-kecha', quantity: 1, unitPrice: 350000, totalPrice: 350000 },
      { id: 'fi_2', date: today, category: 'room', description: 'Room 102 - 2-kecha', quantity: 1, unitPrice: 350000, totalPrice: 350000 },
      { id: 'fi_3', date: tomorrow, category: 'room', description: 'Room 102 - 3-kecha', quantity: 1, unitPrice: 350000, totalPrice: 350000 },
      { id: 'fi_4', date: yesterday, category: 'breakfast', description: 'Shved stoli nonushtasi (3 kun)', quantity: 3, unitPrice: 80000, totalPrice: 240000 }
    ],
    payments: [
      { id: 'pay_1', date: yesterday, amount: 1000000, paymentMethod: 'card', transactionRef: 'POS-774910', note: 'Oldindan to\'lov', receivedBy: 'Vali Karimov' }
    ],
    subtotal: 1290000,
    taxAmount: 154800,
    serviceCharge: 0,
    discountAmount: 0,
    total: 1444800,
    paidTotal: 1000000,
    balance: 444800,
    status: 'open'
  },
  {
    id: 'fol_res_004',
    reservationId: 'res_004',
    guestId: 'gst_004',
    items: [
      { id: 'fi_10', date: getNDaysLater(-3, today), category: 'room', description: 'Deluxe King 303 - 3 kecha', quantity: 3, unitPrice: 780000, totalPrice: 2340000 },
      { id: 'fi_11', date: getNDaysLater(-2, today), category: 'minibar', description: 'Premium Minibar ichimliklari', quantity: 1, unitPrice: 120000, totalPrice: 120000 },
      { id: 'fi_12', date: yesterday, category: 'laundry', description: 'Express Kir yuvish xizmati', quantity: 1, unitPrice: 60000, totalPrice: 60000 }
    ],
    payments: [
      { id: 'pay_2', date: getNDaysLater(-3, today), amount: 2500000, paymentMethod: 'bank_transfer', transactionRef: 'BNK-990234', receivedBy: 'Nodira Salimova' }
    ],
    subtotal: 2520000,
    taxAmount: 290400,
    serviceCharge: 0,
    discountAmount: 100000,
    total: 2710400,
    paidTotal: 2500000,
    balance: 210400,
    status: 'open'
  }
];

export const initialHousekeepingTasks: HousekeepingTask[] = [
  {
    id: 'hk_001',
    roomId: 'room_203',
    roomNumber: '203',
    taskType: 'checkout_clean',
    assignedTo: 'Dilnoza Karimova',
    priority: 'high',
    status: 'pending',
    notes: 'Soat 12:00 da mehmon chiqib ketdi. Yostiq va choyshablar to\'liq yangilansin.'
  },
  {
    id: 'hk_002',
    roomId: 'room_502',
    roomNumber: '502',
    taskType: 'deep_clean',
    assignedTo: 'Nargiza Alimova',
    priority: 'normal',
    status: 'in_progress',
    notes: 'Presidential suit gilamlari kimyoviy tozalanmoqda',
    startedAt: `${today} 10:30`
  },
  {
    id: 'hk_003',
    roomId: 'room_301',
    roomNumber: '301',
    taskType: 'inspection',
    assignedTo: 'Supervisor Shahnoza',
    priority: 'urgent',
    status: 'inspected',
    notes: 'Bugun soat 14:00 da VIP mehmon kelishi kutilmoqda. Barcha jihozlar tekshirildi va tasdiqlandi.',
    completedAt: `${today} 11:45`
  }
];

export const initialMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'mnt_001',
    roomId: 'room_304',
    roomNumber: '304',
    title: 'Konditsioner sovutmayapti',
    description: 'Chiller tizimidan havo yetarli kelmayapti, filtr tozalanishi va freon tekshirilishi kerak.',
    priority: 'high',
    assignedTo: 'Usta Ilhom (Texnik bo\'lim)',
    status: 'in_progress',
    createdAt: `${yesterday} 16:40`
  }
];

export const initialShift: StaffShift = {
  id: 'shf_001',
  shiftName: 'morning',
  operatorName: 'Vali Karimov (Receptionist)',
  date: today,
  startTime: '08:00',
  openingCashBalance: 2500000,
  cashReceived: 1200000,
  cashRefunds: 0,
  expenses: 50000,
  expectedCash: 3650000,
  status: 'active'
};

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud_001',
    timestamp: `${today} 08:15`,
    operator: 'Vali Karimov',
    role: 'Receptionist',
    action: 'Smena ochildi',
    entityType: 'shift',
    entityId: 'shf_001',
    details: 'Ertalabki smena boshlandi. Boshlang\'ich naqd kassa qoldig\'i: 2 500 000 so\'m'
  },
  {
    id: 'aud_002',
    timestamp: `${today} 09:30`,
    operator: 'Online Booking Engine',
    role: 'System',
    action: 'Yangi online bron qilindi',
    entityType: 'reservation',
    entityId: 'res_005',
    details: 'Mehmon: Sardor Mirzayev. Xona: Executive Suite 402. To\'lov to\'liq tasdiqlandi (Click).'
  },
  {
    id: 'aud_003',
    timestamp: `${today} 11:45`,
    operator: 'Supervisor Shahnoza',
    role: 'Housekeeping',
    action: 'Xona tekshirildi va tasdiqlandi',
    entityType: 'room',
    entityId: 'room_301',
    details: '301-xona tozaligi tekshirildi, status: Inspected -> Available holatiga o\'tkazildi.'
  }
];

export const initialNotifications: HotelNotification[] = [
  {
    id: 'notif_1',
    title: 'Yangi Online Bron!',
    message: 'Executive Suite 402 xonasi 3 kunga online bron qilindi (#HTL-20261002-E402M).',
    timestamp: '10 daqiqa oldin',
    type: 'booking',
    isRead: false
  },
  {
    id: 'notif_2',
    title: 'Bugun kelish (Arrival)',
    message: 'Jasur Aliyev (301-xona) soat 14:00 da kelishi kutilmoqda.',
    timestamp: '35 daqiqa oldin',
    type: 'checkin',
    isRead: false
  },
  {
    id: 'notif_3',
    title: 'Nosozlik xabari (Maintenance)',
    message: '304-xona konditsioneri bo\'yicha ish jarayoni davom etmoqda.',
    timestamp: '1 soat oldin',
    type: 'maintenance',
    isRead: true
  }
];
