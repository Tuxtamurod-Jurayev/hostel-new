import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Room, 
  RoomType, 
  Reservation, 
  Guest, 
  Folio, 
  HousekeepingTask, 
  MaintenanceTicket, 
  RatePlan, 
  PromoCode, 
  ExtraServiceOption, 
  StaffShift, 
  AuditLogEntry, 
  HotelNotification,
  UserRole,
  HousekeepingStatus,
  FolioItem,
  PaymentTransaction,
  PaymentMethod
} from '../types/hotel';
import { 
  initialRooms, 
  initialRoomTypes, 
  initialReservations, 
  initialGuests, 
  initialFolios, 
  initialHousekeepingTasks, 
  initialMaintenanceTickets, 
  initialRatePlans, 
  initialPromoCodes, 
  initialExtraServices, 
  initialShift, 
  initialAuditLogs, 
  initialNotifications 
} from '../data/initialData';
import { isDateOverlap, getTodayDate, calculateNights } from '../utils/dates';
import { generateConfirmationNumber, generateId } from '../utils/formatters';

interface AvailabilityResult {
  availableCount: number;
  availableRealRooms: Room[];
  totalRoomsOfType: number;
  isAvailable: boolean;
}

interface CreateOnlineReservationParams {
  roomTypeId: string;
  ratePlanId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  guestFirstName: string;
  guestLastName: string;
  guestPhone: string;
  guestEmail: string;
  guestPassport: string;
  guestNationality?: string;
  selectedServices: { serviceId: string; quantity: number }[];
  promoCode?: string;
  paymentMethod: PaymentMethod;
  specialRequests?: string;
}

interface CreateReceptionReservationParams {
  guestId?: string;
  newGuest?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    passportNumber: string;
    nationality: string;
    isVIP?: boolean;
    notes?: string;
  };
  roomTypeId: string;
  roomId?: string; // specific physical room
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  ratePlanId: string;
  source: 'reception' | 'walk_in' | 'phone' | 'corporate';
  selectedServices: { serviceId: string; quantity: number }[];
  initialPaymentAmount?: number;
  paymentMethod?: PaymentMethod;
  specialRequests?: string;
  isInstantCheckIn?: boolean; // Walk-in immediate check-in
}

