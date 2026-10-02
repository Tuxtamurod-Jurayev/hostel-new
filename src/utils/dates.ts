export function getTodayDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNDaysLater(days: number, fromDate?: string): string {
  const d = fromDate ? new Date(fromDate) : new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

/**
 * Checks if two date ranges overlap.
 * Standard hotel check-in/out logic:
 * [start1, end1) overlaps with [start2, end2) if start1 < end2 AND end1 > start2.
 * Same day check-out and check-in (e.g., Guest A leaves Oct 18 at 12:00, Guest B arrives Oct 18 at 14:00) does NOT conflict!
 */
export function isDateOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  return start1 < end2 && end1 > start2;
}

export function generateDateRange(startDate: string, days: number): string[] {
  const result: string[] = [];
  const base = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const cur = new Date(base);
    cur.setDate(cur.getDate() + i);
    const year = cur.getFullYear();
    const month = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
  }
  return result;
}
