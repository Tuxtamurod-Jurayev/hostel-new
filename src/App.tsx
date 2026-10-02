import React, { useState, useRef } from 'react';
import { useHotel, HotelProvider } from './context/HotelContext';
import { RoomType } from './types/hotel';
import { getTodayDate, getNDaysLater } from './utils/dates';

// Common
import { SystemBanner } from './components/common/SystemBanner';

// Public Website
import { PublicNavbar } from './components/public/PublicNavbar';
import { HeroSection } from './components/public/HeroSection';
import { RoomCard } from './components/public/RoomCard';
import { RoomDetailModal } from './components/public/RoomDetailModal';
import { OnlineBookingModal } from './components/public/OnlineBookingModal';
import { CheckBookingModal } from './components/public/CheckBookingModal';
import { ServicesSection } from './components/public/ServicesSection';
import { GallerySection } from './components/public/GallerySection';
import { AboutContactSection } from './components/public/AboutContactSection';
import { PublicFooter } from './components/public/PublicFooter';

// PMS
import { PMSHeader } from './components/pms/PMSHeader';
import { PMSSidebar, PMSTab } from './components/pms/PMSSidebar';
import { FrontOfficeDashboard } from './components/pms/FrontOfficeDashboard';
import { ArrivalsDeparturesView } from './components/pms/ArrivalsDeparturesView';
import { InHouseGuestsView } from './components/pms/InHouseGuestsView';
import { RoomCalendarTapeChart } from './components/pms/RoomCalendarTapeChart';
import { ReservationsMasterView } from './components/pms/ReservationsMasterView';
import { RoomManagementView } from './components/pms/RoomManagementView';
import { HousekeepingView } from './components/pms/HousekeepingView';
import { GuestCRMView } from './components/pms/GuestCRMView';
import { RatesPromoView } from './components/pms/RatesPromoView';
import { ReportsAnalyticsView } from './components/pms/ReportsAnalyticsView';

// PMS Modals
import { NewReceptionBookingModal } from './components/pms/NewReceptionBookingModal';
import { CheckInModal } from './components/pms/CheckInModal';
import { CheckOutModal } from './components/pms/CheckOutModal';
import { FolioModal } from './components/pms/FolioModal';
import { InvoiceReceiptModal } from './components/pms/InvoiceReceiptModal';
import { RoomMoveModal } from './components/pms/RoomMoveModal';
import { CashRegisterModal } from './components/pms/CashRegisterModal';
import { AuditLogsModal } from './components/pms/AuditLogsModal';