interface HotelContextType {
  // State
  rooms: Room[];
  roomTypes: RoomType[];
  reservations: Reservation[];
  guests: Guest[];
  folios: Folio[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceTickets: MaintenanceTicket[];
  ratePlans: RatePlan[];
  promoCodes: PromoCode[];
  extraServices: ExtraServiceOption[];
  shift: StaffShift;
  auditLogs: AuditLogEntry[];
  notifications: HotelNotification[];
  currentUserRole: UserRole;
  systemMode: 'public' | 'pms';
  unreadNotificationCount: number;

  // Actions
  setSystemMode: (mode: 'public' | 'pms') => void;
  setCurrentUserRole: (role: UserRole) => void;
  checkAvailability: (roomTypeId: string, checkInDate: string, checkOutDate: string, excludeReservationId?: string) => AvailabilityResult;
  createOnlineReservation: (params: CreateOnlineReservationParams) => { success: boolean; reservation?: Reservation; error?: string };
  createReceptionReservation: (params: CreateReceptionReservationParams) => { success: boolean; reservation?: Reservation; error?: string };
  checkInGuest: (reservationId: string, assignedRoomId?: string, depositAmount?: number) => { success: boolean; error?: string };
  checkOutGuest: (reservationId: string) => { success: boolean; error?: string; remainingBalance?: number };
  assignOrChangeRoom: (reservationId: string, newRoomId: string, reason?: string) => { success: boolean; error?: string };
  cancelReservation: (reservationId: string, reason: string) => { success: boolean; error?: string };
  markAsNoShow: (reservationId: string) => { success: boolean; error?: string };
  addFolioItem: (reservationId: string, item: Omit<FolioItem, 'id'>) => void;
  addPayment: (reservationId: string, amount: number, method: PaymentMethod, note?: string) => void;
  updateRoomHousekeeping: (roomId: string, status: HousekeepingStatus, notes?: string) => void;
  createMaintenanceTicket: (roomId: string, title: string, description: string, priority: MaintenanceTicket['priority']) => void;
  resolveMaintenanceTicket: (ticketId: string) => void;
  recordCashTransaction: (type: 'deposit' | 'expense', amount: number, note: string) => void;
  closeShift: (actualCash: number, notes?: string) => void;
  addNotification: (title: string, message: string, type: HotelNotification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEY = 'hotel_pms_silkroad_v1';

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to initial dataset
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [roomTypes] = useState<RoomType[]>(initialRoomTypes);

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reservations`);
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_guests`);
    return saved ? JSON.parse(saved) : initialGuests;
  });

  const [folios, setFolios] = useState<Folio[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_folios`);
    return saved ? JSON.parse(saved) : initialFolios;
  });

  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_housekeeping`);
    return saved ? JSON.parse(saved) : initialHousekeepingTasks;
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_maintenance`);
    return saved ? JSON.parse(saved) : initialMaintenanceTickets;
  });

  const [ratePlans] = useState<RatePlan[]>(initialRatePlans);
  const [promoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [extraServices] = useState<ExtraServiceOption[]>(initialExtraServices);

  const [shift, setShift] = useState<StaffShift>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_shift`);
    return saved ? JSON.parse(saved) : initialShift;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [notifications, setNotifications] = useState<HotelNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('super_admin');
  const [systemMode, setSystemMode] = useState<'public' | 'pms'>('public');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reservations`, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guests`, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_folios`, JSON.stringify(folios));
  }, [folios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_housekeeping`, JSON.stringify(housekeepingTasks));
  }, [housekeepingTasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_maintenance`, JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_shift`, JSON.stringify(shift));
  }, [shift]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Logging helper
  const logAudit = (action: string, entityType: AuditLogEntry['entityType'], entityId: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: generateId('aud'),
      timestamp: `${getTodayDate()} ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`,
      operator: currentUserRole === 'guest' ? 'Online Mehmon' : 'Vali Karimov (Operator)',
      role: currentUserRole,
      action,
      entityType,
      entityId,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Notification helper
  const addNotification = (title: string, message: string, type: HotelNotification['type']) => {
    const newNotif: HotelNotification = {
      id: generateId('notif'),
      title,
      message,
      timestamp: 'Hozirgina',
      type,
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  /**
   * AVAILABILITY ALGORITHM (Section 13, 101, 103)
   * Real rooms of this type
   * - Rooms with overlapping active reservations (confirmed, checked_in, tentative)
   * - Rooms currently out of order or maintenance
   */
  const checkAvailability = (
    roomTypeId: string, 
    checkInDate: string, 
    checkOutDate: string, 
    excludeReservationId?: string
  ): AvailabilityResult => {
    const allRoomsOfType = rooms.filter(r => r.roomTypeId === roomTypeId && r.isActive);
    const totalRoomsOfType = allRoomsOfType.length;

    // Find all active reservations that overlap with requested range
    const overlappingReservations = reservations.filter(res => {
      if (excludeReservationId && res.id === excludeReservationId) return false;
      if (res.status === 'cancelled' || res.status === 'checked_out' || res.status === 'no_show') {
        return false;
      }
      if (res.roomTypeId !== roomTypeId) return false;
      return isDateOverlap(res.checkInDate, res.checkOutDate, checkInDate, checkOutDate);
    });

    // Determine which physical rooms are already committed
    const occupiedOrReservedRoomIds = new Set<string>();
    overlappingReservations.forEach(res => {
      if (res.roomId) {
        occupiedOrReservedRoomIds.add(res.roomId);
      }
    });

    // Also exclude rooms undergoing maintenance or out of order
    const maintenanceRoomIds = new Set(
      rooms
        .filter(r => r.roomTypeId === roomTypeId && (r.status === 'maintenance' || r.status === 'out_of_order' || r.status === 'blocked'))
        .map(r => r.id)
    );

    // Free physical rooms that have no conflict
    const availableRealRooms = allRoomsOfType.filter(r => 
      !occupiedOrReservedRoomIds.has(r.id) && !maintenanceRoomIds.has(r.id)
    );

    // Net available count taking into account reservations without assigned rooms yet
    const unassignedReservationsCount = overlappingReservations.filter(r => !r.roomId).length;
    const netAvailableCount = Math.max(0, availableRealRooms.length - unassignedReservationsCount);

    return {
      availableCount: netAvailableCount,
      availableRealRooms,
      totalRoomsOfType,
      isAvailable: netAvailableCount > 0
    };
  };

  /**
   * CREATE ONLINE RESERVATION (Section 11, 20, 101, 104)
   */
  const createOnlineReservation = (params: CreateOnlineReservationParams) => {
    // 1. Strict real-time availability check
    const availability = checkAvailability(params.roomTypeId, params.checkInDate, params.checkOutDate);
    if (!availability.isAvailable) {
      return { 
        success: false, 
        error: "Afsuski, tanlangan sanalarda ushbu xona turida bo'sh joy qolmadi (Double-booking himoyasi)." 
      };
    }

    const roomType = roomTypes.find(rt => rt.id === params.roomTypeId)!;
    const ratePlan = ratePlans.find(rp => rp.id === params.ratePlanId) || ratePlans[0];
    const nights = calculateNights(params.checkInDate, params.checkOutDate);

    // 2. Find or create Guest (Repeat Guest check by phone or passport)
    let guest = guests.find(g => 
      g.phone.replace(/\D/g, '') === params.guestPhone.replace(/\D/g, '') || 
      (params.guestPassport && g.passportNumber.toUpperCase() === params.guestPassport.toUpperCase())
    );

    if (guest) {
      // Repeat guest found! Update stay count
      guest = { ...guest, totalStays: guest.totalStays + 1 };
      setGuests(prev => prev.map(g => g.id === guest!.id ? guest! : g));
    } else {
      guest = {
        id: generateId('gst'),
        firstName: params.guestFirstName,
        lastName: params.guestLastName,
        phone: params.guestPhone,
        email: params.guestEmail,
        nationality: params.guestNationality || "O'zbekiston",
        passportNumber: params.guestPassport || 'ONLINE_PENDING',
        country: "O'zbekiston",
        totalStays: 1,
        isVIP: false,
        createdAt: getTodayDate()
      };
      setGuests(prev => [guest!, ...prev]);
    }

    // 3. Calculate Pricing
    const baseNightly = roomType.basePrice * ratePlan.priceMultiplier;
    const roomTotal = baseNightly * nights;

    // Services calculation
    const formattedServices = params.selectedServices.map(s => {
      const svc = extraServices.find(es => es.id === s.serviceId);
      const price = svc ? svc.price : 0;
      const name = svc ? svc.name : 'Qo\'shimcha xizmat';
      return {
        serviceId: s.serviceId,
        name,
        price,
        quantity: s.quantity
      };
    });

    const servicesTotal = formattedServices.reduce((sum, s) => sum + (s.price * s.quantity), 0);

    // Promo code discount
    let discountAmount = 0;
    if (params.promoCode) {
      const foundPromo = promoCodes.find(p => p.code.toUpperCase() === params.promoCode?.toUpperCase() && p.isActive);
      if (foundPromo) {
        discountAmount = Math.round((roomTotal * foundPromo.discountPercent) / 100);
      }
    }

    // Repeat guest loyalty discount (5% if >= 3 stays)
    if (guest.totalStays >= 3 && discountAmount === 0) {
      discountAmount = Math.round(roomTotal * 0.05);
    }

    const subtotal = roomTotal + servicesTotal - discountAmount;
    const taxAmount = Math.round(subtotal * 0.12); // 12% VAT
    const totalAmount = subtotal + taxAmount;

    // Auto-assign first available real room if possible
    const assignedRoom = availability.availableRealRooms[0];
    const confirmationNumber = generateConfirmationNumber();

    const reservationId = generateId('res');

    const newReservation: Reservation = {
      id: reservationId,
      confirmationNumber,
      guestId: guest.id,
      guest,
      roomTypeId: roomType.id,
      roomType,
      roomId: assignedRoom?.id,
      assignedRoomNumber: assignedRoom?.roomNumber,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      adults: params.adults,
      children: params.children,
      ratePlanId: ratePlan.id,
      ratePlanName: ratePlan.name,
      source: 'website',
      status: 'confirmed',
      selectedServices: formattedServices,
      nightlyRate: baseNightly,
      nightsCount: nights,
      roomTotal,
      servicesTotal,
      promoCodeApplied: params.promoCode,
      discountAmount,
      taxAmount,
      totalAmount,
      paidAmount: totalAmount, // Paid online via simulated gateway
      balance: 0,
      paymentStatus: 'paid',
      specialRequests: params.specialRequests,
      createdAt: getTodayDate(),
      updatedAt: getTodayDate()
    };

    // 4. Create Folio
    const newFolio: Folio = {
      id: `fol_${reservationId}`,
      reservationId,
      guestId: guest.id,
      items: [
        {
          id: generateId('fi'),
          date: params.checkInDate,
          category: 'room',
          description: `${roomType.name} (${nights} kecha)`,
          quantity: nights,
          unitPrice: baseNightly,
          totalPrice: roomTotal
        },
        ...formattedServices.map(s => ({
          id: generateId('fi'),
          date: params.checkInDate,
          category: 'other' as const,
          description: s.name,
          quantity: s.quantity,
          unitPrice: s.price,
          totalPrice: s.price * s.quantity
        }))
      ],
      payments: [
        {
          id: generateId('pay'),
          date: getTodayDate(),
          amount: totalAmount,
          paymentMethod: params.paymentMethod,
          transactionRef: `ONL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          note: `Online to'lov (${params.paymentMethod.toUpperCase()})`,
          receivedBy: 'Online Gateway'
        }
      ],
      subtotal,
      taxAmount,
      serviceCharge: 0,
      discountAmount,
      total: totalAmount,
      paidTotal: totalAmount,
      balance: 0,
      status: 'settled'
    };

    // 5. Update state
    setReservations(prev => [newReservation, ...prev]);
    setFolios(prev => [newFolio, ...prev]);

    // Update real room status to 'reserved' if assigned
    if (assignedRoom) {
      setRooms(prev => prev.map(r => r.id === assignedRoom.id ? {
        ...r,
        status: r.status === 'available' ? 'reserved' : r.status,
        assignedGuestName: `${guest!.firstName} ${guest!.lastName}`,
        currentReservationId: reservationId
      } : r));
    }

    logAudit(
      'Yangi online bron', 
      'reservation', 
      reservationId, 
      `Mehmon: ${guest.firstName} ${guest.lastName}. Xona: ${roomType.name} (${assignedRoom?.roomNumber || 'Auto'}). Jami: ${totalAmount} so'm to'landi.`
    );

    addNotification(
      'Yangi Online Bron!',
      `${guest.firstName} ${guest.lastName} sayt orqali ${roomType.name} xonasini bron qildi (#${confirmationNumber}).`,
      'booking'
    );

    return { success: true, reservation: newReservation };
  };

  /**
   * CREATE RECEPTION RESERVATION (Walk-in, Phone, Corporate)
   */
  const createReceptionReservation = (params: CreateReceptionReservationParams) => {
    const availability = checkAvailability(params.roomTypeId, params.checkInDate, params.checkOutDate);
    if (!availability.isAvailable) {
      return { success: false, error: "Ushbu xona turida tanlangan sanalarga bo'sh joy mavjud emas." };
    }

    let guest: Guest;
    if (params.guestId) {
      guest = guests.find(g => g.id === params.guestId)!;
    } else if (params.newGuest) {
      guest = {
        id: generateId('gst'),
        firstName: params.newGuest.firstName,
        lastName: params.newGuest.lastName,
        phone: params.newGuest.phone,
        email: params.newGuest.email || `${params.newGuest.firstName.toLowerCase()}@hotelguest.uz`,
        nationality: params.newGuest.nationality || "O'zbekiston",
        passportNumber: params.newGuest.passportNumber,
        country: "O'zbekiston",
        notes: params.newGuest.notes,
        totalStays: 1,
        isVIP: !!params.newGuest.isVIP,
        createdAt: getTodayDate()
      };
      setGuests(prev => [guest, ...prev]);
    } else {
      return { success: false, error: "Mehmon ma'lumotlari kiritilmadi." };
    }

    const roomType = roomTypes.find(rt => rt.id === params.roomTypeId)!;
    const ratePlan = ratePlans.find(rp => rp.id === params.ratePlanId) || ratePlans[0];
    const nights = calculateNights(params.checkInDate, params.checkOutDate);

    // Selected physical room or first free one
    const targetRoomId = params.roomId || availability.availableRealRooms[0]?.id;
    const assignedRoom = rooms.find(r => r.id === targetRoomId);

    const baseNightly = roomType.basePrice * ratePlan.priceMultiplier;
    const roomTotal = baseNightly * nights;

    const formattedServices = params.selectedServices.map(s => {
      const svc = extraServices.find(es => es.id === s.serviceId);
      return {
        serviceId: s.serviceId,
        name: svc?.name || 'Xizmat',
        price: svc?.price || 0,
        quantity: s.quantity
      };
    });

    const servicesTotal = formattedServices.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    const subtotal = roomTotal + servicesTotal;
    const taxAmount = Math.round(subtotal * 0.12);
    const totalAmount = subtotal + taxAmount;

    const paidAmount = params.initialPaymentAmount || 0;
    const balance = totalAmount - paidAmount;
    const paymentStatus = balance <= 0 ? 'paid' : (paidAmount > 0 ? 'partial' : 'unpaid');

    const reservationId = generateId('res');
    const confirmationNumber = generateConfirmationNumber();

    const isInstant = params.isInstantCheckIn && params.checkInDate === getTodayDate();

    const newReservation: Reservation = {
      id: reservationId,
      confirmationNumber,
      guestId: guest.id,
      guest,
      roomTypeId: roomType.id,
      roomType,
      roomId: assignedRoom?.id,
      assignedRoomNumber: assignedRoom?.roomNumber,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      adults: params.adults,
      children: params.children,
      ratePlanId: ratePlan.id,
      ratePlanName: ratePlan.name,
      source: params.source,
      status: isInstant ? 'checked_in' : 'confirmed',
      selectedServices: formattedServices,
      nightlyRate: baseNightly,
      nightsCount: nights,
      roomTotal,
      servicesTotal,
      discountAmount: 0,
      taxAmount,
      totalAmount,
      paidAmount,
      balance,
      paymentStatus,
      specialRequests: params.specialRequests,
      createdAt: getTodayDate(),
      updatedAt: getTodayDate(),
      checkInTime: isInstant ? `${getTodayDate()} ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}` : undefined
    };

    // Folio creation
    const folioPayments: PaymentTransaction[] = [];
    if (paidAmount > 0 && params.paymentMethod) {
      folioPayments.push({
        id: generateId('pay'),
        date: getTodayDate(),
        amount: paidAmount,
        paymentMethod: params.paymentMethod,
        transactionRef: `REC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        note: `Reception to'lov (${params.source})`,
        receivedBy: 'Receptionist'
      });

      // Update cash register if paid in cash
      if (params.paymentMethod === 'cash') {
        setShift(prev => ({
          ...prev,
          cashReceived: prev.cashReceived + paidAmount,
          expectedCash: prev.expectedCash + paidAmount
        }));
      }
    }

    const newFolio: Folio = {
      id: `fol_${reservationId}`,
      reservationId,
      guestId: guest.id,
      items: [
        {
          id: generateId('fi'),
          date: params.checkInDate,
          category: 'room',
          description: `${roomType.name} (${nights} kecha)`,
          quantity: nights,
          unitPrice: baseNightly,
          totalPrice: roomTotal
        },
        ...formattedServices.map(s => ({
          id: generateId('fi'),
          date: params.checkInDate,
          category: 'other' as const,
          description: s.name,
          quantity: s.quantity,
          unitPrice: s.price,
          totalPrice: s.price * s.quantity
        }))
      ],
      payments: folioPayments,
      subtotal,
      taxAmount,
      serviceCharge: 0,
      discountAmount: 0,
      total: totalAmount,
      paidTotal: paidAmount,
      balance,
      status: balance <= 0 ? 'settled' : 'open'
    };

    setReservations(prev => [newReservation, ...prev]);
    setFolios(prev => [newFolio, ...prev]);

    // Update room status
    if (assignedRoom) {
      setRooms(prev => prev.map(r => r.id === assignedRoom.id ? {
        ...r,
        status: isInstant ? 'occupied' : 'reserved',
        assignedGuestName: `${guest.firstName} ${guest.lastName}`,
        currentReservationId: reservationId
      } : r));
    }

    logAudit(
      params.source === 'walk_in' ? 'Walk-in bron' : 'Reception yangi bron',
      'reservation',
      reservationId,
      `Manba: ${params.source}. Mehmon: ${guest.firstName} ${guest.lastName}. Xona: ${assignedRoom?.roomNumber || 'Tayinlanmagan'}.`
    );

    addNotification(
      'Yangi Bron kiritildi',
      `Reception tomonidan #${confirmationNumber} raqamli yangi bron yaratildi (${guest.firstName} ${guest.lastName}).`,
      'booking'
    );

    return { success: true, reservation: newReservation };
  };

  /**
   * CHECK-IN GUEST (Section 28-29)
   */
  const checkInGuest = (reservationId: string, assignedRoomId?: string, depositAmount?: number) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return { success: false, error: 'Bron topilmadi' };

    const targetRoomId = assignedRoomId || res.roomId;
    if (!targetRoomId) {
      return { success: false, error: 'Iltimos, avval mehmon uchun real xonani tayinlang!' };
    }

    const targetRoom = rooms.find(r => r.id === targetRoomId);
    if (!targetRoom) return { success: false, error: 'Xona topilmadi' };

    // Check if room is dirty or in maintenance
    if (targetRoom.status === 'dirty' || targetRoom.status === 'cleaning') {
      return { success: false, error: `Diqqat: ${targetRoom.roomNumber}-xona hozir toza emas (${targetRoom.status}). Housekeeping tozalashi kerak!` };
    }
    if (targetRoom.status === 'maintenance' || targetRoom.status === 'out_of_order') {
      return { success: false, error: `Diqqat: ${targetRoom.roomNumber}-xona ta'mirda!` };
    }

    // Process deposit if provided
    if (depositAmount && depositAmount > 0) {
      addPayment(reservationId, depositAmount, 'cash', 'Depozit summasi');
    }

    const checkInTime = `${getTodayDate()} ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;

    // Update reservation
    setReservations(prev => prev.map(r => r.id === reservationId ? {
      ...r,
      status: 'checked_in',
      roomId: targetRoom.id,
      assignedRoomNumber: targetRoom.roomNumber,
      checkInTime,
      depositAmount: (r.depositAmount || 0) + (depositAmount || 0),
      updatedAt: getTodayDate()
    } : r));

    // Update room to OCCUPIED
    setRooms(prev => prev.map(r => r.id === targetRoom.id ? {
      ...r,
      status: 'occupied',
      assignedGuestName: `${res.guest.firstName} ${res.guest.lastName}`,
      currentReservationId: reservationId
    } : r));

    logAudit(
      'Mehmon Check-in qilindi',
      'reservation',
      reservationId,
      `${res.guest.firstName} ${res.guest.lastName} ${targetRoom.roomNumber}-xonaga joylashtirildi.`
    );

    addNotification(
      'Mehmon Check-in qilindi',
      `${res.guest.firstName} ${res.guest.lastName} ${targetRoom.roomNumber}-xonaga muvaffaqiyatli kiritildi.`,
      'checkin'
    );

    return { success: true };
  };

  /**
   * CHECK-OUT GUEST (Section 30)
   * Folio balance check -> mark checked_out -> room becomes DIRTY -> Housekeeping task created
   */
  const checkOutGuest = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return { success: false, error: 'Bron topilmadi' };

    const folio = folios.find(f => f.reservationId === reservationId);
    if (folio && folio.balance > 0) {
      return { 
        success: false, 
        error: `Mehmonning to'lanmagan qarzi mavjud: ${folio.balance} so'm. Check-out qilishdan oldin folio hisobini to'lang!`,
        remainingBalance: folio.balance 
      };
    }

    const checkOutTime = `${getTodayDate()} ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;

    // 1. Update reservation
    setReservations(prev => prev.map(r => r.id === reservationId ? {
      ...r,
      status: 'checked_out',
      checkOutTime,
      updatedAt: getTodayDate()
    } : r));

    // 2. Mark Room as DIRTY
    if (res.roomId) {
      setRooms(prev => prev.map(r => r.id === res.roomId ? {
        ...r,
        status: 'dirty',
        housekeepingStatus: 'dirty',
        assignedGuestName: undefined,
        currentReservationId: undefined
      } : r));

      // 3. Create Housekeeping task automatically
      const newTask: HousekeepingTask = {
        id: generateId('hk'),
        roomId: res.roomId,
        roomNumber: res.assignedRoomNumber || 'N/A',
        taskType: 'checkout_clean',
        assignedTo: 'Housekeeping Navbatchisi',
        priority: 'high',
        status: 'pending',
        notes: `Mehmon ${res.guest.firstName} ${res.guest.lastName} check-out qildi. Xonani to'liq tozalash va tayyorlash lozim.`
      };
      setHousekeepingTasks(prev => [newTask, ...prev]);
    }

    logAudit(
      'Mehmon Check-out qilindi',
      'reservation',
      reservationId,
      `${res.guest.firstName} ${res.guest.lastName} ${res.assignedRoomNumber || ''}-xonadan check-out qildi. Xona 'Dirty' holatiga o'tkazildi.`
    );

    addNotification(
      'Check-out yakunlandi',
      `${res.assignedRoomNumber}-xona bo'shatildi va tozalash (Housekeeping) navbatiga qo'shildi.`,
      'checkout'
    );

    return { success: true };
  };

  /**
   * ASSIGN OR CHANGE ROOM (Upgrade / Room Move) (Section 59-61)
   */
  const assignOrChangeRoom = (reservationId: string, newRoomId: string, reason?: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return { success: false, error: 'Bron topilmadi' };

    const targetRoom = rooms.find(r => r.id === newRoomId);
    if (!targetRoom) return { success: false, error: 'Yangi xona topilmadi' };

    // Check if new room is free
    if (targetRoom.status === 'occupied' && targetRoom.id !== res.roomId) {
      return { success: false, error: 'Tanlangan yangi xona ayni damda band!' };
    }
    if (targetRoom.status === 'maintenance' || targetRoom.status === 'out_of_order') {
      return { success: false, error: 'Tanlangan yangi xona ta\'mirda!' };
    }

    const oldRoomId = res.roomId;
    const oldRoomNumber = res.assignedRoomNumber;

    // Release old room
    if (oldRoomId && oldRoomId !== newRoomId) {
      setRooms(prev => prev.map(r => r.id === oldRoomId ? {
        ...r,
        status: res.status === 'checked_in' ? 'dirty' : 'available',
        housekeepingStatus: res.status === 'checked_in' ? 'dirty' : r.housekeepingStatus,
        assignedGuestName: undefined,
        currentReservationId: undefined
      } : r));
    }

    // Occupy new room
    setRooms(prev => prev.map(r => r.id === newRoomId ? {
      ...r,
      status: res.status === 'checked_in' ? 'occupied' : 'reserved',
      assignedGuestName: `${res.guest.firstName} ${res.guest.lastName}`,
      currentReservationId: reservationId
    } : r));

    // Update reservation
    setReservations(prev => prev.map(r => r.id === reservationId ? {
      ...r,
      roomId: newRoomId,
      assignedRoomNumber: targetRoom.roomNumber,
      roomTypeId: targetRoom.roomTypeId,
      roomType: roomTypes.find(rt => rt.id === targetRoom.roomTypeId) || r.roomType,
      updatedAt: getTodayDate()
    } : r));

    logAudit(
      'Xona almashtirildi',
      'reservation',
      reservationId,
      `${res.guest.firstName} ${res.guest.lastName}: ${oldRoomNumber || 'Tayinlanmagan'} -> ${targetRoom.roomNumber}. Sabab: ${reason || 'Standart ko\'chirish'}.`
    );

    return { success: true };
  };

  /**
   * CANCEL RESERVATION (Section 34, 110)
   */
  const cancelReservation = (reservationId: string, reason: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return { success: false, error: 'Bron topilmadi' };

    setReservations(prev => prev.map(r => r.id === reservationId ? {
      ...r,
      status: 'cancelled',
      cancellationReason: reason,
      updatedAt: getTodayDate()
    } : r));

    // Free up room if assigned
    if (res.roomId) {
      setRooms(prev => prev.map(r => r.id === res.roomId ? {
        ...r,
        status: r.status === 'reserved' ? 'available' : r.status,
        assignedGuestName: undefined,
        currentReservationId: undefined
      } : r));
    }

    logAudit('Bron bekor qilindi', 'reservation', reservationId, `Sabab: ${reason}`);
    addNotification('Bron bekor qilindi', `#${res.confirmationNumber} raqamli bron bekor qilindi.`, 'alert');

    return { success: true };
  };

  /**
   * MARK AS NO-SHOW (Section 33)
   */
  const markAsNoShow = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return { success: false, error: 'Bron topilmadi' };

    setReservations(prev => prev.map(r => r.id === reservationId ? {
      ...r,
      status: 'no_show',
      updatedAt: getTodayDate()
    } : r));

    if (res.roomId) {
      setRooms(prev => prev.map(r => r.id === res.roomId ? {
        ...r,
        status: r.status === 'reserved' ? 'available' : r.status,
        assignedGuestName: undefined,
        currentReservationId: undefined
      } : r));
    }

    logAudit('No-show belgilandi', 'reservation', reservationId, `${res.guest.firstName} ${res.guest.lastName} kelmadi.`);
    return { success: true };
  };

  /**
   * ADD FOLIO ITEM (Minibar, Laundry, Restaurant, Room charge) (Section 42-44)
   */
  const addFolioItem = (reservationId: string, item: Omit<FolioItem, 'id'>) => {
    const newItem: FolioItem = { ...item, id: generateId('fi') };

    setFolios(prev => prev.map(f => {
      if (f.reservationId !== reservationId) return f;
      const updatedItems = [...f.items, newItem];
      const subtotal = updatedItems.reduce((sum, it) => sum + it.totalPrice, 0);
      const taxAmount = Math.round(subtotal * 0.12);
      const total = subtotal + taxAmount - f.discountAmount;
      const balance = total - f.paidTotal;

      return {
        ...f,
        items: updatedItems,
        subtotal,
        taxAmount,
        total,
        balance,
        status: balance <= 0 ? 'settled' : 'open'
      };
    }));

    // Also sync to reservation total & balance
    setReservations(prev => prev.map(r => {
      if (r.id !== reservationId) return r;
      const newTotal = r.totalAmount + newItem.totalPrice + Math.round(newItem.totalPrice * 0.12);
      const newBalance = newTotal - r.paidAmount;
      return {
        ...r,
        totalAmount: newTotal,
        balance: newBalance,
        paymentStatus: newBalance <= 0 ? 'paid' : (r.paidAmount > 0 ? 'partial' : 'unpaid')
      };
    }));

    logAudit(
      'Folio xarajati qo\'shildi',
      'payment',
      reservationId,
      `${item.description}: ${item.totalPrice} so'm qo'shildi.`
    );
  };

  /**
   * ADD PAYMENT (Deposit, Cash, Card, Folio Settlement) (Section 45-47)
   */
  const addPayment = (reservationId: string, amount: number, method: PaymentMethod, note?: string) => {
    const newPay: PaymentTransaction = {
      id: generateId('pay'),
      date: getTodayDate(),
      amount,
      paymentMethod: method,
      transactionRef: `REC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      note,
      receivedBy: 'Receptionist'
    };

    setFolios(prev => prev.map(f => {
      if (f.reservationId !== reservationId) return f;
      const updatedPayments = [...f.payments, newPay];
      const paidTotal = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const balance = f.total - paidTotal;

      return {
        ...f,
        payments: updatedPayments,
        paidTotal,
        balance,
        status: balance <= 0 ? 'settled' : 'open'
      };
    }));

    setReservations(prev => prev.map(r => {
      if (r.id !== reservationId) return r;
      const paidAmount = r.paidAmount + amount;
      const balance = r.totalAmount - paidAmount;
      return {
        ...r,
        paidAmount,
        balance,
        paymentStatus: balance <= 0 ? 'paid' : 'partial'
      };
    }));

    // Update cash drawer if cash
    if (method === 'cash') {
      setShift(prev => ({
        ...prev,
        cashReceived: prev.cashReceived + amount,
        expectedCash: prev.expectedCash + amount
      }));
    }

    logAudit(
      'To\'lov qabul qilindi',
      'payment',
      reservationId,
      `${amount} so'm (${method.toUpperCase()}). Izoh: ${note || '-'}`
    );
  };

  /**
   * HOUSEKEEPING STATUS UPDATE (Section 50-53)
   */
  const updateRoomHousekeeping = (roomId: string, status: HousekeepingStatus, notes?: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    let newRoomStatus = room.status;

    // Transition logic:
    // If room is occupied, housekeeping clean/inspected keeps room status as 'occupied'!
    // If room is vacant:
    if (room.status !== 'occupied') {
      if (status === 'clean' || status === 'inspected') {
        newRoomStatus = 'available';
      } else if (status === 'cleaning') {
        newRoomStatus = 'cleaning';
      } else if (status === 'dirty') {
        newRoomStatus = 'dirty';
      }
    }

    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      housekeepingStatus: status,
      status: newRoomStatus,
      notes: notes || r.notes
    } : r));

    // Update corresponding task if any
    setHousekeepingTasks(prev => prev.map(t => {
      if (t.roomId === roomId && t.status !== 'completed') {
        return {
          ...t,
          status: status === 'inspected' ? 'inspected' : (status === 'clean' ? 'completed' : 'in_progress'),
          completedAt: (status === 'clean' || status === 'inspected') ? `${getTodayDate()} ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}` : t.completedAt
        };
      }
      return t;
    }));

    logAudit(
      'Housekeeping status yangilandi',
      'housekeeping',
      roomId,
      `${room.roomNumber}-xona statusi: ${status.toUpperCase()} ga o'zgartirildi.`
    );
  };

  /**
   * MAINTENANCE TICKETS (Section 54-55)
   */
  const createMaintenanceTicket = (roomId: string, title: string, description: string, priority: MaintenanceTicket['priority']) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const newTicket: MaintenanceTicket = {
      id: generateId('mnt'),
      roomId,
      roomNumber: room.roomNumber,
      title,
      description,
      priority,
      assignedTo: 'Texnik xodim',
      status: 'open',
      createdAt: `${getTodayDate()} ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`
    };

    setMaintenanceTickets(prev => [newTicket, ...prev]);

    // Put room into MAINTENANCE status
    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: 'maintenance',
      notes: `Ta'mir: ${title}`
    } : r));

    logAudit('Texnik xizmat so\'rovi', 'room', roomId, `${room.roomNumber}-xona: ${title} (${priority})`);
    addNotification('Nosozlik qayd etildi', `${room.roomNumber}-xona uchun yangi ta'mir xabari yaratildi.`, 'maintenance');
  };

  const resolveMaintenanceTicket = (ticketId: string) => {
    const ticket = maintenanceTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    setMaintenanceTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      status: 'resolved',
      resolvedAt: `${getTodayDate()} ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`
    } : t));

    // Return room to 'dirty' so it gets cleaned before sale!
    setRooms(prev => prev.map(r => r.id === ticket.roomId ? {
      ...r,
      status: 'dirty',
      housekeepingStatus: 'dirty',
      notes: 'Ta\'mir tugatildi, xonani tozalash lozim'
    } : r));

    logAudit('Texnik nosozlik bartaraf etildi', 'room', ticket.roomId, `Ticket #${ticketId} hal qilindi.`);
  };

  /**
   * CASH DRAWER & SHIFT (Section 86-87)
   */
  const recordCashTransaction = (type: 'deposit' | 'expense', amount: number, note: string) => {
    setShift(prev => ({
      ...prev,
      expenses: type === 'expense' ? prev.expenses + amount : prev.expenses,
      cashReceived: type === 'deposit' ? prev.cashReceived + amount : prev.cashReceived,
      expectedCash: type === 'expense' ? prev.expectedCash - amount : prev.expectedCash + amount
    }));

    logAudit(
      type === 'expense' ? 'Kassadan chiqim' : 'Kassaga kirim',
      'shift',
      shift.id,
      `${amount} so'm. Izoh: ${note}`
    );
  };

  const closeShift = (actualCash: number, notes?: string) => {
    const discrepancy = actualCash - shift.expectedCash;
    setShift(prev => ({
      ...prev,
      actualCash,
      discrepancy,
      status: 'closed',
      endTime: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      notes
    }));

    logAudit(
      'Smena yopildi',
      'shift',
      shift.id,
      `Kutilgan kassa: ${shift.expectedCash}, Haqiqiy sanalgan: ${actualCash}, Farq: ${discrepancy} so'm.`
    );
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_rooms`);
    localStorage.removeItem(`${STORAGE_KEY}_reservations`);
    localStorage.removeItem(`${STORAGE_KEY}_guests`);
    localStorage.removeItem(`${STORAGE_KEY}_folios`);
    localStorage.removeItem(`${STORAGE_KEY}_housekeeping`);
    localStorage.removeItem(`${STORAGE_KEY}_maintenance`);
    localStorage.removeItem(`${STORAGE_KEY}_shift`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);

    setRooms(initialRooms);
    setReservations(initialReservations);
    setGuests(initialGuests);
    setFolios(initialFolios);
    setHousekeepingTasks(initialHousekeepingTasks);
    setMaintenanceTickets(initialMaintenanceTickets);
    setShift(initialShift);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <HotelContext.Provider value={{
      rooms,
      roomTypes,
      reservations,
      guests,
      folios,
      housekeepingTasks,
      maintenanceTickets,
      ratePlans,
      promoCodes,
      extraServices,
      shift,
      auditLogs,
      notifications,
      currentUserRole,
      systemMode,
      unreadNotificationCount,

      setSystemMode,
      setCurrentUserRole,
      checkAvailability,
      createOnlineReservation,
      createReceptionReservation,
      checkInGuest,
      checkOutGuest,
      assignOrChangeRoom,
      cancelReservation,
      markAsNoShow,
      addFolioItem,
      addPayment,
      updateRoomHousekeeping,
      createMaintenanceTicket,
      resolveMaintenanceTicket,
      recordCashTransaction,
      closeShift,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      resetToDemoData
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
