export type UserRole = 'super_admin' | 'hotel_admin' | 'reception' | 'housekeeping' | 'accountant' | 'guest';

export type RoomStatus = 
  | 'available' 
  | 'occupied' 
  | 'reserved' 
  | 'dirty' 
  | 'cleaning' 
  | 'clean' 
  | 'inspected' 
  | 'maintenance' 
  | 'out_of_order' 
  | 'blocked';

export type HousekeepingStatus = 'clean' | 'dirty' | 'cleaning' | 'inspected';

export type ReservationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'tentative' 
  | 'checked_in' 
  | 'checked_out' 
  | 'cancelled' 
  | 'no_show';

export type ReservationSource = 
  | 'website' 
  | 'reception' 
  | 'phone' 
  | 'walk_in' 
  | 'email' 
  | 'ota' 
  | 'agency' 
  | 'corporate';

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online' | 'payme' | 'click' | 'uzum';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface RoomType {
  id: string;
  name: string;
  code: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  sizeSqm: number;
  basePrice: number; // in UZS per night
  amenities: string[];
  images: string[];
  featuredImage: string;
  status: 'active' | 'inactive';
}

export interface Room {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  floor: number;
  status: RoomStatus;
  housekeepingStatus: HousekeepingStatus;
  isActive: boolean;
  notes?: string;
  assignedGuestName?: string;
  currentReservationId?: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  nationality: string;
  passportNumber: string;
  country: string;
  city?: string;
  address?: string;
  companyName?: string;
  notes?: string;
  preferences?: string[];
  totalStays: number;
  isVIP: boolean;
  createdAt: string;
}

export interface FolioItem {
  id: string;
  date: string;
  category: 'room' | 'breakfast' | 'restaurant' | 'minibar' | 'laundry' | 'transfer' | 'extra_bed' | 'late_checkout' | 'early_checkin' | 'other';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  note?: string;
  receivedBy: string;
}

export interface Folio {
  id: string;
  reservationId: string;
  guestId: string;
  items: FolioItem[];
  payments: PaymentTransaction[];
  subtotal: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  total: number;
  paidTotal: number;
  balance: number;
  status: 'open' | 'settled' | 'refunded';
}

export interface ExtraServiceOption {
  id: string;
  name: string;
  category: 'breakfast' | 'transfer' | 'laundry' | 'minibar' | 'extra_bed' | 'spa';
  price: number;
  unit: 'per_day' | 'per_stay' | 'per_person';
  description: string;
  iconName: string;
}

export interface RatePlan {
  id: string;
  name: string;
  code: string;
  description: string;
  priceMultiplier: number; // e.g. 1.0 for standard, 0.85 for non-refundable, 1.20 for weekend
  isRefundable: boolean;
  cancellationHours: number;
  breakfastIncluded: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  validUntil: string;
  description: string;
  isActive: boolean;
  usageCount: number;
}

export interface Reservation {
  id: string;
  confirmationNumber: string; // e.g. HTL-20261002-A8F92
  guestId: string;
  guest: Guest;
  roomTypeId: string;
  roomType: RoomType;
  roomId?: string; // Assigned real room (e.g. 301)
  assignedRoomNumber?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults: number;
  children: number;
  ratePlanId: string;
  ratePlanName: string;
  source: ReservationSource;
  status: ReservationStatus;
  selectedServices: {
    serviceId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  nightlyRate: number;
  nightsCount: number;
  roomTotal: number;
  servicesTotal: number;
  promoCodeApplied?: string;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentStatus: PaymentStatus;
  depositAmount?: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationReason?: string;
  cancellationPenalty?: number;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  taskType: 'daily_clean' | 'checkout_clean' | 'deep_clean' | 'inspection';
  assignedTo: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'inspected';
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface MaintenanceTicket {
  id: string;
  roomId: string;
  roomNumber: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  cost?: number;
}

export interface StaffShift {
  id: string;
  shiftName: 'morning' | 'evening' | 'night';
  operatorName: string;
  date: string;
  startTime: string;
  endTime?: string;
  openingCashBalance: number;
  cashReceived: number;
  cashRefunds: number;
  expenses: number;
  expectedCash: number;
  actualCash?: number;
  discrepancy?: number;
  status: 'active' | 'closed';
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  role: string;
  action: string;
  entityType: 'reservation' | 'room' | 'guest' | 'payment' | 'housekeeping' | 'rate' | 'shift';
  entityId: string;
  details: string;
}

export interface HotelNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'checkin' | 'checkout' | 'payment' | 'housekeeping' | 'maintenance' | 'alert';
  isRead: boolean;
  linkId?: string;
}
