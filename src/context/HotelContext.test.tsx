import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { HotelProvider, useHotel } from './HotelContext';
import { getTodayDate, getNDaysLater } from '../utils/dates';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HotelProvider>{children}</HotelProvider>
);

describe('HotelContext Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial State and Mode Management', () => {
    it('should initialize with default hotel state', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });

      expect(result.current.systemMode).toBe('public');
      expect(result.current.currentUserRole).toBe('super_admin');
      expect(result.current.rooms.length).toBeGreaterThan(0);
      expect(result.current.roomTypes.length).toBeGreaterThan(0);
      expect(result.current.reservations.length).toBeGreaterThan(0);
      expect(result.current.guests.length).toBeGreaterThan(0);
      expect(result.current.folios.length).toBeGreaterThan(0);
      expect(result.current.shift.status).toBe('active');
    });

    it('should allow toggling system mode between public and pms', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });

      act(() => {
        result.current.setSystemMode('pms');
      });
      expect(result.current.systemMode).toBe('pms');

      act(() => {
        result.current.setSystemMode('public');
      });
      expect(result.current.systemMode).toBe('public');
    });

    it('should allow changing current user role', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });

      act(() => {
        result.current.setCurrentUserRole('reception');
      });
      expect(result.current.currentUserRole).toBe('reception');
    });
  });

  describe('Availability Engine (checkAvailability)', () => {
    it('should report availability for future dates without bookings', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const futureStart = getNDaysLater(60);
      const futureEnd = getNDaysLater(63);

      const check = result.current.checkAvailability('rt_single', futureStart, futureEnd);
      expect(check.isAvailable).toBe(true);
      expect(check.availableCount).toBeGreaterThan(0);
      expect(check.availableRealRooms.length).toBeGreaterThan(0);
    });

    it('should ignore cancelled or checked_out reservations when calculating availability', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const futureStart = getNDaysLater(10);
      const futureEnd = getNDaysLater(12);

      // Book a room
      let resId = '';
      act(() => {
        const res = result.current.createOnlineReservation({
          roomTypeId: 'rt_suite',
          ratePlanId: 'rp_standard',
          checkInDate: futureStart,
          checkOutDate: futureEnd,
          adults: 2,
          children: 0,
          guestFirstName: 'Test',
          guestLastName: 'User',
          guestPhone: '+998901234567',
          guestEmail: 'test@example.com',
          guestPassport: 'AB1234567',
          selectedServices: [],
          paymentMethod: 'card'
        });
        resId = res.reservation?.id || '';
      });

      expect(resId).toBeTruthy();

      // Cancel reservation
      act(() => {
        result.current.cancelReservation(resId, 'Mijoz bekor qildi');
      });

      // Availability should remain positive
      const check = result.current.checkAvailability('rt_suite', futureStart, futureEnd);
      expect(check.isAvailable).toBe(true);
    });

    it('should exclude the current reservation when excludeReservationId is provided (for room modification)', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const activeRes = result.current.reservations.find(r => r.status === 'confirmed');
      if (activeRes) {
        const checkWithSelf = result.current.checkAvailability(
          activeRes.roomTypeId,
          activeRes.checkInDate,
          activeRes.checkOutDate,
          activeRes.id
        );
        const checkWithoutExclusion = result.current.checkAvailability(
          activeRes.roomTypeId,
          activeRes.checkInDate,
          activeRes.checkOutDate
        );
        expect(checkWithSelf.availableCount).toBeGreaterThanOrEqual(checkWithoutExclusion.availableCount);
      }
    });
  });

  describe('Online Booking Engine (createOnlineReservation)', () => {
    it('should successfully create an online booking with folio and pricing breakdown', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const checkIn = getNDaysLater(25);
      const checkOut = getNDaysLater(28); // 3 nights

      let bookingResult: any;
      act(() => {
        bookingResult = result.current.createOnlineReservation({
          roomTypeId: 'rt_single',
          ratePlanId: 'rp_standard',
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adults: 1,
          children: 0,
          guestFirstName: 'Anvar',
          guestLastName: 'Sobirov',
          guestPhone: '+998909998877',
          guestEmail: 'anvar@mail.uz',
          guestPassport: 'AA5544332',
          selectedServices: [
            { serviceId: 'srv_breakfast', quantity: 3 }
          ],
          promoCode: 'WELCOME10',
          paymentMethod: 'card'
        });
      });

      expect(bookingResult.success).toBe(true);
      expect(bookingResult.reservation).toBeDefined();

      const res = bookingResult.reservation!;
      expect(res.nightsCount).toBe(3);
      expect(res.discountAmount).toBeGreaterThan(0); // 10% discount applied
      expect(res.status).toBe('confirmed');
      expect(res.paymentStatus).toBe('paid'); // online card payment auto-marks paid

      // Verify Folio was automatically created
      const folio = result.current.folios.find(f => f.reservationId === res.id);
      expect(folio).toBeDefined();
      expect(folio?.total).toBe(res.totalAmount);
      expect(folio?.paidTotal).toBe(res.totalAmount);
      expect(folio?.balance).toBe(0);
      expect(folio?.status).toBe('settled');
    });

    it('should register or update guest information upon booking', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const checkIn = getNDaysLater(30);
      const checkOut = getNDaysLater(32);

      act(() => {
        result.current.createOnlineReservation({
          roomTypeId: 'rt_double',
          ratePlanId: 'rp_standard',
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adults: 2,
          children: 0,
          guestFirstName: 'Dilshod',
          guestLastName: 'Nazarov',
          guestPhone: '+998971112233',
          guestEmail: 'dilshod@test.uz',
          guestPassport: 'AC9988776',
          selectedServices: [],
          paymentMethod: 'payme'
        });
      });

      const guest = result.current.guests.find(g => g.passportNumber === 'AC9988776');
      expect(guest).toBeDefined();
      expect(guest?.firstName).toBe('Dilshod');
      expect(guest?.lastName).toBe('Nazarov');
    });
  });

  describe('Reception & Front Desk Bookings (createReceptionReservation)', () => {
    it('should create a walk-in booking with instant check-in', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const futureDate = getNDaysLater(40);
      const futureDateEnd = getNDaysLater(41);

      let receptionRes: any;
      act(() => {
        receptionRes = result.current.createReceptionReservation({
          newGuest: {
            firstName: 'Shohruh',
            lastName: 'Qodirov',
            phone: '+998934445566',
            email: 'shohruh@mail.com',
            passportNumber: 'AD1122334',
            nationality: "O'zbekiston"
          },
          roomTypeId: 'rt_single',
          checkInDate: futureDate,
          checkOutDate: futureDateEnd,
          adults: 1,
          children: 0,
          ratePlanId: 'rp_standard',
          source: 'reception',
          selectedServices: [],
          initialPaymentAmount: 392000,
          paymentMethod: 'cash',
          isInstantCheckIn: false
        });
      });

      expect(receptionRes.success).toBe(true);
      const reservation = receptionRes.reservation!;
      expect(reservation.status).toBe('confirmed');
      expect(reservation.roomId).toBeDefined();

      // Check cash register updated
      expect(result.current.shift.cashReceived).toBeGreaterThan(0);
    });
  });

  describe('Check-In Flow (checkInGuest)', () => {
    it('should successfully check-in a confirmed reservation', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const futureStart = getNDaysLater(15);
      const futureEnd = getNDaysLater(16);

      // Create a confirmed booking first
      let resId = '';
      act(() => {
        const createRes = result.current.createReceptionReservation({
          newGuest: {
            firstName: 'Bekzod',
            lastName: 'Aliyev',
            phone: '+998901110022',
            email: 'bekzod@test.uz',
            passportNumber: 'AE5566778',
            nationality: "O'zbekiston"
          },
          roomTypeId: 'rt_single',
          checkInDate: futureStart,
          checkOutDate: futureEnd,
          adults: 1,
          children: 0,
          ratePlanId: 'rp_standard',
          source: 'reception',
          selectedServices: [],
          isInstantCheckIn: false
        });
        resId = createRes.reservation!.id;
      });

      // Find an available clean room or make a room available
      let cleanRoom = result.current.rooms.find(r => r.status === 'available');
      if (!cleanRoom) {
        cleanRoom = result.current.rooms[0];
        act(() => {
          result.current.updateRoomHousekeeping(cleanRoom!.id, 'clean');
        });
      }
      expect(cleanRoom).toBeDefined();

      let checkInResult: any;
      act(() => {
        checkInResult = result.current.checkInGuest(resId, cleanRoom!.id, 100000);
      });

      expect(checkInResult.success).toBe(true);

      const updatedRes = result.current.reservations.find(r => r.id === resId);
      expect(updatedRes?.status).toBe('checked_in');
      expect(updatedRes?.roomId).toBe(cleanRoom!.id);

      const updatedRoom = result.current.rooms.find(r => r.id === cleanRoom!.id);
      expect(updatedRoom?.status).toBe('occupied');
    });

    it('should reject check-in if the target room is dirty or undergoing maintenance', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const dirtyRoom = result.current.rooms.find(r => r.roomTypeId === 'rt_single')!;

      // Mark room as dirty
      act(() => {
        result.current.updateRoomHousekeeping(dirtyRoom.id, 'dirty');
      });

      // Try checking in to the dirty room
      const activeRes = result.current.reservations.find(r => r.status === 'confirmed');
      if (activeRes) {
        let checkInRes: any;
        act(() => {
          checkInRes = result.current.checkInGuest(activeRes.id, dirtyRoom.id);
        });
        expect(checkInRes.success).toBe(false);
        expect(checkInRes.error).toContain('toza emas');
      }
    });
  });

  describe('Folio Management and Payments (addFolioItem, addPayment)', () => {
    it('should add extra folio items and recalculate tax and balance', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const res = result.current.reservations[0];
      const initialFolio = result.current.folios.find(f => f.reservationId === res.id);
      const initialBalance = initialFolio?.balance || 0;

      act(() => {
        result.current.addFolioItem(res.id, {
          date: getTodayDate(),
          category: 'minibar',
          description: 'Premium Shokolad & Sharbat',
          quantity: 2,
          unitPrice: 50000,
          totalPrice: 100000
        });
      });

      const updatedFolio = result.current.folios.find(f => f.reservationId === res.id);
      expect(updatedFolio?.items.some(i => i.description === 'Premium Shokolad & Sharbat')).toBe(true);
      // Extra 100000 + 12% tax = 112000 increase
      expect(updatedFolio?.balance).toBe(initialBalance + 112000);
    });

    it('should record payment transactions and settle the folio balance', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const res = result.current.reservations[0];
      const folio = result.current.folios.find(f => f.reservationId === res.id)!;
      const unpaidBalance = folio.balance;

      if (unpaidBalance > 0) {
        act(() => {
          result.current.addPayment(res.id, unpaidBalance, 'card', 'Karta orqali toliq tolov');
        });

        const updatedFolio = result.current.folios.find(f => f.reservationId === res.id);
        expect(updatedFolio?.balance).toBe(0);
        expect(updatedFolio?.status).toBe('settled');

        const updatedRes = result.current.reservations.find(r => r.id === res.id);
        expect(updatedRes?.paymentStatus).toBe('paid');
      }
    });
  });

  describe('Check-Out Flow (checkOutGuest)', () => {
    it('should prevent check-out if the guest has unpaid balance', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      
      // Setup a checked-in guest with unpaid charges
      const inHouseRes = result.current.reservations.find(r => r.status === 'checked_in');
      if (inHouseRes) {
        // Add an unpaid charge
        act(() => {
          result.current.addFolioItem(inHouseRes.id, {
            date: getTodayDate(),
            category: 'restaurant',
            description: 'Kechki ovqat',
            quantity: 1,
            unitPrice: 200000,
            totalPrice: 200000
          });
        });

        let checkOutRes: any;
        act(() => {
          checkOutRes = result.current.checkOutGuest(inHouseRes.id);
        });

        expect(checkOutRes.success).toBe(false);
        expect(checkOutRes.error).toContain("to'lanmagan qarzi mavjud");
        expect(checkOutRes.remainingBalance).toBeGreaterThan(0);
      }
    });

    it('should successfully check out guest with zero balance, mark room dirty, and create housekeeping task', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const inHouseRes = result.current.reservations.find(r => r.status === 'checked_in');
      
      if (inHouseRes) {
        const folio = result.current.folios.find(f => f.reservationId === inHouseRes.id);
        if (folio && folio.balance > 0) {
          act(() => {
            result.current.addPayment(inHouseRes.id, folio.balance, 'cash', 'Hisobni yopish');
          });
        }

        const roomId = inHouseRes.roomId;
        let checkOutRes: any;
        act(() => {
          checkOutRes = result.current.checkOutGuest(inHouseRes.id);
        });

        expect(checkOutRes.success).toBe(true);

        // Check reservation status
        const updatedRes = result.current.reservations.find(r => r.id === inHouseRes.id);
        expect(updatedRes?.status).toBe('checked_out');

        // Check room status is dirty
        if (roomId) {
          const room = result.current.rooms.find(r => r.id === roomId);
          expect(room?.status).toBe('dirty');
          expect(room?.housekeepingStatus).toBe('dirty');

          // Check housekeeping checkout task created
          const task = result.current.housekeepingTasks.find(t => t.roomId === roomId && t.taskType === 'checkout_clean');
          expect(task).toBeDefined();
        }
      }
    });
  });

  describe('Room Move / Assignment (assignOrChangeRoom)', () => {
    it('should move an in-house guest to a new room and mark old room dirty', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const inHouseRes = result.current.reservations.find(r => r.status === 'checked_in');
      
      if (inHouseRes && inHouseRes.roomId) {
        const oldRoomId = inHouseRes.roomId;
        const targetRoom = result.current.rooms.find(r => r.status === 'available' && r.id !== oldRoomId);
        
        if (targetRoom) {
          let moveRes: any;
          act(() => {
            moveRes = result.current.assignOrChangeRoom(inHouseRes.id, targetRoom.id, 'Upgrade xonaga kochirish');
          });

          expect(moveRes.success).toBe(true);

          // Old room should become dirty
          const oldRoom = result.current.rooms.find(r => r.id === oldRoomId);
          expect(oldRoom?.status).toBe('dirty');

          // New room should become occupied
          const newRoom = result.current.rooms.find(r => r.id === targetRoom.id);
          expect(newRoom?.status).toBe('occupied');

          // Reservation updated
          const updatedRes = result.current.reservations.find(r => r.id === inHouseRes.id);
          expect(updatedRes?.roomId).toBe(targetRoom.id);
        }
      }
    });

    it('should reject room move if the new room is occupied', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const inHouseRes = result.current.reservations.find(r => r.status === 'checked_in');
      const occupiedRoom = result.current.rooms.find(r => r.status === 'occupied' && r.id !== inHouseRes?.roomId);

      if (inHouseRes && occupiedRoom) {
        let moveRes: any;
        act(() => {
          moveRes = result.current.assignOrChangeRoom(inHouseRes.id, occupiedRoom.id);
        });

        expect(moveRes.success).toBe(false);
        expect(moveRes.error).toContain('band');
      }
    });
  });

  describe('Housekeeping and Maintenance Workflow', () => {
    it('should update room housekeeping status and make room available when inspected', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const testRoom = result.current.rooms.find(r => r.status !== 'occupied')!;

      act(() => {
        result.current.updateRoomHousekeeping(testRoom.id, 'cleaning');
      });
      let room = result.current.rooms.find(r => r.id === testRoom.id);
      expect(room?.housekeepingStatus).toBe('cleaning');

      act(() => {
        result.current.updateRoomHousekeeping(testRoom.id, 'clean');
      });
      room = result.current.rooms.find(r => r.id === testRoom.id);
      expect(room?.status).toBe('available');

      act(() => {
        result.current.updateRoomHousekeeping(testRoom.id, 'inspected');
      });
      room = result.current.rooms.find(r => r.id === testRoom.id);
      expect(room?.housekeepingStatus).toBe('inspected');
      expect(room?.status).toBe('available');
    });

    it('should create maintenance ticket and put room into maintenance status', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const testRoom = result.current.rooms.find(r => r.status === 'available')!;

      act(() => {
        result.current.createMaintenanceTicket(testRoom.id, 'Konditsioner nosozligi', 'Sovutmayapti', 'high');
      });

      const room = result.current.rooms.find(r => r.id === testRoom.id);
      expect(room?.status).toBe('maintenance');

      const ticket = result.current.maintenanceTickets.find(t => t.roomId === testRoom.id && t.title === 'Konditsioner nosozligi');
      expect(ticket).toBeDefined();
      expect(ticket?.priority).toBe('high');
      expect(ticket?.status).toBe('open');

      // Resolve maintenance ticket
      act(() => {
        result.current.resolveMaintenanceTicket(ticket!.id);
      });

      const resolvedTicket = result.current.maintenanceTickets.find(t => t.id === ticket!.id);
      expect(resolvedTicket?.status).toBe('resolved');

      // Room returns to dirty for cleaning before booking
      const roomAfterResolve = result.current.rooms.find(r => r.id === testRoom.id);
      expect(roomAfterResolve?.status).toBe('dirty');
    });
  });

  describe('Shift Management & Cash Control', () => {
    it('should record cash transactions and update expected cash', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const initialCash = result.current.shift.expectedCash;

      act(() => {
        result.current.recordCashTransaction('deposit', 150000, 'Xo\'jalik uchun kirim');
      });
      expect(result.current.shift.expectedCash).toBe(initialCash + 150000);

      act(() => {
        result.current.recordCashTransaction('expense', 50000, 'Kantselyariya xarajatlari');
      });
      expect(result.current.shift.expectedCash).toBe(initialCash + 100000);
      expect(result.current.shift.expenses).toBeGreaterThanOrEqual(50000);
    });

    it('should close shift and calculate cash discrepancy', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });
      const expected = result.current.shift.expectedCash;

      act(() => {
        // Actual cash is 10,000 less than expected
        result.current.closeShift(expected - 10000, 'Smena yakunlandi');
      });

      expect(result.current.shift.status).toBe('closed');
      expect(result.current.shift.actualCash).toBe(expected - 10000);
      expect(result.current.shift.discrepancy).toBe(-10000);
    });
  });

  describe('Notifications and Demo Reset', () => {
    it('should add notifications and mark them as read', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });

      act(() => {
        result.current.addNotification('Test Bildirishnoma', 'Muhim xabar matni', 'alert');
      });

      const notif = result.current.notifications.find(n => n.title === 'Test Bildirishnoma');
      expect(notif).toBeDefined();
      expect(notif?.isRead).toBe(false);

      act(() => {
        result.current.markNotificationAsRead(notif!.id);
      });

      const updatedNotif = result.current.notifications.find(n => n.id === notif!.id);
      expect(updatedNotif?.isRead).toBe(true);

      act(() => {
        result.current.markAllNotificationsAsRead();
      });
      expect(result.current.unreadNotificationCount).toBe(0);
    });

    it('should restore initial datasets when resetToDemoData is invoked', () => {
      const { result } = renderHook(() => useHotel(), { wrapper });

      act(() => {
        result.current.resetToDemoData();
      });

      expect(result.current.shift.status).toBe('active');
      expect(result.current.rooms.length).toBeGreaterThan(0);
      expect(result.current.roomTypes.length).toBeGreaterThan(0);
    });
  });
});
