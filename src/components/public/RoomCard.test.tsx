import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RoomCard } from './RoomCard';
import { HotelProvider } from '../../context/HotelContext';
import { initialRoomTypes } from '../../data/initialData';

const testRoomType = {
  ...initialRoomTypes[0], // rt_single
  name: 'Single Deluxe Test',
  code: 'SGL-DLX',
  amenities: ['Wi-Fi 6', 'Konditsioner', 'Smart TV 43"', 'Elektron seyf', 'Mini-muzlatgich']
};

const renderRoomCard = (props: Partial<React.ComponentProps<typeof RoomCard>> = {}) => {
  const defaultProps = {
    roomType: testRoomType,
    checkInDate: '2026-12-01',
    checkOutDate: '2026-12-04', // 3 nights
    onSelectForBooking: vi.fn(),
    onViewDetails: vi.fn(),
    ...props
  };

  return {
    ...render(
      <HotelProvider>
        <RoomCard {...defaultProps} />
      </HotelProvider>
    ),
    props: defaultProps
  };
};

describe('RoomCard Component Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render room type details, specifications, and amenities', () => {
    renderRoomCard();

    expect(screen.getByText('Single Deluxe Test')).toBeInTheDocument();
    expect(screen.getByText('SGL-DLX')).toBeInTheDocument();
    expect(screen.getByText(/24 m² kenglik/i)).toBeInTheDocument();
    expect(screen.getByText(/1 katta/i)).toBeInTheDocument();

    // Amenities
    expect(screen.getByText('Wi-Fi 6')).toBeInTheDocument();
    expect(screen.getByText('Konditsioner')).toBeInTheDocument();
    expect(screen.getByText('+1 yana')).toBeInTheDocument(); // 5 amenities - 4 = 1 more
  });

  it('should calculate total stay price for given number of nights', () => {
    renderRoomCard({
      checkInDate: '2026-12-01',
      checkOutDate: '2026-12-04' // 3 nights * 350,000 = 1,050,000
    });

    expect(screen.getByText(/3 kecha uchun jami:/i)).toBeInTheDocument();
    expect(screen.getByText(/1.*050.*000/)).toBeInTheDocument();
  });

  it('should trigger onViewDetails when detail eye button is clicked', () => {
    const onViewDetails = vi.fn();
    renderRoomCard({ onViewDetails });

    const detailBtn = screen.getByTitle(/Batafsil rasmlar va qulayliklar/i);
    fireEvent.click(detailBtn);

    expect(onViewDetails).toHaveBeenCalledTimes(1);
    expect(onViewDetails).toHaveBeenCalledWith(testRoomType);
  });

  it('should trigger onSelectForBooking when Bron qilish button is clicked for available room', () => {
    const onSelectForBooking = vi.fn();
    renderRoomCard({ onSelectForBooking });

    const bookBtn = screen.getByRole('button', { name: /Bron qilish/i });
    expect(bookBtn).toBeEnabled();
    fireEvent.click(bookBtn);

    expect(onSelectForBooking).toHaveBeenCalledTimes(1);
    expect(onSelectForBooking).toHaveBeenCalledWith(testRoomType);
  });

  it('should show Band and disable button when room has no availability', () => {
    const unavailableRoomType = {
      ...testRoomType,
      id: 'rt_non_existent'
    };

    renderRoomCard({
      roomType: unavailableRoomType
    });

    const bandBtn = screen.getByRole('button', { name: /Band/i });
    expect(bandBtn).toBeDisabled();
    expect(screen.getByText(/Tanlangan sanalarga band/i)).toBeInTheDocument();
  });
});