export const AppContent: React.FC = () => {
  const { systemMode, roomTypes, reservations } = useHotel();

  // Public Booking Engine Search Bar State
  const [checkInDate, setCheckInDate] = useState(getTodayDate());
  const [checkOutDate, setCheckOutDate] = useState(getNDaysLater(2, getTodayDate()));
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedRoomTypeFilter, setSelectedRoomTypeFilter] = useState('all');

  // Public Modals
  const [bookingRoomType, setBookingRoomType] = useState<RoomType | null>(null);
  const [detailRoomType, setDetailRoomType] = useState<RoomType | null>(null);
  const [checkBookingOpen, setCheckBookingOpen] = useState(false);

  // PMS Navigation State
  const [pmsActiveTab, setPmsActiveTab] = useState<PMSTab>('dashboard');

  // PMS Modal Triggers
  const [pmsNewBookingModal, setPmsNewBookingModal] = useState<{ open: boolean; source: 'walk_in' | 'phone'; roomId?: string; date?: string }>({ open: false, source: 'walk_in' });
  const [activeCheckInResId, setActiveCheckInResId] = useState<string | null>(null);
  const [activeCheckOutResId, setActiveCheckOutResId] = useState<string | null>(null);
  const [activeFolioResId, setActiveFolioResId] = useState<string | null>(null);
  const [activeInvoiceResId, setActiveInvoiceResId] = useState<string | null>(null);
  const [activeRoomMoveResId, setActiveRoomMoveResId] = useState<string | null>(null);
  const [cashRegisterOpen, setCashRegisterOpen] = useState(false);
  const [auditLogOpen, setAuditLogOpen] = useState(false);

  // Smooth scroll refs
  const roomsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered rooms for public view
  const displayRoomTypes = selectedRoomTypeFilter === 'all'
    ? roomTypes
    : roomTypes.filter(rt => rt.id === selectedRoomTypeFilter);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Universal Mode Banner (Guest Website vs PMS Staff Panel) */}
      <SystemBanner />

      {/* ========================================================================= */}
      {/* PUBLIC WEBSITE MODE */}
      {/* ========================================================================= */}
      {systemMode === 'public' && (
        <main className="animate-fade-in" style={{ flex: 1 }}>
          <PublicNavbar 
            onOpenCheckBooking={() => setCheckBookingOpen(true)}
            onScrollToRooms={() => scrollToSection(roomsRef)}
            onScrollToServices={() => scrollToSection(servicesRef)}
            onScrollToGallery={() => scrollToSection(galleryRef)}
            onScrollToAbout={() => scrollToSection(aboutRef)}
          />

          <HeroSection 
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            adults={adults}
            childrenCount={childrenCount}
            selectedRoomTypeFilter={selectedRoomTypeFilter}
            onCheckInChange={setCheckInDate}
            onCheckOutChange={setCheckOutDate}
            onAdultsChange={setAdults}
            onChildrenChange={setChildrenCount}
            onRoomTypeFilterChange={setSelectedRoomTypeFilter}
            onSearch={() => scrollToSection(roomsRef)}
          />

          {/* Rooms and Rates Listing Section */}
          <section ref={roomsRef} id="rooms" style={{ padding: '6rem 0', background: 'var(--slate-50)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--gold-600)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em'
                }}>
                  XONALAR VA TARIFLAR
                </span>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--navy-900)', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  O'zingizga mos hashamatli xonani tanlang
                </h2>
                <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6 }}>
                  Har bir xona turi real-time mavjudlik bilan ko'rsatiladi. Double-booking'dan 100% himoyalangan tizim.
                </p>
              </div>

              {/* Room Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '2rem'
              }}>
                {displayRoomTypes.map(rt => (
                  <RoomCard 
                    key={rt.id}
                    roomType={rt}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    onSelectForBooking={(type) => setBookingRoomType(type)}
                    onViewDetails={(type) => setDetailRoomType(type)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Hotel Services */}
          <div ref={servicesRef}>
            <ServicesSection />
          </div>

          {/* Photo Gallery */}
          <div ref={galleryRef}>
            <GallerySection />
          </div>

          {/* About & Contact */}
          <div ref={aboutRef}>
            <AboutContactSection />
          </div>

          <PublicFooter />

          {/* Public Modals */}
          {bookingRoomType && (
            <OnlineBookingModal 
              roomType={bookingRoomType}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              adults={adults}
              childrenCount={childrenCount}
              onClose={() => setBookingRoomType(null)}
            />
          )}

          {detailRoomType && (
            <RoomDetailModal 
              roomType={detailRoomType}
              onClose={() => setDetailRoomType(null)}
              onBookNow={(type) => {
                setDetailRoomType(null);
                setBookingRoomType(type);
              }}
            />
          )}

          {checkBookingOpen && (
            <CheckBookingModal onClose={() => setCheckBookingOpen(false)} />
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* FRONT OFFICE PMS MODE */}
      {/* ========================================================================= */}
      {systemMode === 'pms' && (
        <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <PMSHeader 
            onOpenNewWalkIn={() => setPmsNewBookingModal({ open: true, source: 'walk_in' })}
            onOpenNewPhoneBooking={() => setPmsNewBookingModal({ open: true, source: 'phone' })}
            onOpenCashRegister={() => setCashRegisterOpen(true)}
            onOpenAuditLog={() => setAuditLogOpen(true)}
          />

          <div style={{ display: 'flex', flex: 1 }}>
            <PMSSidebar 
              activeTab={pmsActiveTab}
              onTabChange={setPmsActiveTab}
            />

            <main style={{ flex: 1, padding: '2rem', background: 'var(--slate-100)', minHeight: 'calc(100vh - 110px)' }}>
              {pmsActiveTab === 'dashboard' && (
                <FrontOfficeDashboard 
                  onNavigateTab={(tab) => setPmsActiveTab(tab)}
                  onOpenCheckInModal={(resId) => setActiveCheckInResId(resId)}
                  onOpenCheckOutModal={(resId) => setActiveCheckOutResId(resId)}
                  onOpenNewWalkIn={() => setPmsNewBookingModal({ open: true, source: 'walk_in' })}
                />
              )}

              {pmsActiveTab === 'arrivals' && (
                <ArrivalsDeparturesView 
                  initialMode="arrivals"
                  onOpenFolio={(resId) => setActiveFolioResId(resId)}
                  onOpenCheckIn={(resId) => setActiveCheckInResId(resId)}
                  onOpenCheckOut={(resId) => setActiveCheckOutResId(resId)}
                />
              )}

              {pmsActiveTab === 'departures' && (
                <ArrivalsDeparturesView 
                  initialMode="departures"
                  onOpenFolio={(resId) => setActiveFolioResId(resId)}
                  onOpenCheckIn={(resId) => setActiveCheckInResId(resId)}
                  onOpenCheckOut={(resId) => setActiveCheckOutResId(resId)}
                />
              )}

              {pmsActiveTab === 'in_house' && (
                <InHouseGuestsView 
                  onOpenFolio={(resId) => setActiveFolioResId(resId)}
                  onOpenAddService={(resId) => setActiveFolioResId(resId)}
                  onOpenRoomMove={(resId) => setActiveRoomMoveResId(resId)}
                  onOpenCheckOut={(resId) => setActiveCheckOutResId(resId)}
                />
              )}

              {pmsActiveTab === 'calendar' && (
                <RoomCalendarTapeChart 
                  onOpenReservationFolio={(resId) => setActiveFolioResId(resId)}
                  onQuickBookRoom={(roomId, date) => {
                    setPmsNewBookingModal({ open: true, source: 'walk_in', roomId, date });
                  }}
                />
              )}

              {pmsActiveTab === 'reservations' && (
                <ReservationsMasterView 
                  onOpenFolio={(resId) => setActiveFolioResId(resId)}
                  onOpenCheckIn={(resId) => setActiveCheckInResId(resId)}
                  onOpenCheckOut={(resId) => setActiveCheckOutResId(resId)}
                  onOpenRoomMove={(resId) => setActiveRoomMoveResId(resId)}
                  onPrintInvoice={(resId) => setActiveInvoiceResId(resId)}
                />
              )}

              {pmsActiveTab === 'rooms' && (
                <RoomManagementView />
              )}

              {pmsActiveTab === 'housekeeping' && (
                <HousekeepingView />
              )}

              {pmsActiveTab === 'maintenance' && (
                <HousekeepingView />
              )}

              {pmsActiveTab === 'guests' && (
                <GuestCRMView />
              )}

              {pmsActiveTab === 'rates' && (
                <RatesPromoView />
              )}

              {pmsActiveTab === 'reports' && (
                <ReportsAnalyticsView />
              )}
            </main>
          </div>

          {/* PMS Modals */}
          {pmsNewBookingModal.open && (
            <NewReceptionBookingModal 
              initialSource={pmsNewBookingModal.source}
              initialRoomId={pmsNewBookingModal.roomId}
              initialDate={pmsNewBookingModal.date}
              onClose={() => setPmsNewBookingModal({ open: false, source: 'walk_in' })}
            />
          )}

          {activeCheckInResId && (
            <CheckInModal 
              reservationId={activeCheckInResId}
              onClose={() => setActiveCheckInResId(null)}
            />
          )}

          {activeCheckOutResId && (
            <CheckOutModal 
              reservationId={activeCheckOutResId}
              onClose={() => setActiveCheckOutResId(null)}
              onOpenFolio={(resId) => {
                setActiveCheckOutResId(null);
                setActiveFolioResId(resId);
              }}
            />
          )}

          {activeFolioResId && (
            <FolioModal 
              reservationId={activeFolioResId}
              onClose={() => setActiveFolioResId(null)}
              onPrintInvoice={(resId) => {
                setActiveFolioResId(null);
                setActiveInvoiceResId(resId);
              }}
            />
          )}

          {activeInvoiceResId && (
            <InvoiceReceiptModal 
              reservationId={activeInvoiceResId}
              onClose={() => setActiveInvoiceResId(null)}
            />
          )}

          {activeRoomMoveResId && (
            <RoomMoveModal 
              reservationId={activeRoomMoveResId}
              onClose={() => setActiveRoomMoveResId(null)}
            />
          )}

          {cashRegisterOpen && (
            <CashRegisterModal onClose={() => setCashRegisterOpen(false)} />
          )}

          {auditLogOpen && (
            <AuditLogsModal onClose={() => setAuditLogOpen(false)} />
          )}

        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <AppContent />
    </HotelProvider>
  );
}
