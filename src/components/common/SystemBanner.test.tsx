import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SystemBanner } from './SystemBanner';
import { HotelProvider } from '../../context/HotelContext';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<HotelProvider>{ui}</HotelProvider>);
};

describe('SystemBanner Component Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render brand title and default public mode pill active', () => {
    renderWithProvider(<SystemBanner />);

    expect(screen.getByText(/SILK ROAD PALACE/i)).toBeInTheDocument();
    expect(screen.getByText(/Mehmon Sayti & Online Bron/i)).toBeInTheDocument();
    expect(screen.getByText(/Front Office PMS Panel/i)).toBeInTheDocument();
  });

  it('should switch to PMS mode when PMS button is clicked and display role selector', () => {
    renderWithProvider(<SystemBanner />);

    const pmsButton = screen.getByText(/Front Office PMS Panel/i).closest('button')!;
    fireEvent.click(pmsButton);

    // After switching to PMS, Role selector should be visible
    expect(screen.getByText(/Rol:/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should allow changing staff role in PMS mode', () => {
    renderWithProvider(<SystemBanner />);

    // Switch to PMS first
    const pmsButton = screen.getByText(/Front Office PMS Panel/i).closest('button')!;
    fireEvent.click(pmsButton);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'reception' } });

    expect(select.value).toBe('reception');
  });

  it('should toggle notifications dropdown when bell icon is clicked', () => {
    renderWithProvider(<SystemBanner />);

    const bellBtn = screen.getByTitle(/Xabarnomalar/i);
    fireEvent.click(bellBtn);

    expect(screen.getByText(/Bildirishnomalar/i)).toBeInTheDocument();

    // Click again to close
    fireEvent.click(bellBtn);
    expect(screen.queryByText(/Bildirishnomalar/i)).not.toBeInTheDocument();
  });

  it('should prompt confirmation and trigger reset on Reset Demo button click', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithProvider(<SystemBanner />);

    const resetBtn = screen.getByTitle(/Barcha ma'lumotlarni qayta tiklash/i);
    fireEvent.click(resetBtn);

    expect(confirmSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();

    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
