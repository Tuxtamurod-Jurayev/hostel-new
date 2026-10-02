import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  formatCurrency, 
  formatShortDate, 
  generateConfirmationNumber, 
  generateId 
} from './formatters';

describe('formatters utils', () => {
  describe('formatCurrency', () => {
    it('should format numbers with Uzbek currency suffix "so\'m"', () => {
      const result = formatCurrency(450000);
      // Clean non-breaking spaces for cross-platform consistency
      const normalized = result.replace(/[\s\u00A0\u202F]/g, ' ');
      expect(normalized).toBe("450 000 so'm");
    });

    it('should format zero correctly', () => {
      const result = formatCurrency(0);
      expect(result).toContain("0 so'm");
    });

    it('should format millions correctly', () => {
      const result = formatCurrency(1250000);
      const normalized = result.replace(/[\s\u00A0\u202F]/g, ' ');
      expect(normalized).toBe("1 250 000 so'm");
    });
  });

  describe('formatShortDate', () => {
    it('should return empty string if input is empty or null', () => {
      expect(formatShortDate('')).toBe('');
    });

    it('should format valid date string with Uzbek month name', () => {
      // Using year, month index, day date constructor string format or ISO with time
      const result = formatShortDate('2026-05-20T12:00:00');
      expect(result).toBe('20-May, 2026');
    });

    it('should correctly format month for October', () => {
      const result = formatShortDate('2026-10-15T12:00:00');
      expect(result).toBe('15-Okt, 2026');
    });
  });

  describe('generateConfirmationNumber', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 9, 15, 12, 0, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should generate a confirmation number starting with "HTL-" and containing date', () => {
      const conf = generateConfirmationNumber();
      expect(conf).toMatch(/^HTL-\d{8}-[A-Z0-9]+$/);
    });

    it('should generate unique confirmation numbers across multiple calls', () => {
      const conf1 = generateConfirmationNumber();
      const conf2 = generateConfirmationNumber();
      expect(conf1).not.toBe(conf2);
    });
  });

  describe('generateId', () => {
    it('should generate an ID with default prefix "id"', () => {
      const id = generateId();
      expect(id.startsWith('id_')).toBe(true);
    });

    it('should support custom prefix', () => {
      const resId = generateId('res');
      expect(resId.startsWith('res_')).toBe(true);
    });

    it('should generate distinct IDs', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');
      expect(id1).not.toBe(id2);
    });
  });
});
