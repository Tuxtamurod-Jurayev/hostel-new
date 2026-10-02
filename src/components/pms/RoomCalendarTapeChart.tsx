import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { generateDateRange, getTodayDate, isDateOverlap } from '../../utils/dates';
import { Calendar, ChevronLeft, ChevronRight, Plus, Eye, Wrench } from 'lucide-react';
import { Reservation, Room } from '../../types/hotel';

interface RoomCalendarTapeChartProps {
  onOpenReservationFolio: (reservationId: string) => void;
  onQuickBookRoom: (roomId: string, date: string) => void;
}

export const RoomCalendarTapeChart: React.FC<RoomCalendarTapeChartProps> = ({
  onOpenReservationFolio,
  onQuickBookRoom
}) => {
  const { rooms, roomTypes, reservations } = useHotel();
  const [startDate, setStartDate] = useState(getTodayDate());
  const daysToShow = 14;

  const dates = generateDateRange(startDate, daysToShow);

  const shiftDates = (deltaDays: number) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + deltaDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setStartDate(`${year}-${month}-${day}`);
  };

  // Find if a room is occupied/reserved on a specific day
  const getCellContent = (room: Room, date: string) => {
    // Check maintenance first
    if (room.status === 'maintenance') {
      return { type: 'maintenance', label: 'Ta\'mirda (M)' };
    }

    // Check reservations that span this date
    // Note: a reservation with checkIn <= date < checkOut occupies this date
    const res = reservations.find(r => {
      if (r.roomId !== room.id) return false;
      if (r.status === 'cancelled' || r.status === 'no_show') return false;
      return date >= r.checkInDate && date < r.checkOutDate;
    });

    if (res) {
      return {
        type: 'reservation',
        reservation: res,
        label: `${res.guest.firstName} ${res.guest.lastName.charAt(0)}.`
      };
    }

    return { type: 'free' };
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      padding: '1.75rem',
      border: '1px solid var(--slate-200)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header with Navigation and Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-900)' }}>
            Xona Kalendari (Tape Chart & Room Matrix)
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            14 kunlik rejalashtirish jadvali. Bo'sh katakchani bosib to'g'ridan-to'g'ri bron yaratishingiz mumkin.
          </div>
        </div>

        {/* Date Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => shiftDates(-7)}
            className="btn btn-secondary btn-sm"
            title="7 kun orqaga"
          >
            <ChevronLeft size={16} />
            <span>-7 kun</span>
          </button>

          <button 
            onClick={() => setStartDate(getTodayDate())}
            className="btn btn-secondary btn-sm"
          >
            Bugun
          </button>

          <button 
            onClick={() => shiftDates(7)}
            className="btn btn-secondary btn-sm"
            title="7 kun oldinga"
          >
            <span>+7 kun</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '0.75rem 1rem',
        background: 'var(--slate-50)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.25rem',
        fontSize: '0.8rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--status-occupied-bg)', border: '1px solid var(--status-occupied-border)' }} />
          <span>Yashamoqda (Checked-in)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--status-reserved-bg)', border: '1px solid var(--status-reserved-border)' }} />
          <span>Bron qilingan (Confirmed)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--status-maintenance-bg)', border: '1px solid var(--status-maintenance-border)' }} />
          <span>Nosozlik / Ta'mir (Maintenance)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#ffffff', border: '1px solid var(--slate-300)' }} />
          <span>Bo'sh (Bron qilish uchun ochiq)</span>
        </div>
      </div>

      {/* Grid Table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
          <thead>
            <tr>
              <th style={{
                position: 'sticky',
                left: 0,
                background: 'var(--navy-900)',
                color: '#ffffff',
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                textAlign: 'left',
                width: '160px',
                zIndex: 10
              }}>
                XONA / TOIFA
              </th>
              {dates.map((d, idx) => {
                const dateObj = new Date(d);
                const dayNum = dateObj.getDate();
                const dayName = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'][dateObj.getDay()];
                const isToday = d === getTodayDate();

                return (
                  <th 
                    key={d}
                    style={{
                      background: isToday ? 'var(--gold-100)' : 'var(--slate-100)',
                      color: isToday ? 'var(--gold-600)' : 'var(--slate-700)',
                      borderLeft: '1px solid var(--slate-200)',
                      padding: '0.5rem 0.25rem',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      minWidth: '58px'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{dayNum}</div>
                    <div style={{ fontSize: '0.7rem', color: isToday ? 'var(--gold-600)' : 'var(--slate-500)' }}>
                      {dayName}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => {
              const rType = roomTypes.find(rt => rt.id === room.roomTypeId);

              return (
                <tr key={room.id} style={{ borderTop: '1px solid var(--slate-200)' }}>
                  {/* Sticky Room Label Column */}
                  <td style={{
                    position: 'sticky',
                    left: 0,
                    background: '#ffffff',
                    padding: '0.75rem 1rem',
                    zIndex: 5,
                    borderRight: '2px solid var(--slate-200)',
                    boxShadow: '2px 0 5px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        background: 'var(--navy-900)',
                        color: 'var(--gold-400)',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}>
                        #{room.roomNumber}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--slate-600)', fontWeight: 600 }}>
                        {rType?.code}
                      </span>
                    </div>
                  </td>

                  {/* 14 Date Columns for this room */}
                  {dates.map(dateStr => {
                    const cell = getCellContent(room, dateStr);

                    if (cell.type === 'maintenance') {
                      return (
                        <td 
                          key={dateStr}
                          style={{
                            background: 'var(--status-maintenance-bg)',
                            borderLeft: '1px solid var(--slate-200)',
                            textAlign: 'center',
                            padding: '0.4rem 0.2rem',
                            fontSize: '0.7rem',
                            color: '#991b1b',
                            fontWeight: 700
                          }}
                          title="Xona ta'mirda (Maintenance)"
                        >
                          <Wrench size={13} style={{ display: 'inline' }} />
                        </td>
                      );
                    }

                    if (cell.type === 'reservation' && cell.reservation) {
                      const isCheckIn = cell.reservation.status === 'checked_in';
                      return (
                        <td 
                          key={dateStr}
                          onClick={() => onOpenReservationFolio(cell.reservation.id)}
                          style={{
                            background: isCheckIn ? 'var(--status-occupied-bg)' : 'var(--status-reserved-bg)',
                            borderLeft: '1px solid var(--slate-200)',
                            textAlign: 'center',
                            padding: '0.4rem 0.2rem',
                            fontSize: '0.72rem',
                            color: isCheckIn ? '#3730a3' : '#0369a1',
                            fontWeight: 700,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={`Bron: ${cell.reservation.guest.firstName} ${cell.reservation.guest.lastName} (${cell.reservation.status})`}
                        >
                          {cell.label}
                        </td>
                      );
                    }

                    // Free cell: clickable to quick book!
                    return (
                      <td 
                        key={dateStr}
                        onClick={() => onQuickBookRoom(room.id, dateStr)}
                        style={{
                          background: '#ffffff',
                          borderLeft: '1px solid var(--slate-200)',
                          textAlign: 'center',
                          padding: '0.4rem 0.2rem',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--status-available-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                        }}
                        title={`#${room.roomNumber} xonani ${dateStr} sanasiga bron qilish`}
                      >
                        <span style={{ opacity: 0.15, fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                          +
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
