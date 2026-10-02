import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getTodayDate, 
  getNDaysLater, 
  calculateNights, 
  isDateOverlap, 
  generateDateRange 
} from './dates';

describe('dates utils', () => {
  beforeEach(() => {
    // Mock system date to a predictable date: 2026-10-15
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 12, 0, 0)); // Month is 0-indexed: 9 = October
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTodayDate', () => {
    it('should return current date in YYYY-MM-DD format', () => {
      const today = getTodayDate();
      expect(today).toBe('2026-10-15');
    });

    it('should correctly pad single-digit months and days with leading zero', () => {
      vi.setSystemTime(new Date(2026, 0, 5)); // 2026-01-05
      expect(getTodayDate()).toBe('2026-01-05');
    });
  });

  describe('getNDaysLater', () => {
    it('should calculate date N days from today by default', () => {
      const result = getNDaysLater(3);
      expect(result).toBe('2026-10-18');
    });

    it('should calculate date N days from a specified base date', () => {
      const result = getNDaysLater(5, '2026-11-20');
      expect(result).toBe('2026-11-25');
    });

    it('should handle month rollovers correctly', () => {
      const result = getNDaysLater(20, '2026-10-20');
      expect(result).toBe('2026-11-09');
    });

    it('should handle year rollovers correctly', () => {
      const result = getNDaysLater(10, '2026-12-25');
      expect(result).toBe('2027-01-04');
    });
  });

  describe('calculateNights', () => {
    it('should calculate the exact number of nights between checkIn and checkOut', () => {
      const nights = calculateNights('2026-10-15', '2026-10-18');
      expect(nights).toBe(3);
    });

    it('should return 1 night if checkIn and checkOut are the same day (minimum stay rule)', () => {
      const nights = calculateNights('2026-10-15', '2026-10-15');
      expect(nights).toBe(1);
    });

    it('should return at least 1 night even if checkout is erroneously before checkin', () => {
      const nights = calculateNights('2026-10-18', '2026-10-15');
      expect(nights).toBe(1);
    });
  });

  describe('isDateOverlap', () => {
    // Hotel rule: [start, end)
    it('should return false when bookings do not overlap (booking 1 ends before booking 2 starts)', () => {
      const overlap = isDateOverlap('2026-10-10', '2026-10-12', '2026-10-15', '2026-10-18');
      expect(overlap).toBe(false);
    });

    it('should return false for same-day turnover (Guest A checks out Oct 15 at 12:00, Guest B checks in Oct 15 at 14:00)', () => {
      const overlap = isDateOverlap('2026-10-12', '2026-10-15', '2026-10-15', '2026-10-18');
      expect(overlap).toBe(false);
    });

    it('should return true when date ranges overlap in the middle', () => {
      const overlap = isDateOverlap('2026-10-14', '2026-10-17', '2026-10-15', '2026-10-19');
      expect(overlap).toBe(true);
    });

    it('should return true when range 1 completely contains range 2', () => {
      const overlap = isDateOverlap('2026-10-10', '2026-10-25', '2026-10-12', '2026-10-15');
      expect(overlap).toBe(true);
    });

    it('should return true for identical date ranges', () => {
      const overlap = isDateOverlap('2026-10-15', '2026-10-18', '2026-10-15', '2026-10-18');
      expect(overlap).toBe(true);
    });
  });

  describe('generateDateRange', () => {
    it('should generate an array of sequential dates for the given days count', () => {
      const dates = generateDateRange('2026-10-15', 3);
      expect(dates).toEqual(['2026-10-15', '2026-10-16', '2026-10-17']);
    });

    it('should return an empty array if days is 0', () => {
      const dates = generateDateRange('2026-10-15', 0);
      expect(dates).toEqual([]);
    });

    it('should handle month transition in generated date range', () => {
      const dates = generateDateRange('2026-10-30', 3);
      expect(dates).toEqual(['2026-10-30', '2026-10-31', '2026-11-01']);
    });
  });
});
